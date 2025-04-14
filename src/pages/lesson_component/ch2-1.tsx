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
    questionText: {
      en: "What finger number represents your thumb?",
      "zh-HK": "拇指的手指編號是什麼？"
    },
    imageSrc: finger_numbers,
    answerOptions: [
      { answerText: { en: "1", "zh-HK": "1" }, isCorrect: true },
      { answerText: { en: "2", "zh-HK": "2" }, isCorrect: false },
      { answerText: { en: "5", "zh-HK": "5" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What finger number represents your pinky?",
      "zh-HK": "小指的手指編號是什麼？"
    },
    imageSrc: finger_numbers,
    answerOptions: [
      { answerText: { en: "4", "zh-HK": "4" }, isCorrect: false },
      { answerText: { en: "5", "zh-HK": "5" }, isCorrect: true },
      { answerText: { en: "3", "zh-HK": "3" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What finger typically plays Middle C in C position?",
      "zh-HK": "在C位置時，通常用哪隻手指彈奏中央C？"
    },
    imageSrc: hand_position_C,
    answerOptions: [
      { answerText: { en: "Right hand thumb (1)", "zh-HK": "右手拇指 (1)" }, isCorrect: true },
      { answerText: { en: "Left hand thumb (1)", "zh-HK": "左手拇指 (1)" }, isCorrect: false },
      { answerText: { en: "Right hand pinky (5)", "zh-HK": "右手小指 (5)" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "Which finger typically plays G in G position (right hand)?",
      "zh-HK": "在G位置時，右手通常用哪隻手指彈奏G？"
    },
    imageSrc: hand_position_G,
    answerOptions: [
      { answerText: { en: "Thumb (1)", "zh-HK": "拇指 (1)" }, isCorrect: true },
      { answerText: { en: "Middle finger (3)", "zh-HK": "中指 (3)" }, isCorrect: false },
      { answerText: { en: "Pinky (5)", "zh-HK": "小指 (5)" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What is the technique called when the thumb passes under other fingers?",
      "zh-HK": "拇指從其他手指下方穿過的技巧叫什麼？"
    },
    imageSrc: thumb_under,
    answerOptions: [
      { answerText: { en: "Thumb crossing", "zh-HK": "拇指交叉" }, isCorrect: false },
      { answerText: { en: "Thumb under", "zh-HK": "拇指穿越" }, isCorrect: true },
      { answerText: { en: "Hand shifting", "zh-HK": "手部移位" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What is the proper wrist height when playing piano?",
      "zh-HK": "彈鋼琴時正確的手腕高度是怎樣的？"
    },
    imageSrc: wrist_position,
    answerOptions: [
      { answerText: { en: "Higher than the keyboard", "zh-HK": "高於鍵盤" }, isCorrect: false },
      { answerText: { en: "Level with the keyboard", "zh-HK": "與鍵盤齊平" }, isCorrect: true },
      { answerText: { en: "Much lower than the keyboard", "zh-HK": "遠低於鍵盤" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "What playing technique connects notes smoothly?",
      "zh-HK": "什麼演奏技巧可以使音符連貫流暢？"
    },
    imageSrc: legato_playing,
    answerOptions: [
      { answerText: { en: "Staccato", "zh-HK": "斷音" }, isCorrect: false },
      { answerText: { en: "Legato", "zh-HK": "連音" }, isCorrect: true },
      { answerText: { en: "Marcato", "zh-HK": "強音" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "Which fingering is typically used for a C major scale (right hand)?",
      "zh-HK": "C大調音階（右手）通常使用什麼指法？"
    },
    imageSrc: c_scale_fingering,
    answerOptions: [
      { answerText: { en: "1-2-3-1-2-3-4-5", "zh-HK": "1-2-3-1-2-3-4-5" }, isCorrect: true },
      { answerText: { en: "1-2-3-4-5-1-2-3", "zh-HK": "1-2-3-4-5-1-2-3" }, isCorrect: false },
      { answerText: { en: "5-4-3-2-1-5-4-3", "zh-HK": "5-4-3-2-1-5-4-3" }, isCorrect: false }
    ]
  },
  {
    questionText: {
      en: "Please play a five-finger pattern starting on C",
      "zh-HK": "請彈奏從C開始的五指音型"
    },
    imageSrc: five_finger_pattern,
    isPianoQuestion: true,
    requiredNotes: [60, 62, 64, 65, 67] // C-D-E-F-G
  },
  {
    questionText: {
      en: "Please play a G major chord",
      "zh-HK": "請彈奏G大調和弦"
    },
    imageSrc: g_major_chord,
    isPianoQuestion: true,
    requiredNotes: [67, 71, 74], // G-B-D
    showNoteNames: true
  }
];

// Tutorial content
const tutorialCards = [
  {
    title: { en: "Finger Numbers", "zh-HK": "手指編號" },
    content: { 
      en: "Each finger has a number: thumb is 1, index is 2, middle is 3, ring is 4, and pinky is 5. These numbers are the same for both hands.", 
      "zh-HK": "每隻手指都有一個編號：拇指是1，食指是2，中指是3，無名指是4，小指是5。這些編號對雙手都是相同的。" 
    },
    imageSrc: finger_numbers
  },
  {
    title: { en: "Hand Positions", "zh-HK": "手部位置" },
    content: { 
      en: "The C position places your right thumb on Middle C and left pinky on the C an octave below. Each finger rests on consecutive white keys.", 
      "zh-HK": "C位置將右手拇指放在中央C，左手小指放在下一個八度的C。每隻手指都放在連續的白鍵上。" 
    },
    imageSrc: hand_position_C
  },
  {
    title: { en: "Thumb Under Technique", "zh-HK": "拇指穿越技巧" },
    content: { 
      en: "When playing scales, the thumb passes under the hand to reach new notes. This allows for smooth playing across the keyboard's range.", 
      "zh-HK": "彈奏音階時，拇指穿過手下以觸及新音符。這使得在鍵盤範圍內的演奏更加流暢。" 
    },
    imageSrc: thumb_under
  },
  {
    title: { en: "Proper Posture", "zh-HK": "正確姿勢" },
    content: { 
      en: "Sit with back straight, feet flat on floor, wrists level with keyboard, and fingers curved. Good posture prevents injury and improves playing.", 
      "zh-HK": "坐姿要背部挺直，雙腳平放在地板上，手腕與鍵盤平齊，手指彎曲。良好的姿勢可以防止受傷並提高演奏效果。" 
    },
    imageSrc: proper_posture
  }
];

const chapter_ref_id = 2;
const lesson_ref_id = 1;

function Ch1_5() {
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
              en: "Lesson 5: Basic Fingering and Hand Positions",
              "zh-HK": "課堂 5：基本指法和手部位置"
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
              en: "Lesson 5: Basic Fingering and Hand Positions",
              "zh-HK": "課堂 5：基本指法和手部位置"
            }}
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