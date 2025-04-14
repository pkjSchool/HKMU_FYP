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
    questionText: {
      en: "What is the name of this simple melody?",
      "zh-HK": "這是什麼簡單旋律？"
    },
    imageSrc: mary_had_little_lamb,
    answerOptions: [
      { answerText: { en: "Mary Had a Little Lamb", "zh-HK": "瑪利有隻小羊羔" }, isCorrect: true },
      { answerText: { en: "Twinkle Twinkle Little Star", "zh-HK": "一閃一閃亮晶晶" }, isCorrect: false },
      { answerText: { en: "Row Row Row Your Boat", "zh-HK": "划船歌" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What is the name of this simple melody?",
      "zh-HK": "這是什麼簡單旋律？"
    },
    imageSrc: twinkle_twinkle,
    answerOptions: [
      { answerText: { en: "Mary Had a Little Lamb", "zh-HK": "瑪利有隻小羊羔" }, isCorrect: false },
      { answerText: { en: "Twinkle Twinkle Little Star", "zh-HK": "一閃一閃亮晶晶" }, isCorrect: true },
      { answerText: { en: "Jingle Bells", "zh-HK": "鈴兒響叮噹" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What does this dynamic marking mean?",
      "zh-HK": "這個力度記號是什麼意思？"
    },
    imageSrc: dynamic_forte,
    answerOptions: [
      { answerText: { en: "Play loudly (forte)", "zh-HK": "大聲演奏（強音）" }, isCorrect: true },
      { answerText: { en: "Play softly (piano)", "zh-HK": "輕柔演奏（弱音）" }, isCorrect: false },
      { answerText: { en: "Play gradually louder", "zh-HK": "漸強" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What does this dynamic marking mean?",
      "zh-HK": "這個力度記號是什麼意思？"
    },
    imageSrc: dynamic_piano,
    answerOptions: [
      { answerText: { en: "Play loudly", "zh-HK": "大聲演奏" }, isCorrect: false },
      { answerText: { en: "Play softly", "zh-HK": "輕柔演奏" }, isCorrect: true },
      { answerText: { en: "Play gradually softer", "zh-HK": "漸弱" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What playing technique is indicated by a curved line over notes?",
      "zh-HK": "音符上方的曲線表示什麼演奏技巧？"
    },
    imageSrc: legato_playing,
    answerOptions: [
      { answerText: { en: "Staccato (short, detached)", "zh-HK": "斷奏（短促、分離）" }, isCorrect: false },
      { answerText: { en: "Legato (smooth, connected)", "zh-HK": "連奏（流暢、連接）" }, isCorrect: true },
      { answerText: { en: "Accent (emphasized)", "zh-HK": "重音（強調）" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What playing technique is indicated by dots over notes?",
      "zh-HK": "音符上方的點表示什麼演奏技巧？"
    },
    imageSrc: staccato_playing,
    answerOptions: [
      { answerText: { en: "Staccato (short, detached)", "zh-HK": "斷奏（短促、分離）" }, isCorrect: true },
      { answerText: { en: "Legato (smooth, connected)", "zh-HK": "連奏（流暢、連接）" }, isCorrect: false },
      { answerText: { en: "Tenuto (held)", "zh-HK": "持續音" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "When playing with both hands together, what should you focus on?",
      "zh-HK": "雙手一起彈奏時，應該注意什麼？"
    },
    imageSrc: both_hands_together,
    answerOptions: [
      { answerText: { en: "Only the right hand melody", "zh-HK": "只注意右手旋律" }, isCorrect: false },
      { answerText: { en: "Only the left hand harmony", "zh-HK": "只注意左手和聲" }, isCorrect: false },
      { answerText: { en: "Coordinating both hands evenly", "zh-HK": "平均協調雙手" }, isCorrect: true }
    ]
  },
  {
    questionText: {
      en: "What is the difference between melody and harmony?",
      "zh-HK": "旋律和和聲有什麼區別？"
    },
    imageSrc: melody_harmony,
    answerOptions: [
      { answerText: { en: "Melody is the main tune, harmony supports it", "zh-HK": "旋律是主要音調，和聲是伴奏" }, isCorrect: true },
      { answerText: { en: "Harmony is the main tune, melody supports it", "zh-HK": "和聲是主要音調，旋律是伴奏" }, isCorrect: false },
      { answerText: { en: "They are different words for the same thing", "zh-HK": "它們是同一個概念的不同稱呼" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "Please play an F major chord",
      "zh-HK": "請彈奏F大調和弦"
    },
    imageSrc: f_major_chord,
    isPianoQuestion: true,
    requiredNotes: [65, 69, 72], // F-A-C
    showNoteNames: true
  },
  {
    questionText: {
      en: "Please play an A minor chord",
      "zh-HK": "請彈奏A小調和弦"
    },
    imageSrc: a_minor_chord,
    isPianoQuestion: true,
    requiredNotes: [69, 72, 76], // A-C-E
    showNoteNames: true
  }
];

// Tutorial content
const tutorialCards = [
  {
    title: {
      en: "Simple Melodies",
      "zh-HK": "簡單旋律"
    },
    content: {
      en: "Begin with well-known tunes like 'Mary Had a Little Lamb' or 'Twinkle Twinkle Little Star'. These melodies use just a few notes and have predictable patterns.",
      "zh-HK": "從熟悉的旋律開始，例如「瑪麗有隻小羊羔」或「一閃一閃亮晶晶」。這些旋律只使用少量音符，且具有可預測的模式。"
    },
    imageSrc: mary_had_little_lamb
  },
  {
    title: {
      en: "Dynamics",
      "zh-HK": "力度"
    },
    content: {
      en: "Dynamics are volume changes in music. 'Piano' (p) means soft, while 'forte' (f) means loud. Adding expressiveness through dynamics brings music to life.",
      "zh-HK": "力度是音樂中的音量變化。「Piano」（p）表示柔和，而「Forte」（f）表示響亮。通過力度增加表現力使音樂更生動。"
    },
    imageSrc: dynamic_forte
  },
  {
    title: {
      en: "Articulation",
      "zh-HK": "奏法"
    },
    content: {
      en: "Articulation determines how notes connect. Legato (slurs) means smooth connections, while staccato (dots) means short, detached notes.",
      "zh-HK": "奏法決定音符之間的連接方式。連奏（弧線）表示平滑連接，而斷奏（點）表示短促分離的音符。"
    },
    imageSrc: legato_playing
  },
  {
    title: {
      en: "Hands Together",
      "zh-HK": "雙手合奏"
    },
    content: {
      en: "Playing hands together is challenging but important. Start by practicing each hand separately, then combine them slowly, focusing on coordination.",
      "zh-HK": "雙手合奏具有挑戰性但很重要。先分別練習每隻手，然後慢慢結合，專注於協調性。"
    },
    imageSrc: both_hands_together
  }
];

const chapter_ref_id = 2;
const lesson_ref_id = 2;

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
            title={{
              en: "Lesson 6: Simple Melodies and Playing Techniques",
              "zh-HK": "課程六：簡單旋律和演奏技巧"
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
              en: "Lesson 6: Simple Melodies and Playing Techniques",
              "zh-HK": "課程六：簡單旋律和演奏技巧"
            }}
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