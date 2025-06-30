// Code from Canvas, already includes App component for RSB Interview Lab

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const studentInterviewQuestions = [
  "Why do you want to study in this country?",
  "What university are you going to and what program?",
  "How will you pay for your studies and living expenses?",
  "What do you plan to do after graduation?",
  "Do you have any family in the destination country?",
];

export default function RSBInterviewLabApp() {
  const [step, setStep] = useState(0);
  const [response, setResponse] = useState("");
  const [log, setLog] = useState([]);
  const [document, setDocument] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const currentQuestion = studentInterviewQuestions[step];

  const handleSubmit = () => {
    const newLog = [
      ...log,
      {
        q: currentQuestion,
        a: response,
        audio: audioBlob,
        feedback:
          "Mock feedback: Your answer is clear. Try to include more personal detail.",
      },
    ];
    setLog(newLog);
    setResponse("");
    setAudioBlob(null);
    if (step < studentInterviewQuestions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(0);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setDocument(file);
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      setAudioBlob(audioBlob);
    };

    mediaRecorder.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">RSB Interview Lab</h1>
      <p className="text-center text-gray-600 mb-4">
        Student Visa Interview Simulator with Voice and Document Analysis
      </p>

      <Card className="mb-6">
        <CardContent className="p-4">
          <p className="text-lg font-semibold mb-2">Question:</p>
          <p className="mb-4">{currentQuestion}</p>

          <Input
            type="text"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your answer or use voice input..."
          />

          <div className="flex gap-2 mt-4">
            {!isRecording ? (
              <Button onClick={handleStartRecording}>🎙 Start Recording</Button>
            ) : (
              <Button onClick={handleStopRecording} variant="destructive">
                ⏹ Stop Recording
              </Button>
            )}

            <Button onClick={handleSubmit} disabled={!response && !audioBlob}>
              Submit Answer
            </Button>
          </div>

          <div className="mt-4">
            <label className="block mb-2 font-medium">Upload Supporting Document:</label>
            <Input type="file" onChange={handleFileUpload} />
            {document && <p className="mt-2 text-sm text-gray-700">Uploaded: {document.name}</p>}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-2">Interview Log:</h2>
        {log.map((entry, index) => (
          <Card key={index} className="mb-2">
            <CardContent className="p-4">
              <p className="font-medium">Q: {entry.q}</p>
              <p className="text-gray-700">A: {entry.a}</p>
              {entry.audio && (
                <audio controls src={URL.createObjectURL(entry.audio)} className="mt-2" />
              )}
              <p className="text-green-700 italic mt-1">Feedback: {entry.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 italic">
          * To unlock full interview and detailed feedback, please purchase access (feature coming soon)
        </p>
      </div>
    </div>
  );
}
