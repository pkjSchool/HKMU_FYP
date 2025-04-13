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
    questionText: {
      en: "What is the name of this key?",
      "zh-HK": "這個琴鍵的名稱是什麼？"
    },
    imageSrc: c5_key,
    answerOptions: [
      { answerText: { en: "C4", "zh-HK": "C4" }, isCorrect: false },
      { answerText: { en: "C5", "zh-HK": "C5" }, isCorrect: true },
      { answerText: { en: "G4", "zh-HK": "G4" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "Is this a treble clef?",
      "zh-HK": "這是高音譜號嗎？"
    },
    imageSrc: treble_clef,
    answerOptions: [
      { answerText: { en: "Yes", "zh-HK": "是" }, isCorrect: true },
      { answerText: { en: "No", "zh-HK": "否" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What is this musical element?",
      "zh-HK": "這是什麼音樂元素？"
    },
    imageSrc: interval_CEG,
    answerOptions: [
      { answerText: { en: "Third", "zh-HK": "三度" }, isCorrect: false },
      { answerText: { en: "Chord", "zh-HK": "和弦" }, isCorrect: true },
      { answerText: { en: "Fifth", "zh-HK": "五度" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "Is this scale ascending or descending?",
      "zh-HK": "這個音階是上行還是下行？"
    },
    imageSrc: scaleDirectionImg,
    answerOptions: [
      { answerText: { en: "Ascending", "zh-HK": "上行" }, isCorrect: true },
      { answerText: { en: "Descending", "zh-HK": "下行" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "Please play the note",
      "zh-HK": "請彈奏這個音符"
    },
    imageSrc: quiz8Q,
    isPianoQuestion: true,
    requiredNotes: [60]
  },
  {
    questionText: {
      en: "Please play the note",
      "zh-HK": "請彈奏這個音符"
    },
    imageSrc: quiz9Q,
    isPianoQuestion: true,
    requiredNotes: [62] 
  },
  {
    questionText: {
      en: "Please play the C chord",
      "zh-HK": "請彈奏C和弦"
    },
    imageSrc: CMajor,
    isPianoQuestion: true,
    requiredNotes: [60, 64, 67],
    showNoteNames: true
  }
];

// Tutorial content
const tutorialCards = [
  {
    title: {
      en: "What is a chord?",
      "zh-HK": "什麼是和弦？"
    },
    content: {
      en: "A chord is three notes played simultaneously, like building blocks",
      "zh-HK": "和弦是同時彈奏的三個音符，就像搭積木一樣"
    }
  },
  {
    title: {
      en: "Chord Example",
      "zh-HK": "和弦範例"
    },
    content: {
      en: "The C chord consists of C, E, and G notes",
      "zh-HK": "C和弦由C、E和G音符組成"
    },
    imageSrc: CMajor
  },
  {
    title: {
      en: "Scale Direction",
      "zh-HK": "音階方向"
    },
    content: {
      en: "Playing from left to right is ascending, like climbing stairs",
      "zh-HK": "從左到右彈奏是上行，就像爬樓梯一樣"
    },
    imageSrc: scaleDirectionImg
  }
];
const chapter_ref_id = 1
const lesson_ref_id = 2
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
            controls={false}
          />
        );
      case 'memo':
        return (
          <MemoBeforeQuiz
            cards={tutorialCards}
            title={{
              en: "Lesson 2: Chords and Scales",
              "zh-HK": "課堂 2: 和弦與音階"
            }}
            onComplete={handleMemoComplete}
          />
        );
      case 'quiz':
        return (
          <Quiz
            lesson_ref_id={lesson_ref_id}
            chapter_ref_id={chapter_ref_id}
            title={{
              en: "Lesson 2: Chords and Scales",
              "zh-HK": "課堂 2: 和弦與音階"
            }}
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
