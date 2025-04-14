import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoBeforeQuiz from '../../components/VideoBeforeQuiz';
import MemoBeforeQuiz from '../../components/MemoBeforeQuiz';
import Quiz from '../../components/Quiz';
import quiz_video from '../../assets/quiz_video/test.mp4';
import quiz8Q from "../../assets/quiz_img/quiz_1/pianoQuizC.jpg"
import quiz9Q from "../../assets/quiz_img/quiz_1/pianoQuizD.jpg"
import treble_clef from "../../assets/quiz_img/quiz_2/treble_clef.png"
import c5_key from "../../assets/quiz_img/quiz_2/c5_key.jpg"
import interval_CEG from "../../assets/quiz_img/quiz_2/interval_CEG.jpg"
import scaleDirectionImg from "../../assets/quiz_img/quiz_2/scaleDirectionImg.jpg"
// import scaleStepsImg from "../../assets/quiz_img/quiz_2/scale_steps.png"
import chordDemoImg from "../../assets/quiz_img/quiz_2/chordDemoImg.png"
import CMajor from "../../assets/quiz_img/quiz_2/CMajor.jpg"
// import scaleDemoImg from "../../assets/quiz_img/quiz_2/scale_demo.png"


// 章節測驗題目
export const questionsCh1_2 = [
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
    questionText: "Is this scale ascending or descending?",
    imageSrc: scaleDirectionImg,
    answerOptions: [
      { answerText: "Ascending", isCorrect: true },
      { answerText: "Descending", isCorrect: false }
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
const chapter_ref_id = 1
const lesson_ref_id = 2
function Ch1_2() {
  const [currentStep, setCurrentStep] = useState<'video' | 'memo' | 'quiz'>('memo');
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
            lesson_ref_id={lesson_ref_id}
            chapter_ref_id={chapter_ref_id}
            title="Lesson 2: Chords and Scales"
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
