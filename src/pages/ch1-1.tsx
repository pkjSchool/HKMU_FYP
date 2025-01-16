import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Quiz from "../components/Quiz";
import test1Img from "../assets/test1.jpeg";
import test2Img from "../assets/test2.jpeg";
import test3Img from "../assets/test3.jpeg";
import test4Img from "../assets/test4.jpeg";

const questionsCh1_1 = [
  {
    questionText: "Which instrument is shown in the picture below?",
    imageSrc: test1Img, 
    answerOptions: [
      { answerText: "Piano", isCorrect: true },
      { answerText: "Guitar", isCorrect: false },
      { answerText: "Violin", isCorrect: false },
      { answerText: "Drum", isCorrect: false },
    ],
  },
  {
    questionText: "Which of the following is the correct symbol?",
    imageSrc: test1Img, 
    answerOptions: [
      { isImage: true, imageSrc: test1Img, isCorrect: false },
      { isImage: true, imageSrc: test2Img, isCorrect: true },
      { isImage: true, imageSrc: test3Img, isCorrect: false },
      { isImage: true, imageSrc: test4Img, isCorrect: false },
    ],
  },
  {
    questionText: "What is the name of the white keys on a piano?",
    answerOptions: [
      { answerText: "Flats", isCorrect: false },
      { answerText: "Sharps", isCorrect: false },
      { answerText: "Natural notes", isCorrect: true },
      { answerText: "Chords", isCorrect: false },
    ],
  },
  {
    questionText: "How many keys does a standard piano have?",
    answerOptions: [
      { answerText: "61", isCorrect: false },
      { answerText: "76", isCorrect: false },
      { answerText: "88", isCorrect: true },
      { answerText: "100", isCorrect: false },
    ],
  },
  {
    questionText: "Which hand typically plays the melody on a piano?",
    answerOptions: [
      { answerText: "Left hand", isCorrect: false },
      { answerText: "Right hand", isCorrect: true },
      { answerText: "Both hands equally", isCorrect: false },
      { answerText: "Neither hand", isCorrect: false },
    ],
  },
  {
    questionText: "What does the sustain pedal on a piano do?",
    answerOptions: [
      { answerText: "Makes the notes louder", isCorrect: false },
      { answerText: "Sustains the sound of the notes", isCorrect: true },
      { answerText: "Changes the pitch of the notes", isCorrect: false },
      { answerText: "Stops the sound immediately", isCorrect: false },
    ],
  },
  {
    questionText: "What is the first note of the C major scale?",
    answerOptions: [
      { answerText: "A", isCorrect: false },
      { answerText: "C", isCorrect: true },
      { answerText: "E", isCorrect: false },
      { answerText: "G", isCorrect: false },
    ],
  },
];

function Ch1_1() {
  return <Quiz title="Lesson 1: Piano Basics" questions={questionsCh1_1} />;
}

export default Ch1_1;
