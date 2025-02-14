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


export const questionsCh1_2 = [
  {
    questionText: "Where is the F key?",
    answerOptions: [
      { isImage: true, imageSrc: ANote, isCorrect: false },
      { isImage: true, imageSrc: CNote, isCorrect: false },
      { isImage: true, imageSrc: FNote, isCorrect: true },
      { isImage: true, imageSrc: GNote, isCorrect: false },
    ],
  },
  {
    questionText: "Where is the A key?",
    answerOptions: [
      { isImage: true, imageSrc: BNote, isCorrect: false },
      { isImage: true, imageSrc: ANote, isCorrect: true },
      { isImage: true, imageSrc: ENote, isCorrect: false },
      { isImage: true, imageSrc: FNote, isCorrect: false },
    ],
  },
  {
    questionText: "Where is the C key?",
    answerOptions: [
      { isImage: true, imageSrc: DNote, isCorrect: false },
      { isImage: true, imageSrc: FNote, isCorrect: false },
      { isImage: true, imageSrc: CNote, isCorrect: true },
      { isImage: true, imageSrc: FNote, isCorrect: false },
    ],
  },
  {
    questionText: "Where is the G key?",
    answerOptions: [
      { isImage: true, imageSrc: CNote, isCorrect: false },
      { isImage: true, imageSrc: GNote, isCorrect: true },
      { isImage: true, imageSrc: FNote, isCorrect: false },
      { isImage: true, imageSrc: DNote, isCorrect: false },
    ],
  },
  {
    questionText: "Where is the B key?",
    answerOptions: [
      { isImage: true, imageSrc: FNote, isCorrect: false },
      { isImage: true, imageSrc: DNote, isCorrect: false },
      { isImage: true, imageSrc: BNote, isCorrect: true },
      { isImage: true, imageSrc: CNote, isCorrect: false },
    ],
  },
  {
    questionText: "Where is the D key?",
    answerOptions: [
      { isImage: true, imageSrc: CNote, isCorrect: false },
      { isImage: true, imageSrc: BNote, isCorrect: false },
      { isImage: true, imageSrc: DNote, isCorrect: true },
      { isImage: true, imageSrc: ANote, isCorrect: false },
    ],
  },
  {
    questionText: "Where is the E key?",
    answerOptions: [
      { isImage: true, imageSrc: DNote, isCorrect: false },
      { isImage: true, imageSrc: CNote, isCorrect: false },
      { isImage: true, imageSrc: ENote, isCorrect: true },
      { isImage: true, imageSrc: BNote, isCorrect: false },
    ],
  },
];
const tutorialCards = [
  {
    title: "Step 1",
    content: "This is the first step of Chapter 1 - Lesson 2.",
    imageSrc: "https://via.placeholder.com/300",
  },
  {
    title: "Step 2",
    content: "This is the second step of Chapter 1 - Lesson 2.",
    imageSrc: "https://via.placeholder.com/300",
  },
  {
    title: "Step 3",
    content: "You've completed Chapter 1 - Lesson 2!",
    imageSrc: "https://via.placeholder.com/300",
  },
];
const Ch1_2 = () => {
  const navigate = useNavigate();
  const [showMemo, setshowMemo] = useState(true);
  

  const handleComplete = () => {
    setshowMemo(false);
  };

  const handleExitQuiz = () => {
    console.log("handleExitQuiz");
    navigate("/");
  };

  return (
    <div>
      {showMemo ? (
        <MemoBeforeQuiz cards={tutorialCards} onComplete={handleComplete} />
      ) : (
        <Quiz
          title="Lesson 1: Piano Basics"
          questions={questionsCh1_2}
          onExit={handleExitQuiz}
        />
      )}
    </div>
  );
};

export default Ch1_2;
