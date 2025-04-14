import { useState } from "react";
import { useParams } from "react-router-dom";
import Quiz from "../../components/Quiz";
import { useNavigate } from "react-router-dom";
import VideoBeforeQuiz from "../../components/VideoBeforeQuiz.tsx";
import MemoBeforeQuiz from "../../components/MemoBeforeQuiz.tsx";
import quiz_video from "../../assets/quiz_video/quiz1.mov";
// import question1 from "../../assets/quiz_img/quiz_1/quiz1_1piano.png";
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
// import quiz11Q from "../../assets/quiz_img/quiz_1/pianoQuizF.jpg"
// import quiz12Q from "../../assets/quiz_img/quiz_1/pianoQuizG.jpg"
// import quiz13Q from "../../assets/quiz_img/quiz_1/pianoQuizA.jpg"
// import quiz14Q from "../../assets/quiz_img/quiz_1/pianoQuizB.jpg"

const chapter_ref_id = 1
const lesson_ref_id = 1

export const questionsCh1_1 = [
  // Multiple choice question
  {
    questionText: { 
      "en": "What is the name of this key?", 
      "zh-HK": "這個琴鍵的名稱是什麼？" 
    },
    imageSrc: quiz1Q, 
    answerOptions: [
      { answerText: { "en": "C4", "zh-HK": "C4" }, isCorrect: true },
      { answerText: { "en": "D4", "zh-HK": "D4" }, isCorrect: false },
      { answerText: { "en": "E4", "zh-HK": "E4" }, isCorrect: false },
      { answerText: { "en": "G4", "zh-HK": "G4" }, isCorrect: false },
    ]
  },
  {
    questionText: { 
      "en": "What is the name of this key?", 
      "zh-HK": "這個琴鍵的名稱是什麼？" 
    },
    imageSrc: quiz2Q, 
    answerOptions: [
      { answerText: { "en": "C4", "zh-HK": "C4" }, isCorrect: false },
      { answerText: { "en": "D4", "zh-HK": "D4" }, isCorrect: true },
      { answerText: { "en": "E4", "zh-HK": "E4" }, isCorrect: false },
      { answerText: { "en": "G4", "zh-HK": "G4" }, isCorrect: false },
    ]
  },
  {
    questionText: { 
      "en": "What is the name of this key?", 
      "zh-HK": "這個琴鍵的名稱是什麼？" 
    },
    imageSrc: quiz3Q, 
    answerOptions: [
      { answerText: { "en": "C4", "zh-HK": "C4" }, isCorrect: false },
      { answerText: { "en": "D4", "zh-HK": "D4" }, isCorrect: false },
      { answerText: { "en": "E4", "zh-HK": "E4" }, isCorrect: true },
      { answerText: { "en": "G4", "zh-HK": "G4" }, isCorrect: false },
    ]
  },
  {
    questionText: { 
      "en": "What is the name of this key?", 
      "zh-HK": "這個琴鍵的名稱是什麼？" 
    },
    imageSrc: quiz4Q, 
    answerOptions: [
      { answerText: { "en": "C4", "zh-HK": "C4" }, isCorrect: false },
      { answerText: { "en": "D4", "zh-HK": "D4" }, isCorrect: false },
      { answerText: { "en": "G4", "zh-HK": "G4" }, isCorrect: false },
      { answerText: { "en": "F4", "zh-HK": "F4" }, isCorrect: true },
    ]
  },
  {
    questionText: { 
      "en": "What is the name of this key?", 
      "zh-HK": "這個琴鍵的名稱是什麼？" 
    },
    imageSrc: quiz5Q, 
    answerOptions: [
      { answerText: { "en": "C4", "zh-HK": "C4" }, isCorrect: false },
      { answerText: { "en": "D4", "zh-HK": "D4" }, isCorrect: false },
      { answerText: { "en": "G4", "zh-HK": "G4" }, isCorrect: true },
      { answerText: { "en": "F4", "zh-HK": "F4" }, isCorrect: false },
    ]
  },
  {
    questionText: { 
      "en": "What is the name of this key?", 
      "zh-HK": "這個琴鍵的名稱是什麼？" 
    },
    imageSrc: quiz6Q, 
    answerOptions: [
      { answerText: { "en": "A4", "zh-HK": "A4" }, isCorrect: true },
      { answerText: { "en": "D4", "zh-HK": "D4" }, isCorrect: false },
      { answerText: { "en": "B4", "zh-HK": "B4" }, isCorrect: false },
      { answerText: { "en": "F4", "zh-HK": "F4" }, isCorrect: false },
    ]
  },
  {
    questionText: { 
      "en": "What is the name of this key?", 
      "zh-HK": "這個琴鍵的名稱是什麼？" 
    },
    imageSrc: quiz7Q, 
    answerOptions: [
      { answerText: { "en": "A4", "zh-HK": "A4" }, isCorrect: false },
      { answerText: { "en": "D4", "zh-HK": "D4" }, isCorrect: false },
      { answerText: { "en": "B4", "zh-HK": "B4" }, isCorrect: true },
      { answerText: { "en": "F4", "zh-HK": "F4" }, isCorrect: false },
    ]
  },
  {
    questionText: { 
      "en": "Please play the note", 
      "zh-HK": "請彈奏此音符" 
    },
    imageSrc: quiz8Q,
    isPianoQuestion: true,
    requiredNotes: [60] // MIDI note number for Middle C
  },
  // Chord playing question 
  {
    questionText: { 
      "en": "Please play the note", 
      "zh-HK": "請彈奏此音符" 
    },
    imageSrc: quiz9Q,
    isPianoQuestion: true,
    requiredNotes: [62] 
  },
  {
    questionText: { 
      "en": "Please play the note", 
      "zh-HK": "請彈奏此音符" 
    },
    imageSrc: quiz10Q,
    isPianoQuestion: true,
    requiredNotes: [64] 
  }
];
const tutorialCards = [
  {
    title: { "en": "Correct Playing Posture", "zh-HK": "正確的演奏姿勢" },
    content: { 
      "en": "Keep your hands naturally curved as if holding an apple. Fingers should be curved with fingertips touching the keys vertically. Remember: Keep wrists relaxed and level, not drooping or raised.", 
      "zh-HK": "保持手自然彎曲，就像握著一個蘋果一樣。手指應彎曲，指尖垂直觸碰琴鍵。記住：保持手腕放鬆且水平，不要下垂或抬起。" 
    },
    imageSrc: question2_ans4,
  },
  {
    title: { "en": "❌ Common Posture Mistakes to Avoid", "zh-HK": "❌ 常見的姿勢錯誤需避免" },
    content: { 
      "en": "❌Common mistakes to avoid❌", 
      "zh-HK": "❌需要避免的常見錯誤❌" 
    },
    imageSrc: question2_ans3,
  },
  {
    title: { "en": "❌ Common Posture Mistakes to Avoid", "zh-HK": "❌ 常見的姿勢錯誤需避免" },
    content: { 
      "en": "❌Common mistakes to avoid❌", 
      "zh-HK": "❌需要避免的常見錯誤❌" 
    },
    imageSrc: question2_ans2,
  },
  {
    title: { "en": "❌ Common Posture Mistakes to Avoid", "zh-HK": "❌ 常見的姿勢錯誤需避免" },
    content: { 
      "en": "❌Common mistakes to avoid❌", 
      "zh-HK": "❌需要避免的常見錯誤❌" 
    },
    imageSrc: question2_ans1,
  },
  {
    title: { "en": "Right Hand Basic Position - Finding Middle C", "zh-HK": "右手基本位置 - 找到中央C" },
    content: { 
      "en": "Place your right thumb (first finger) on Middle C. Rest remaining fingers on DEFG: index on D, middle on E, ring on F, pinky on G. This is the basic five-finger position. Middle C is located in the middle of the piano, to the left of the two black keys.", 
      "zh-HK": "將右手拇指（第一指）放在中央C上。其餘手指分別放在DEFG上：食指在D，中指在E，無名指在F，小指在G。這是基本的五指位置。中央C位於鋼琴中間，兩個黑鍵的左側。" 
    },
    imageSrc: fingerPositioning,
  },
  {
    title: { "en": "Understanding Notes on the Staff", "zh-HK": "理解五線譜上的音符" },
    content: { 
      "en": "Counting lines from bottom to top, remember: 'Every Good Boy Does Fine' (EGBDF). Spaces spell: FACE. Middle C is on the first ledger line below. Tip: After finding Middle C, notes to the right follow alphabetically: DEFGAB.", 
      "zh-HK": "從下到上數線，記住：'Every Good Boy Does Fine' (EGBDF)。空格拼出：FACE。中央C位於下面的第一條加線上。提示：找到中央C後，右邊的音符按字母順序排列：DEFGAB。" 
    },
    imageSrc: EveryGoodBoyDoesFine,
  },
  {
    title: { "en": "Understanding Notes on the Staff2", "zh-HK": "理解五線譜上的音符2" },
    content: { 
      "en": "Spaces spell: FACE. Middle C is on the first ledger line below. Tip: After finding Middle C, notes to the right follow alphabetically: DEFGAB.", 
      "zh-HK": "空格拼出：FACE。中央C位於下面的第一條加線上。提示：找到中央C後，右邊的音符按字母順序排列：DEFGAB。" 
    },
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
            controls={false}
          />
        );
      case 'memo':
        return (
          <MemoBeforeQuiz
            cards={tutorialCards}
            title={{
              "en": "Lesson 1: Piano Basics",
              "zh-HK": "課堂一：鋼琴基礎"
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
              "en": "Lesson 1: Piano Basics",
              "zh-HK": "課堂一：鋼琴基礎"
            }}
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

