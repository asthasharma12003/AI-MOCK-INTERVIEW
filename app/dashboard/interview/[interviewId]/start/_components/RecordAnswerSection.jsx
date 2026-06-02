"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import chatSession from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { WebCamContext } from "@/app/dashboard/layout";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const { webCamEnabled, setWebCamEnabled } =
    useContext(WebCamContext);

  useEffect(() => {
    if (results.length > 0) {
      const transcript = results
        .map((result) => result.transcript)
        .join(" ");

      setUserAnswer(transcript);
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      updateUserAnswer();
    }
  }, [isRecording]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      setUserAnswer("");
      setResults([]);
      startSpeechToText();
    }
  };

  const updateUserAnswer = async () => {
    try {
      setLoading(true);

      const feedbackPrompt = `
Question: ${mockInterviewQuestion?.[activeQuestionIndex]?.Question}

User Answer: ${userAnswer}

Based on the interview question and user answer, give:
1. rating out of 10
2. feedback in 3-5 lines

Return ONLY valid JSON format:

{
  "rating":"8/10",
  "feedback":"Your feedback here"
}
`;

      const result = await chatSession.sendMessage(feedbackPrompt);

      let responseText = result.response.text();

      responseText = responseText
        .replace("```json", "")
        .replace("```", "")
        .trim();

      let jsonFeedbackResp;

      try {
        jsonFeedbackResp = JSON.parse(responseText);
      } catch (error) {
        console.log("JSON Error:", responseText);
        toast("Invalid AI response");
        setLoading(false);
        return;
      }

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question:
          mockInterviewQuestion?.[activeQuestionIndex]?.Question,
        correctAns:
          mockInterviewQuestion?.[activeQuestionIndex]?.Answer,
        userAns: userAnswer,
        feedback: jsonFeedbackResp?.feedback,
        rating: jsonFeedbackResp?.rating,
        userEmail:
          user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });

      toast("Answer Recorded Successfully");

      setUserAnswer("");
      setResults([]);
    } catch (error) {
      console.error(error);
      toast("Failed to save answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-col justify-center items-center rounded-lg p-5 bg-black mt-4 w-[30rem]">
        {webCamEnabled ? (
          <Webcam
            mirrored={true}
            style={{
              height: 250,
              width: "100%",
              zIndex: 10,
            }}
          />
        ) : (
          <Image
            src="/camera.jpg"
            width={200}
            height={200}
            alt="camera"
          />
        )}
      </div>

      <div className="md:flex mt-4 md:mt-8 md:gap-5">
        <Button
          onClick={() =>
            setWebCamEnabled((prev) => !prev)
          }
        >
          {webCamEnabled
            ? "Close WebCam"
            : "Enable WebCam"}
        </Button>

        <Button
          variant="outline"
          onClick={StartStopRecording}
          disabled={loading}
        >
          {isRecording ? (
            <span className="text-red-500 flex gap-2">
              <Mic />
              Stop Recording...
            </span>
          ) : (
            "Record Answer"
          )}
        </Button>
      </div>

      {userAnswer && (
        <div className="mt-4 p-4 border rounded-lg w-full">
          <h2 className="font-bold mb-2">
            Transcribed Answer:
          </h2>
          <p>{userAnswer}</p>
        </div>
      )}
    </div>
  );
};

export default RecordAnswerSection;