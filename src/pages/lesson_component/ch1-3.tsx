import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoBeforeQuiz from '../../components/VideoBeforeQuiz';
import MemoBeforeQuiz from '../../components/MemoBeforeQuiz';
import Quiz from '../../components/Quiz';
import quiz_video from '../../assets/quiz_video/test.mp4';
import treble_clef from "../../assets/quiz_img/quiz_3/treble_clef.png";
import bass_clef from "../../assets/quiz_img/quiz_3/bass_clef.png";
import quarterNote from "../../assets/quiz_img/quiz_3/quarter_note.png";
import halfNote from "../../assets/quiz_img/quiz_3/half_note.png";
import wholeNote from "../../assets/quiz_img/quiz_3/whole_note.png";
import staffLines from "../../assets/quiz_img/quiz_3/staff_lines.png";
import timeSignature from "../../assets/quiz_img/quiz_3/time_signature.jpg";
import measureExample from "../../assets/quiz_img/quiz_3/measure_example.png";
import middleCPosition from "../../assets/quiz_img/quiz_3/middle_c_position.png";
// import CMajorScale from "../../assets/quiz_img/quiz_3/c_major_scale.png";
import DMajor from "../../assets/quiz_img/quiz_3/d_major_chord.png";

// 章節測驗題目
export const questionsCh1_3 = [
  {
    questionText: "What is this symbol called?",
    imageSrc: treble_clef,
    answerOptions: [
      { answerText: "Bass Clef", isCorrect: false },
      { answerText: "Treble Clef", isCorrect: true },
      { answerText: "Alto Clef", isCorrect: false }
    ]
  },
  {
    questionText: "What is this symbol called?",
    imageSrc: bass_clef,
    answerOptions: [
      { answerText: "Bass Clef", isCorrect: true },
      { answerText: "Treble Clef", isCorrect: false },
      { answerText: "Tenor Clef", isCorrect: false }
    ]
  },
  {
    questionText: "How many lines are in a standard music staff?",
    imageSrc: staffLines,
    answerOptions: [
      { answerText: "4", isCorrect: false },
      { answerText: "5", isCorrect: true },
      { answerText: "6", isCorrect: false }
    ]
  },
  {
    questionText: "What does the top number in a time signature represent?",
    imageSrc: timeSignature,
    answerOptions: [
      { answerText: "Number of beats per measure", isCorrect: true },
      { answerText: "Tempo of the piece", isCorrect: false },
      { answerText: "Note value that gets one beat", isCorrect: false }
    ]
  },
  {
    questionText: "Which note has a filled-in head and a stem?",
    imageSrc: quarterNote,
    answerOptions: [
      { answerText: "Whole Note", isCorrect: false },
      { answerText: "Half Note", isCorrect: false },
      { answerText: "Quarter Note", isCorrect: true }
    ]
  },
  {
    questionText: "Which note has a hollow head and a stem?",
    imageSrc: halfNote,
    answerOptions: [
      { answerText: "Whole Note", isCorrect: false },
      { answerText: "Half Note", isCorrect: true },
      { answerText: "Quarter Note", isCorrect: false }
    ]
  },
  {
    questionText: "Which note has a hollow head and no stem?",
    imageSrc: wholeNote,
    answerOptions: [
      { answerText: "Whole Note", isCorrect: true },
      { answerText: "Half Note", isCorrect: false },
      { answerText: "Eighth Note", isCorrect: false }
    ]
  },
  {
    questionText: "What separates measures in sheet music?",
    imageSrc: measureExample,
    answerOptions: [
      { answerText: "Double lines", isCorrect: false },
      { answerText: "Bar lines", isCorrect: true },
      { answerText: "Clef symbols", isCorrect: false }
    ]
  },
  {
    questionText: "Please play Middle C",
    imageSrc: middleCPosition,
    isPianoQuestion: true,
    requiredNotes: [60] // MIDI note for Middle C
  },
  {
    questionText: "Please play the D Major chord",
    imageSrc: DMajor,
    isPianoQuestion: true,
    requiredNotes: [62, 66, 69], // MIDI notes for D-F#-A
    showNoteNames: true
  }
];

// Tutorial content
const tutorialCards = [
  {
    title: "Staff Lines",
    content: "Music is written on five horizontal lines called a staff. Notes are placed on or between these lines to show their pitch.",
    imageSrc: staffLines
  },
  {
    title: "Clefs",
    content: "The treble clef is used for higher notes (right hand), while the bass clef is for lower notes (left hand). They tell us which notes each line represents.",
    imageSrc: treble_clef
  },
  {
    title: "Note Values",
    content: "Different note shapes indicate how long to hold each note. A whole note (4 beats), half note (2 beats), and quarter note (1 beat) are fundamental.",
    imageSrc: wholeNote
  },
  {
    title: "Time Signatures",
    content: "The time signature (like 4/4) tells us how many beats are in each measure and which note value gets one beat.",
    imageSrc: timeSignature
  }
];

const chapter_ref_id = 1;
const lesson_ref_id = 3;

function Ch1_3() {
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
            controls={false}
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