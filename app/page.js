"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const page = () => {
  return (
    <div>
      <Head>
        <title>AI Mock Interview</title>
        <meta
          name="description"
          content="Ace your next interview with AI-powered mock interviews"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex flex-col">

        {/* Header */}
        <header className="w-full py-5 bg-white shadow-md">
          <div className="container mx-auto flex justify-between items-center px-6">
            <h1 className="text-2xl font-bold text-black">
              AI Mock Interview
            </h1>

            <div className="flex items-center gap-4">
              <a
                href="/Login"
                className="text-sm font-medium hover:text-gray-600"
              >
                Login
              </a>

              <a
                href="https://github.com"
                target="_blank"
                className="text-xl"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section (CENTERED PROPERLY) */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-r from-gray-900 to-gray-700">
          
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ace Your Next Interview
          </h2>

          <p className="mt-4 text-lg text-gray-200 max-w-xl">
            Practice with AI-powered mock interviews and get personalized feedback
          </p>

          <div className="mt-6 flex gap-4">
            <a
              href="/Login"
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
            >
              Get Started
            </a>

            <a
              href="#features"
              className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-black"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 bg-white text-center px-6">
          <h2 className="text-3xl font-bold">Features</h2>

          <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-blue-50 rounded-lg shadow">
              <h3 className="font-semibold text-lg">AI Mock Interviews</h3>
              <p className="text-gray-600 mt-2">
                Real interview experience with AI.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg shadow">
              <h3 className="font-semibold text-lg">Instant Feedback</h3>
              <p className="text-gray-600 mt-2">
                Improve your answers instantly.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg shadow">
              <h3 className="font-semibold text-lg">Detailed Reports</h3>
              <p className="text-gray-600 mt-2">
                Know your strengths and weaknesses.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-6 bg-black text-white text-center">
        © 2024 AI Mock Interview
      </footer>
    </div>
  );
};

export default page;