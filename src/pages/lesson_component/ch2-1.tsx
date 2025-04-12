import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoBeforeQuiz from '../../components/VideoBeforeQuiz';
import MemoBeforeQuiz from '../../components/MemoBeforeQuiz';
import Quiz from '../../components/Quiz';
import quiz_video from '../../assets/quiz_video/test.mp4';
import finger_numbers from "../../assets/quiz_img/quiz_5/finger_numbers.jpg";
import hand_position_C from "../../assets/quiz_img/quiz_5/hand_position_c.jpeg";
import hand_position_G from "../../assets/quiz_img/quiz_5/hand_position_g.jpeg";
import five_finger_pattern from "../../assets/quiz_img/quiz_5/five_finger_pattern.png";
import finger_crossing from "../../assets/quiz_img/quiz_5/finger_crossing.jpeg";
import thumb_under from "../../assets/quiz_img/quiz_5/thumb_under.jpeg";
import proper_posture from "../../assets/quiz_img/quiz_5/proper_posture.jpg";
import wrist_position from "../../assets/quiz_img/quiz_5/wrist_position.jpeg";
import legato_playing from "../../assets/quiz_img/quiz_5/legato_playing.jpg";
import c_scale_fingering from "../../assets/quiz_img/quiz_5/c_scale_fingering.png";
import g_major_chord from "../../assets/quiz_img/quiz_5/g_major_chord.png";

// 章節測驗題目
export const questionsCh1_5 = [
  {
    questionText: "What finger number represents your thumb?",
    imageSrc: finger_numbers,
    answerOptions: [
      { answerText: "1", isCorrect: true },
      { answerText: "2", isCorrect: false },
      { answerText: "5", isCorrect: false }
    ]
  },
  {
    questionText: "What finger number represents your pinky?",
    imageSrc: finger_numbers,
    answerOptions: [
      { answerText: "4", isCorrect: false },
      { answerText: "5", isCorrect: true },
      { answerText: "3", isCorrect: false }
    ]
  },
  {
    questionText: "What finger typically plays Middle C in C position?",
    imageSrc: hand_position_C,
    answerOptions: [
      { answerText: "Right hand thumb (1)", isCorrect: true },
      { answerText: "Left hand thumb (1)", isCorrect: false },
      { answerText: "Right hand pinky (5)", isCorrect: false }
    ]
  },
  {
    questionText: "Which finger typically plays G in G position (right hand)?",
    imageSrc: hand_position_G,
    answerOptions: [
      { answerText: "Thumb (1)", isCorrect: true },
      { answerText: "Middle finger (3)", isCorrect: false },
      { answerText: "Pinky (5)", isCorrect: false }
    ]
  },
  {
    questionText: "What is the technique called when the thumb passes under other fingers?",
    imageSrc: thumb_under,
    answerOptions: [
      { answerText: "Thumb crossing", isCorrect: false },
      { answerText: "Thumb under", isCorrect: true },
      { answerText: "Hand shifting", isCorrect: false }
    ]
  },
  {
    questionText: "What is the proper wrist height when playing piano?",
    imageSrc: wrist_position,
    answerOptions: [
      { answerText: "Higher than the keyboard", isCorrect: false },
      { answerText: "Level with the keyboard", isCorrect: true },
      { answerText: "Much lower than the keyboard", isCorrect: false }
    ]
  },
  {
    questionText: "What playing technique connects notes smoothly?",
    imageSrc: legato_playing,
    answerOptions: [
      { answerText: "Staccato", isCorrect: false },
      { answerText: "Legato", isCorrect: true },
      { answerText: "Marcato", isCorrect: false }
    ]
  },
  {
    questionText: "Which fingering is typically used for a C major scale (right hand)?",
    imageSrc: c_scale_fingering,
    answerOptions: [
      { answerText: "1-2-3-1-2-3-4-5", isCorrect: true },
      { answerText: "1-2-3-4-5-1-2-3", isCorrect: false },
      { answerText: "5-4-3-2-1-5-4-3", isCorrect: false }
    ]
  },
  {
    questionText: "Please play a five-finger pattern starting on C",
    imageSrc: five_finger_pattern,
    isPianoQuestion: true,
    requiredNotes: [60, 62, 64, 65, 67] // C-D-E-F-G
  },
  {
    questionText: "Please play a G major chord",
    imageSrc: g_major_chord,
    isPianoQuestion: true,
    requiredNotes: [67, 71, 74], // G-B-D
    showNoteNames: true
  }
];

// Tutorial content
const tutorialCards = [
  {
    title: "Finger Numbers",
    content: "Each finger has a number: thumb is 1, index is 2, middle is 3, ring is 4, and pinky is 5. These numbers are the same for both hands.",
    imageSrc: finger_numbers
  },
  {
    title: "Hand Positions",
    content: "The C position places your right thumb on Middle C and left pinky on the C an octave below. Each finger rests on consecutive white keys.",
    imageSrc: hand_position_C
  },
  {
    title: "Thumb Under Technique",
    content: "When playing scales, the thumb passes under the hand to reach new notes. This allows for smooth playing across the keyboard's range.",
    imageSrc: thumb_under
  },
  {
    title: "Proper Posture",
    content: "Sit with back straight, feet flat on floor, wrists level with keyboard, and fingers curved. Good posture prevents injury and improves playing.",
    imageSrc: proper_posture
  }
];

const chapter_ref_id = 2;
const lesson_ref_id = 1;

function Ch1_5() {
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
            title="Lesson 5: Basic Fingering and Hand Positions"
            questions={questionsCh1_5}
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

export default Ch1_5;