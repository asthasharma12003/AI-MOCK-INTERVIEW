"use client";

import { Lightbulb, Volume2 } from "lucide-react";
import React, { useEffect, useCallback } from "react";

const QuestionSection = ({
  mockInterviewQuestion = [],
  activeQuestionIndex = 0,
}) => {
  const currentQuestion =
    mockInterviewQuestion?.[activeQuestionIndex]?.Question;

  const textToSpeech = useCallback((text) => {
    if (!text) return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance(text);

      speech.lang = "en-US";
      speech.rate = 1;
      speech.pitch = 1;
      speech.volume = 1;

      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support Text To Speech.");
    }
  }, []);

  // Auto speak when question changes
  useEffect(() => {
    if (currentQuestion) {
      textToSpeech(currentQuestion);
    }

    // cleanup (important)
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestion, textToSpeech]);

  if (!mockInterviewQuestion.length) return null;

  return (
    <div className="flex flex-col justify-between p-5 border rounded-lg my-1 bg-secondary">
      {/* Question Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion.map((q, index) => (
          <h2
            key={index}
            className={`p-2 rounded-full text-center text-xs md:text-sm cursor-pointer md:block hidden ${
              activeQuestionIndex === index
                ? "bg-black text-white"
                : "bg-secondary border"
            }`}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      {/* Current Question */}
      <div className="mt-5">
        <h2 className="text-md md:text-lg font-medium">{currentQuestion}</h2>

        {/* Speaker Button */}
        <button
          onClick={() => textToSpeech(currentQuestion)}
          className="mt-3"
          aria-label="Read question aloud"
        >
          <Volume2
            size={28}
            className="cursor-pointer hover:text-blue-600 transition"
          />
        </button>
      </div>

      {/* Note Section */}
      <div className="border rounded-lg p-5 bg-blue-100 mt-10 md:block hidden">
        <h2 className="flex gap-2 items-center text-blue-800">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>

        <h2 className="text-sm text-blue-600 my-2">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE ||
            "Practice regularly and stay confident."}
        </h2>
      </div>
    </div>
  );
};

export default QuestionSection;
