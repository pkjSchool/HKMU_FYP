import React, { useState } from "react";
import MemoBeforeQuiz from "../../components/MemoBeforeQuiz.tsx";
import { useNavigate } from "react-router-dom";
import Quiz from "../../components/Quiz";
import ANote from "../../assets/baseImg/A.jpg";
import BNote from "../../assets/baseImg/B.jpg";
import CNote from "../../assets/baseImg/C.jpg";
import DNote from "../../assets/baseImg/D.jpg";
import ENote from "../../assets/baseImg/E.jpg";
import FNote from "../../assets/baseImg/F.jpg";
import GNote from "../../assets/baseImg/G.jpg";


// 章節測驗題目
const questionsCh1_2 = [
  {
    questionText: "What is the name of this key?",
    imageSrc: c5_key,
    answerOptions: [
      { answerText: "C4", isCorrect: false },
      { answerText: "C5", isCorrect: true },
      { answerText: "G4", isCorrect: false }
    ]
  },
  {
    questionText: "Is this a treble clef?",
    imageSrc: treble_clef,
    answerOptions: [
      { answerText: "Yes", isCorrect: true },
      { answerText: "No", isCorrect: false }
    ]
  },
  {
    questionText: "What is this musical element?",
    imageSrc: interval_CEG,
    answerOptions: [
      { answerText: "Third", isCorrect: false },
      { answerText: "Chord", isCorrect: true },
      { answerText: "Fifth", isCorrect: false }
    ]
  },
  {
    questionText: "Please play the note",
    imageSrc: quiz8Q,
    isPianoQuestion: true,
    requiredNotes: [60]
  },
  {
    questionText: "Please play the note",
    imageSrc: quiz9Q,
    isPianoQuestion: true,
    requiredNotes: [62] 
  },
  {
    questionText: "Please play the C chord",
    imageSrc: CMajor,
    isPianoQuestion: true,
    requiredNotes: [60, 64, 67],
    showNoteNames: true
  },
  {
    questionText: "Is this scale ascending or descending?",
    imageSrc: scaleDirectionImg,
    answerOptions: [
      { answerText: "Ascending", isCorrect: true },
      { answerText: "Descending", isCorrect: false }
    ]
  }
];

// Tutorial content
const tutorialCards = [
  {
    title: "What is a chord?",
    content: "A chord is three notes played simultaneously, like building blocks",
  },
  {
    title: "Chord Example",
    content: "The C chord consists of C, E, and G notes",
    imageSrc: CMajor
  },
  {
    title: "Scale Direction",
    content: "Playing from left to right is ascending, like climbing stairs",
    imageSrc: scaleDirectionImg
  }
];

function Ch1_2() {
  const [currentStep, setCurrentStep] = useState<'video' | 'memo' | 'quiz'>('video');
  const navigate = useNavigate();

  const handleVideoEnd = () => {
    setCurrentStep('memo');
  };

  const handleMemoComplete = () => {
    setCurrentStep('quiz');
  };

  const handleExitQuiz = () => {
    console.log("Quiz exited!");
    navigate("/");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'video':
        return (
          <VideoBeforeQuiz
            videoSrc={quiz_video}
            onVideoEnd={handleVideoEnd}
            autoPlay={true}
            controls={true}
          />
        );
      case 'memo':
        return (
          <MemoBeforeQuiz
            cards={tutorialCards}
            onComplete={handleMemoComplete}
          />
        );
      case 'quiz':
        return (
          <Quiz
            title="Lesson 2: 和弦與音階"
            questions={questionsCh1_2}
            onExit={handleExitQuiz}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderStep()}
    </>
  );
}

export default Ch1_2;
