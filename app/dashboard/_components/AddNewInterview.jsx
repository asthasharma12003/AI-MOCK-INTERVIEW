"use client";

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { LoaderCircle } from "lucide-react";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";

import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

import model from "@/utils/GeminiAIModal"; // ✅ FIXED IMPORT

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");

  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const inputPrompt = `
Job Position: ${jobPosition}
Job Description: ${jobDesc}
Experience: ${jobExperience}

Generate 5 interview questions with answers in strict JSON format:
[
  { "Question": "...", "Answer": "..." }
]
`;

    try {
      // ✅ Gemini call
const result = await model.sendMessage(inputPrompt);
const text = result.response.text();

// clean AI response
let cleaned = text;

// remove markdown code blocks
cleaned = cleaned.replace(/```json/g, "");
cleaned = cleaned.replace(/```/g, "");
cleaned = cleaned.trim();

// extract only JSON part (SAFE FIX)
const jsonStart = cleaned.indexOf("[");
const jsonEnd = cleaned.lastIndexOf("]");

let parsed = [];

try {
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonString = cleaned.slice(jsonStart, jsonEnd + 1);
    parsed = JSON.parse(jsonString);
  }
} catch (err) {
  console.log("JSON Parse Error:", cleaned);
  parsed = [];
}
      // ✅ save to DB
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(parsed),
          jobPosition,
          jobDesc,
          jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("YYYY-MM-DD"),
        })
        .returning({ mockId: MockInterview.mockId });

      if (resp?.length > 0) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + resp[0].mockId);
      }
    } catch (error) {
      console.error("Error generating interview:", error);
    }

    finally {
  setLoading(false);
}
  };

  return (
    <div>
      {/* CARD */}
      <div
        className="p-10 rounded-lg border bg-secondary hover:scale-105 transition cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      {/* DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Create Mock Interview
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4 mt-4">
            <Input
              placeholder="Job Role (e.g. Full Stack Developer)"
              required
              onChange={(e) => setJobPosition(e.target.value)}
            />

            <Textarea
              placeholder="Job Description (React, Node, MongoDB...)"
              required
              onChange={(e) => setJobDesc(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Experience (e.g. 2, 5 years)"
              required
              onChange={(e) => setJobExperience(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;