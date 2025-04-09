import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoBeforeQuiz from '../../components/VideoBeforeQuiz';
import MemoBeforeQuiz from '../../components/MemoBeforeQuiz';
import Quiz from '../../components/Quiz';
import quiz_video from '../../assets/quiz_video/test.mp4';
import fourFourTime from "../../assets/quiz_img/quiz_4/four_four_time.png";
import threeFourTime from "../../assets/quiz_img/quiz_4/three_four_time.png";
import sixEightTime from "../../assets/quiz_img/quiz_4/six_eight_time.png";
import eighthNote from "../../assets/quiz_img/quiz_4/eighth_note.png";
import sixteenthNote from "../../assets/quiz_img/quiz_4/sixteenth_note.jpg";
import dottedQuarterNote from "../../assets/quiz_img/quiz_4/dotted_quarter_note.png";
import rest_quarter from "../../assets/quiz_img/quiz_4/rest_quarter.png";
import rest_whole from "../../assets/quiz_img/quiz_4/rest_whole.png";
import metronome from "../../assets/quiz_img/quiz_4/metronome.jpg";
import rhythmPattern from "../../assets/quiz_img/quiz_4/rhythm_pattern.png";


// 章節測驗題目
export const questionsCh1_4 = [
  {
    questionText: "What does this time signature mean?",
    imageSrc: fourFourTime,
    answerOptions: [
      { answerText: "4 beats per measure, quarter note gets 1 beat", isCorrect: true },
      { answerText: "4 beats per measure, whole note gets 1 beat", isCorrect: false },
      { answerText: "4 measures per line, 4 notes per measure", isCorrect: false }
    ]
  },
  {
    questionText: "What does this time signature mean?",
    imageSrc: threeFourTime,
    answerOptions: [
      { answerText: "3 beats per measure, quarter note gets 1 beat", isCorrect: true },
      { answerText: "3 measures per line, 4 notes per measure", isCorrect: false },
      { answerText: "3 beats per measure, half note gets 1 beat", isCorrect: false }
    ]
  },
  {
    questionText: "What does this time signature mean?",
    imageSrc: sixEightTime,
    answerOptions: [
      { answerText: "6 beats per measure, eighth note gets 1 beat", isCorrect: true },
      { answerText: "6 measures per line, 8 notes per measure", isCorrect: false },
      { answerText: "6 beats per measure, quarter note gets 1 beat", isCorrect: false }
    ]
  },
  {
    questionText: "What is this note called?",
    imageSrc: eighthNote,
    answerOptions: [
      { answerText: "Quarter note", isCorrect: false },
      { answerText: "Eighth note", isCorrect: true },
      { answerText: "Sixteenth note", isCorrect: false }
    ]
  },
  {
    questionText: "What is this note called?",
    imageSrc: sixteenthNote,
    answerOptions: [
      { answerText: "Sixteenth note", isCorrect: true },
      { answerText: "Thirty-second note", isCorrect: false },
      { answerText: "Eighth note", isCorrect: false }
    ]
  },
  {
    questionText: "What is this note called?",
    imageSrc: dottedQuarterNote,
    answerOptions: [
      { answerText: "Dotted quarter note", isCorrect: true },
      { answerText: "Quarter note", isCorrect: false },
      { answerText: "Dotted half note", isCorrect: false }
    ]
  },
  {
    questionText: "What is this symbol called?",
    imageSrc: rest_quarter,
    answerOptions: [
      { answerText: "Half rest", isCorrect: false },
      { answerText: "Quarter rest", isCorrect: true },
      { answerText: "Eighth rest", isCorrect: false }
    ]
  },
  {
    questionText: "What is this symbol called?",
    imageSrc: rest_whole,
    answerOptions: [
      { answerText: "Whole rest", isCorrect: true },
      { answerText: "Half rest", isCorrect: false },
      { answerText: "Full measure rest", isCorrect: false }
    ]
  },
  {
    questionText: "What does a metronome do?",
    imageSrc: metronome,
    answerOptions: [
      { answerText: "Measures the pitch of notes", isCorrect: false },
      { answerText: "Keeps a steady beat/tempo", isCorrect: true },
      { answerText: "Records your playing", isCorrect: false }
    ]
  },
  {
    questionText: "Try to play this rhythm pattern with one note (C)",
    imageSrc: rhythmPattern,
    isPianoQuestion: true,
    requiredNotes: [60] // Middle C
  }
];

// Tutorial content
const tutorialCards = [
  {
    title: "Time Signatures",
    content: "Time signatures tell us how many beats are in a measure and which note value gets one beat. 4/4 means 4 beats per measure, and a quarter note gets one beat.",
    imageSrc: fourFourTime
  },
  {
    title: "Note Values",
    content: "Different note shapes represent different durations. A dot after a note increases its duration by half its original value. For example, a dotted quarter note equals a quarter note plus an eighth note.",
    imageSrc: dottedQuarterNote
  },
  {
    title: "Rests",
    content: "Rests indicate periods of silence. Each note value has a corresponding rest symbol. For example, a quarter rest equals one beat of silence in 4/4 time.",
    imageSrc: rest_quarter
  },
  {
    title: "Rhythm Patterns",
    content: "Rhythm is the pattern of long and short notes and rests in music. Practicing simple rhythms helps develop timing skills essential for playing piano.",
    imageSrc: rhythmPattern
  }
];

const chapter_ref_id = 1;
const lesson_ref_id = 4;

function Ch1_4() {
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
            lesson_ref_id={lesson_ref_id}
            chapter_ref_id={chapter_ref_id}
            title="Lesson 4: Rhythm and Time"
            questions={questionsCh1_4}
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

export default Ch1_4;