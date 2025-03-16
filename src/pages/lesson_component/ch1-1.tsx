import { useState } from "react";
import { useParams } from "react-router-dom";
import Quiz from "../../components/Quiz";
import { useNavigate } from "react-router-dom";
import VideoBeforeQuiz from "../../components/VideoBeforeQuiz.tsx";
import MemoBeforeQuiz from "../../components/MemoBeforeQuiz.tsx";
import quiz_video from "../../assets/quiz_video/test.mp4";
import question1 from "../../assets/quiz_img/quiz_1/quiz1_1piano.png";
import question2_ans1 from "../../assets/quiz_img/quiz_1/quiz1_2.jpg";
import question2_ans2 from "../../assets/quiz_img/quiz_1/quiz1_2_1.png";
import question2_ans3 from "../../assets/quiz_img/quiz_1/quiz1_2_2.png";
import question2_ans4 from "../../assets/quiz_img/quiz_1/quiz1_2_3.png";
import fingerPositioning from "../../assets/baseImg/Finger-Positioning-On-Piano.jpg";
import EveryGoodBoyDoesFine from "../../assets/baseImg/EGBDF.jpg"
import FACE from "../../assets/baseImg/FACE.jpg"
import quiz1Q from "../../assets/quiz_img/quiz_1/quiz1Q.jpg"
import quiz2Q from "../../assets/quiz_img/quiz_1/quiz2Q.jpg"
import quiz3Q from "../../assets/quiz_img/quiz_1/quiz3Q.jpg"
import quiz4Q from "../../assets/quiz_img/quiz_1/quiz4Q.jpg"
import quiz5Q from "../../assets/quiz_img/quiz_1/quiz5Q.jpg"
import quiz6Q from "../../assets/quiz_img/quiz_1/quiz6Q.jpg"
import quiz7Q from "../../assets/quiz_img/quiz_1/quiz7Q.jpg"
import quiz8Q from "../../assets/quiz_img/quiz_1/pianoQuizC.jpg"
import quiz9Q from "../../assets/quiz_img/quiz_1/pianoQuizD.jpg"
import quiz10Q from "../../assets/quiz_img/quiz_1/pianoQuizE.jpg"
import quiz11Q from "../../assets/quiz_img/quiz_1/pianoQuizF.jpg"
import quiz12Q from "../../assets/quiz_img/quiz_1/pianoQuizG.jpg"
import quiz13Q from "../../assets/quiz_img/quiz_1/pianoQuizA.jpg"
import quiz14Q from "../../assets/quiz_img/quiz_1/pianoQuizB.jpg"

const chapter_ref_id = 1
const lesson_ref_id = 1

export const questionsCh1_1 = [
  // Multiple choice question
  {
    questionText: "What is the name of this key?",
    imageSrc: quiz1Q, 
    answerOptions: [
      { answerText: "C4", isCorrect: true },
      { answerText: "D4", isCorrect: false },
      { answerText: "E4", isCorrect: false },
      { answerText: "G4", isCorrect: false },
    ]
  },
  {
    questionText: "What is the name of this key?",
    imageSrc: quiz2Q, 
    answerOptions: [
      { answerText: "C4", isCorrect: false },
      { answerText: "D4", isCorrect: true },
      { answerText: "E4", isCorrect: false },
      { answerText: "G4", isCorrect: false },
    ]
  },
  {
    questionText: "What is the name of this key?",
    imageSrc: quiz3Q, 
    answerOptions: [
      { answerText: "C4", isCorrect: false },
      { answerText: "D4", isCorrect: false },
      { answerText: "E4", isCorrect: true },
      { answerText: "G4", isCorrect: false },
    ]
  },
  {
    questionText: "What is the name of this key?",
    imageSrc: quiz4Q, 
    answerOptions: [
      { answerText: "C4", isCorrect: false },
      { answerText: "D4", isCorrect: false },
      { answerText: "G4", isCorrect: false },
      { answerText: "F4", isCorrect: true },
    ]
  },
  {
    questionText: "What is the name of this key?",
    imageSrc: quiz5Q, 
    answerOptions: [
      { answerText: "C4", isCorrect: false },
      { answerText: "D4", isCorrect: false },
      { answerText: "G4", isCorrect: true },
      { answerText: "F4", isCorrect: false },
    ]
  },
  {
    questionText: "What is the name of this key?",
    imageSrc: quiz6Q, 
    answerOptions: [
      { answerText: "A4", isCorrect: true },
      { answerText: "D4", isCorrect: false },
      { answerText: "B4", isCorrect: false },
      { answerText: "F4", isCorrect: false },
    ]
  },
  {
    questionText: "What is the name of this key?",
    imageSrc: quiz7Q, 
    answerOptions: [
      { answerText: "A4", isCorrect: false },
      { answerText: "D4", isCorrect: false },
      { answerText: "B4", isCorrect: true },
      { answerText: "F4", isCorrect: false },
    ]
  },
  {
    questionText: "Please play the note",
    imageSrc: quiz8Q,
    isPianoQuestion: true,
    requiredNotes: [60] // MIDI note number for Middle C
  },
  // Chord playing question 
  {
    questionText: "Please play the note",
    imageSrc: quiz9Q,
    isPianoQuestion: true,
    requiredNotes: [62] 
  },
  {
    questionText: "Please play the note",
    imageSrc: quiz10Q,
    isPianoQuestion: true,
    requiredNotes: [64] 
  }
  
];
const tutorialCards = [
  {
    title: "Correct Playing Posture",
    content: "Keep your hands naturally curved as if holding an apple. Fingers should be curved with fingertips touching the keys vertically. Remember: Keep wrists relaxed and level, not drooping or raised.",
    imageSrc: question2_ans4,
  },
  {
    title: "❌ Common Posture Mistakes to Avoid",
    content: "❌Common mistakes to avoid❌",
    imageSrc: question2_ans3,
  },
  {
    title: "❌ Common Posture Mistakes to Avoid",
    content: "❌Common mistakes to avoid❌",
    imageSrc: question2_ans2,
  },
  {
    title: "❌ Common Posture Mistakes to Avoid",
    content: "❌Common mistakes to avoid❌",
    imageSrc: question2_ans1,
  },
  {
    title: "Right Hand Basic Position - Finding Middle C",
    content: "Place your right thumb (first finger) on Middle C. Rest remaining fingers on DEFG: index on D, middle on E, ring on F, pinky on G. This is the basic five-finger position. Middle C is located in the middle of the piano, to the left of the two black keys.",
    imageSrc: fingerPositioning,
  },
  {
    title: "Understanding Notes on the Staff",
    content: "Counting lines from bottom to top, remember: 'Every Good Boy Does Fine' (EGBDF). Spaces spell: FACE. Middle C is on the first ledger line below. Tip: After finding Middle C, notes to the right follow alphabetically: DEFGAB.",
    imageSrc: EveryGoodBoyDoesFine,
  },
  {
    title: "Understanding Notes on the Staff2",
    content: "Spaces spell: FACE. Middle C is on the first ledger line below. Tip: After finding Middle C, notes to the right follow alphabetically: DEFGAB.",
    imageSrc: FACE,
  },
];

    
function Ch1_1() {
  // State to track current displayed component
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

  // Render component based on current step
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
            lesson_ref_id={lesson_ref_id}
            chapter_ref_id={chapter_ref_id}
            title="Lesson 1: Piano Basics"
            questions={questionsCh1_1}
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
export default Ch1_1;

