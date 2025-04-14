import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoBeforeQuiz from '../../components/VideoBeforeQuiz';
import MemoBeforeQuiz from '../../components/MemoBeforeQuiz';
import Quiz from '../../components/Quiz';
import quiz_video from '../../assets/quiz_video/test.mp4';
import mary_had_little_lamb from "../../assets/quiz_img/quiz_6/mary_had_little_lamb.png";
import twinkle_twinkle from "../../assets/quiz_img/quiz_6/twinkle_twinkle.png";
import dynamic_forte from "../../assets/quiz_img/quiz_6/dynamic_forte.png";
import dynamic_piano from "../../assets/quiz_img/quiz_6/dynamic_piano.png";
import legato_playing from "../../assets/quiz_img/quiz_6/legato_playing.jpg";
import staccato_playing from "../../assets/quiz_img/quiz_6/staccato_playing.png";
import both_hands_together from "../../assets/quiz_img/quiz_6/both_hands_together.png";
import simple_chord_progression from "../../assets/quiz_img/quiz_6/simple_chord_progression.png";
import f_major_chord from "../../assets/quiz_img/quiz_6/f_major_chord.png";
import a_minor_chord from "../../assets/quiz_img/quiz_6/a_minor_chord.png";
import melody_harmony from "../../assets/quiz_img/quiz_6/melody_harmony.jpeg";

// 章節測驗題目
export const questionsCh1_6 = [
  {
    questionText: "What is the name of this simple melody?",
    imageSrc: mary_had_little_lamb,
    answerOptions: [
      { answerText: "Mary Had a Little Lamb", isCorrect: true },
      { answerText: "Twinkle Twinkle Little Star", isCorrect: false },
      { answerText: "Row Row Row Your Boat", isCorrect: false }
    ]
  },
  {
    questionText: "What is the name of this simple melody?",
    imageSrc: twinkle_twinkle,
    answerOptions: [
      { answerText: "Mary Had a Little Lamb", isCorrect: false },
      { answerText: "Twinkle Twinkle Little Star", isCorrect: true },
      { answerText: "Jingle Bells", isCorrect: false }
    ]
  },
  {
    questionText: "What does this dynamic marking mean?",
    imageSrc: dynamic_forte,
    answerOptions: [
      { answerText: "Play loudly (forte)", isCorrect: true },
      { answerText: "Play softly (piano)", isCorrect: false },
      { answerText: "Play gradually louder", isCorrect: false }
    ]
  },
  {
    questionText: "What does this dynamic marking mean?",
    imageSrc: dynamic_piano,
    answerOptions: [
      { answerText: "Play loudly", isCorrect: false },
      { answerText: "Play softly", isCorrect: true },
      { answerText: "Play gradually softer", isCorrect: false }
    ]
  },
  {
    questionText: "What playing technique is indicated by a curved line over notes?",
    imageSrc: legato_playing,
    answerOptions: [
      { answerText: "Staccato (short, detached)", isCorrect: false },
      { answerText: "Legato (smooth, connected)", isCorrect: true },
      { answerText: "Accent (emphasized)", isCorrect: false }
    ]
  },
  {
    questionText: "What playing technique is indicated by dots over notes?",
    imageSrc: staccato_playing,
    answerOptions: [
      { answerText: "Staccato (short, detached)", isCorrect: true },
      { answerText: "Legato (smooth, connected)", isCorrect: false },
      { answerText: "Tenuto (held)", isCorrect: false }
    ]
  },
  {
    questionText: "When playing with both hands together, what should you focus on?",
    imageSrc: both_hands_together,
    answerOptions: [
      { answerText: "Only the right hand melody", isCorrect: false },
      { answerText: "Only the left hand harmony", isCorrect: false },
      { answerText: "Coordinating both hands evenly", isCorrect: true }
    ]
  },
  {
    questionText: "What is the difference between melody and harmony?",
    imageSrc: melody_harmony,
    answerOptions: [
      { answerText: "Melody is the main tune, harmony supports it", isCorrect: true },
      { answerText: "Harmony is the main tune, melody supports it", isCorrect: false },
      { answerText: "They are different words for the same thing", isCorrect: false }
    ]
  },
  {
    questionText: "Please play an F major chord",
    imageSrc: f_major_chord,
    isPianoQuestion: true,
    requiredNotes: [65, 69, 72], // F-A-C
    showNoteNames: true
  },
  {
    questionText: "Please play an A minor chord",
    imageSrc: a_minor_chord,
    isPianoQuestion: true,
    requiredNotes: [69, 72, 76], // A-C-E
    showNoteNames: true
  }
];

// Tutorial content
const tutorialCards = [
  {
    title: "Simple Melodies",
    content: "Begin with well-known tunes like 'Mary Had a Little Lamb' or 'Twinkle Twinkle Little Star'. These melodies use just a few notes and have predictable patterns.",
    imageSrc: mary_had_little_lamb
  },
  {
    title: "Dynamics",
    content: "Dynamics are volume changes in music. 'Piano' (p) means soft, while 'forte' (f) means loud. Adding expressiveness through dynamics brings music to life.",
    imageSrc: dynamic_forte
  },
  {
    title: "Articulation",
    content: "Articulation determines how notes connect. Legato (slurs) means smooth connections, while staccato (dots) means short, detached notes.",
    imageSrc: legato_playing
  },
  {
    title: "Hands Together",
    content: "Playing hands together is challenging but important. Start by practicing each hand separately, then combine them slowly, focusing on coordination.",
    imageSrc: both_hands_together
  }
];

const chapter_ref_id = 1;
const lesson_ref_id = 6;

function Ch1_6() {
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
            title="Lesson 6: Simple Melodies and Playing Techniques"
            questions={questionsCh1_6}
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

export default Ch1_6;