import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Quiz from "../../components/Quiz";
import VideoBeforeQuiz from "../../components/VideoBeforeQuiz.tsx";
import MemoBeforeQuiz from "../../components/MemoBeforeQuiz.tsx";
import quiz_video from "../../assets/quiz_video/test.mp4";

// Import images for memory cards
import trebleClef from "../../assets/baseImg/treble_clef.jpg";
import timeSignature from "../../assets/baseImg/time_signature.jpg";
import quarterNote from "../../assets/baseImg/quarter_note.jpg"; 
import halfNote from "../../assets/baseImg/half_note.jpg";
import wholeNote from "../../assets/baseImg/whole_note.jpg";
import fingerReview from "../../assets/baseImg/finger_numbers.jpg";

const chapter_ref_id = 1;
const lesson_ref_id = 3;

export const questionsCh1_3 = [
  // Review from previous lessons
  {
    questionText: "Which finger number is your thumb?",
    answerOptions: [
      { answerText: "1", isCorrect: true },
      { answerText: "2", isCorrect: false },
      { answerText: "3", isCorrect: false },
      { answerText: "5", isCorrect: false },
    ]
  },
  {
    questionText: "Where is Middle C located on the piano?",
    answerOptions: [
      { answerText: "To the left of the two black keys group", isCorrect: true },
      { answerText: "To the right of the two black keys group", isCorrect: false },
      { answerText: "To the left of the three black keys group", isCorrect: false },
      { answerText: "In the exact middle of the keyboard", isCorrect: false },
    ]
  },
  // New content
  {
    questionText: "What is this symbol called?",
    imageSrc: trebleClef, // You'll need to add this image
    answerOptions: [
      { answerText: "Bass Clef", isCorrect: false },
      { answerText: "Treble Clef", isCorrect: true },
      { answerText: "Time Signature", isCorrect: false },
      { answerText: "Key Signature", isCorrect: false },
    ]
  },
  {
    questionText: "What does the top number in a time signature tell us?",
    answerOptions: [
      { answerText: "How fast to play", isCorrect: false },
      { answerText: "How many beats are in each measure", isCorrect: true },
      { answerText: "What note gets one beat", isCorrect: false },
      { answerText: "How loud to play", isCorrect: false },
    ]
  },
  {
    questionText: "Which of these is a quarter note?",
    answerOptions: [
      { answerText: "A hollow note head with a stem", isCorrect: false },
      { answerText: "A hollow note head without a stem", isCorrect: false },
      { answerText: "A filled note head with a stem", isCorrect: true },
      { answerText: "A filled note head with a stem and a flag", isCorrect: false },
    ]
  },
  {
    questionText: "Please play Middle C",
    isPianoQuestion: true,
    requiredNotes: [60] // MIDI note for Middle C
  },
  {
    questionText: "Please play C-E-G (C major chord)",
    isPianoQuestion: true,
    requiredNotes: [60, 64, 67], // MIDI notes for C-E-G
    isChord: true
  }
];

const tutorialCards = [
  {
    title: "Treble Clef",
    content: "The treble clef tells us which notes to play on the staff. It's also called the G clef because the inner curve circles around the G line. We use treble clef for right hand piano parts.",
    imageSrc: trebleClef,
  },
  {
    title: "Time Signature",
    content: "The time signature looks like a fraction and tells us two things: The top number shows how many beats are in each measure. The bottom number tells us what kind of note gets one beat.",
    imageSrc: timeSignature,
  },
  {
    title: "Quarter Note",
    content: "A quarter note has a filled-in (black) note head and a stem. In 4/4 time, each quarter note gets 1 beat. Count '1, 2, 3, 4' for four quarter notes.",
    imageSrc: quarterNote,
  },
  {
    title: "Half Note",
    content: "A half note has a hollow (white) note head and a stem. It's worth 2 beats, twice as long as a quarter note. Count '1-2' while holding the note.",
    imageSrc: halfNote,
  },
  {
    title: "Whole Note",
    content: "A whole note has a hollow note head with no stem. It's worth 4 beats, as long as 4 quarter notes. Count '1-2-3-4' while holding the note.",
    imageSrc: wholeNote,
  },
  {
    title: "Review: Finger Numbers",
    content: "Remember your finger numbers! Thumb is 1, index is 2, middle is 3, ring is 4, and pinky is 5. These numbers help you know which fingers to place on which keys.",
    imageSrc: fingerReview,
  }
];

function Ch1_3() {
  const [currentStep, setCurrentStep] = useState('video');
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
            lesson_ref_id={lesson_ref_id}
            chapter_ref_id={chapter_ref_id}
            title="Lesson 3: Basic Music Notation"
            questions={questionsCh1_3}
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

export default Ch1_3;