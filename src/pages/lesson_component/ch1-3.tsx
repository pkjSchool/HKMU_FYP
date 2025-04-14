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
    questionText: {
      en: "What is this symbol called?",
      "zh-HK": "這個符號叫什麼？"
    },
    imageSrc: treble_clef,
    answerOptions: [
      { answerText: { en: "Bass Clef", "zh-HK": "低音譜號" }, isCorrect: false },
      { answerText: { en: "Treble Clef", "zh-HK": "高音譜號" }, isCorrect: true },
      { answerText: { en: "Alto Clef", "zh-HK": "中音譜號" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What is this symbol called?",
      "zh-HK": "這個符號叫什麼？"
    },
    imageSrc: bass_clef,
    answerOptions: [
      { answerText: { en: "Bass Clef", "zh-HK": "低音譜號" }, isCorrect: true },
      { answerText: { en: "Treble Clef", "zh-HK": "高音譜號" }, isCorrect: false },
      { answerText: { en: "Tenor Clef", "zh-HK": "次中音譜號" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "How many lines are in a standard music staff?",
      "zh-HK": "標準五線譜有多少條線？"
    },
    imageSrc: staffLines,
    answerOptions: [
      { answerText: { en: "4", "zh-HK": "4" }, isCorrect: false },
      { answerText: { en: "5", "zh-HK": "5" }, isCorrect: true },
      { answerText: { en: "6", "zh-HK": "6" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What does the top number in a time signature represent?",
      "zh-HK": "拍號上面的數字代表什麼？"
    },
    imageSrc: timeSignature,
    answerOptions: [
      { answerText: { en: "Number of beats per measure", "zh-HK": "每小節的拍子數" }, isCorrect: true },
      { answerText: { en: "Tempo of the piece", "zh-HK": "樂曲的速度" }, isCorrect: false },
      { answerText: { en: "Note value that gets one beat", "zh-HK": "一拍的音符時值" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "Which note has a filled-in head and a stem?",
      "zh-HK": "哪個音符有實心符頭和符干？"
    },
    imageSrc: quarterNote,
    answerOptions: [
      { answerText: { en: "Whole Note", "zh-HK": "全音符" }, isCorrect: false },
      { answerText: { en: "Half Note", "zh-HK": "二分音符" }, isCorrect: false },
      { answerText: { en: "Quarter Note", "zh-HK": "四分音符" }, isCorrect: true }
    ]
  },
  {
    questionText: {
      en: "Which note has a hollow head and a stem?",
      "zh-HK": "哪個音符有空心符頭和符干？"
    },
    imageSrc: halfNote,
    answerOptions: [
      { answerText: { en: "Whole Note", "zh-HK": "全音符" }, isCorrect: false },
      { answerText: { en: "Half Note", "zh-HK": "二分音符" }, isCorrect: true },
      { answerText: { en: "Quarter Note", "zh-HK": "四分音符" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "Which note has a hollow head and no stem?",
      "zh-HK": "哪個音符有空心符頭但沒有符干？"
    },
    imageSrc: wholeNote,
    answerOptions: [
      { answerText: { en: "Whole Note", "zh-HK": "全音符" }, isCorrect: true },
      { answerText: { en: "Half Note", "zh-HK": "二分音符" }, isCorrect: false },
      { answerText: { en: "Eighth Note", "zh-HK": "八分音符" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What separates measures in sheet music?",
      "zh-HK": "在樂譜中用什麼來分隔小節？"
    },
    imageSrc: measureExample,
    answerOptions: [
      { answerText: { en: "Double lines", "zh-HK": "雙線" }, isCorrect: false },
      { answerText: { en: "Bar lines", "zh-HK": "小節線" }, isCorrect: true },
      { answerText: { en: "Clef symbols", "zh-HK": "譜號" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "Please play Middle C",
      "zh-HK": "請彈奏中央C"
    },
    imageSrc: middleCPosition,
    isPianoQuestion: true,
    requiredNotes: [60]
  },
  {
    questionText: {
      en: "Please play the D Major chord",
      "zh-HK": "請彈奏D大調和弦"
    },
    imageSrc: DMajor,
    isPianoQuestion: true,
    requiredNotes: [62, 66, 69],
    showNoteNames: true
  }
];

// Tutorial content
const tutorialCards = [
  {
    title: {
      en: "Staff Lines",
      "zh-HK": "五線譜"
    },
    content: {
      en: "Music is written on five horizontal lines called a staff. Notes are placed on or between these lines to show their pitch.",
      "zh-HK": "音樂記譜是基於五條水平線，稱為五線譜。音符放置在這些線上或之間以顯示其音高。"
    },
    imageSrc: staffLines
  },
  {
    title: {
      en: "Clefs",
      "zh-HK": "譜號"
    },
    content: {
      en: "The treble clef is used for higher notes (right hand), while the bass clef is for lower notes (left hand). They tell us which notes each line represents.",
      "zh-HK": "高音譜號用於較高的音符（右手），而低音譜號用於較低的音符（左手）。它們告訴我們每條線代表的音符。"
    },
    imageSrc: treble_clef
  },
  {
    title: {
      en: "Note Values",
      "zh-HK": "音符時值"
    },
    content: {
      en: "Different note shapes indicate how long to hold each note. A whole note (4 beats), half note (2 beats), and quarter note (1 beat) are fundamental.",
      "zh-HK": "不同的音符形狀表示每個音符的持續時間。全音符（4拍）、二分音符（2拍）和四分音符（1拍）是基本的。"
    },
    imageSrc: wholeNote
  },
  {
    title: {
      en: "Time Signatures",
      "zh-HK": "拍號"
    },
    content: {
      en: "The time signature (like 4/4) tells us how many beats are in each measure and which note value gets one beat.",
      "zh-HK": "拍號（如4/4）告訴我們每小節有多少拍，以及哪個音符時值為一拍。"
    },
    imageSrc: timeSignature
  }
];

const chapter_ref_id = 1;
const lesson_ref_id = 3;

function Ch1_3() {
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
            title={{
              en: "Lesson 3: Basic Music Notation",
              "zh-HK": "第三課：基本樂理符號"
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
              en: "Lesson 3: Basic Music Notation",
              "zh-HK": "第三課：基本樂理符號"
            }}
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