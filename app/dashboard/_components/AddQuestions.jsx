"use client";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { chatSession } from "@/utils/GeminiAIModal";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { Question } from "@/utils/schema";
import { useRouter } from "next/navigation";

const AddQuestions = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [typeQuestion, setTypeQuestion] = useState("");
  const [company, setCompany] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const handleInputChange = (setState) => (e) => {
    setState(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const InputPrompt = `
Job Positions: ${jobPosition},
Job Description: ${jobDesc},
Years of Experience: ${jobExperience},
Which type of question: ${typeQuestion},
Company: ${company},
Based on this information, provide 5 interview questions with answers in JSON format.
Each question must have "Question" and "Answer" fields.
`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);

      const rawText = result.response
        .text()
        .replace("```json", "")
        .replace("```", "")
        .trim();

      console.log("AI RESPONSE:", rawText);

      const resp = await db
        .insert(Question)
        .values({
          mockId: uuidv4(),
          MockQuestionJsonResp: rawText,
          jobPosition,
          jobDesc,
          jobExperience,
          typeQuestion,
          company,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("YYYY-MM-DD"),
        })
        .returning({ mockId: Question.mockId });

      if (resp) {
        setOpenDialog(false);
        router.push("/dashboard/pyq/" + resp[0]?.mockId);
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Trigger Card */}
      <div
        className="p-10 rounded-lg border bg-secondary hover:scale-105 hover:shadow-sm transition-all cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New Questions</h2>
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What model questions are you seeking</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-muted-foreground mt-2">
            <h2 className="mb-4">
              Add details about your job position, description, and experience
            </h2>

            <form onSubmit={onSubmit}>
              <div className="space-y-4">
                <div>
                  <label>Job Role / Position</label>
                  <Input
                    value={jobPosition}
                    placeholder="Ex. Full Stack Developer"
                    required
                    onChange={handleInputChange(setJobPosition)}
                  />
                </div>

                <div>
                  <label>Job Description / Tech Stack</label>
                  <Textarea
                    value={jobDesc}
                    placeholder="React, Node, MongoDB..."
                    required
                    onChange={handleInputChange(setJobDesc)}
                  />
                </div>

                <div>
                  <label>Type of Questions</label>
                  <Input
                    value={typeQuestion}
                    placeholder="Ex. DSA, System Design"
                    required
                    onChange={handleInputChange(setTypeQuestion)}
                  />
                </div>

                <div>
                  <label>Company</label>
                  <Input
                    value={company}
                    placeholder="Ex. Google, Microsoft"
                    required
                    onChange={handleInputChange(setCompany)}
                  />
                </div>

                <div>
                  <label>Years of Experience</label>
                  <Input
                    type="number"
                    value={jobExperience}
                    placeholder="Ex. 3"
                    required
                    onChange={handleInputChange(setJobExperience)}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-5 justify-end mt-6">
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
                    "Generate Questions"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddQuestions;
