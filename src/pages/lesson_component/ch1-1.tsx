import { useState } from "react";
import { useParams } from "react-router-dom";
import Quiz from "../../components/Quiz";
import { useNavigate } from "react-router-dom";
import VideoBeforeQuiz from "../../components/VideoBeforeQuiz.tsx";
import quiz_video from "../../assets/quiz_video/test.mp4";
import question1 from "../../assets/quiz_img/quiz_1/quiz1_1piano.png";
import question2_ans1 from "../../assets/quiz_img/quiz_1/quiz1_2.jpg";
import question2_ans2 from "../../assets/quiz_img/quiz_1/quiz1_2_1.png";
import question2_ans3 from "../../assets/quiz_img/quiz_1/quiz1_2_2.png";
import question2_ans4 from "../../assets/quiz_img/quiz_1/quiz1_2_3.png";
import question3_ans1 from "../../assets/quiz_img/quiz_1/quiz1_3.png";
import question3_ans2 from "../../assets/quiz_img/quiz_1/quiz1_3_1.png";
import question3_ans3 from "../../assets/quiz_img/quiz_1/quiz1_3_2.png";
import question3_ans4 from "../../assets/quiz_img/quiz_1/quiz1_3_3.png";

const questionsCh1_1 = [
  {
    questionText: "How many keys does a standard piano have?",
    imageSrc: question1,
    answerOptions: [
      { answerText: "61", isCorrect: false },
      { answerText: "87", isCorrect: false },
      { answerText: "88", isCorrect: true },
      { answerText: "89", isCorrect: false },
    ],
  },
  {
    questionText: "which is the correct gesture to play the piano?",
    answerOptions: [
      { isImage: true, imageSrc: question2_ans1, isCorrect: false },
      { isImage: true, imageSrc: question2_ans4, isCorrect: true },
      { isImage: true, imageSrc: question2_ans3, isCorrect: false },
      { isImage: true, imageSrc: question2_ans2, isCorrect: false },
    ],
  },
  {
    questionText: "What is the name of the white keys on a piano?",
    answerOptions: [
      { answerText: "Flats", isCorrect: false },
      { answerText: "Sharps", isCorrect: false },
      { answerText: "Natural notes", isCorrect: true },
      { answerText: "Chords", isCorrect: false },
    ],
  },
  {
    questionText: "What is the name of the black keys on a piano?",
    answerOptions: [
      { answerText: "Flats", isCorrect: false },
      { answerText: "Sharps", isCorrect: false },
      { answerText: "Natural notes", isCorrect: true },
      { answerText: "Chords", isCorrect: false },
    ],
  },
  {
    questionText: "Which musical note is the correct one?",
    answerOptions: [
      { isImage: true, imageSrc: question3_ans1, isCorrect: true },
      { isImage: true, imageSrc: question3_ans2, isCorrect: false },
      { isImage: true, imageSrc: question3_ans3, isCorrect: false },
      { isImage: true, imageSrc: question3_ans4, isCorrect: false },
    ],
  },
  


];
const tutorialCards = [
  {
    title: "正確的彈琴手勢",
    content: "請將手自然彎曲，就像握著一顆蘋果的形狀。手指應該保持彎曲，指尖垂直觸碰琴鍵。記住：手腕要放鬆，保持水平，不要下垂或抬高。",
    imageSrc: "/assets/tutorial/correct_hand_position.jpg", // 需要一張展示正確手型的圖片
  },
  {
    title: "右手基本位置 - 認識中央C",
    content: "右手拇指（第一指）放在中央C上。其餘手指依序放在DEFG上：食指放D、中指放E、無名指放F、小指放G。這是最基本的五指位置。中央C的位置在鋼琴中間，在兩個黑鍵組的左邊白鍵。",
    imageSrc: "/assets/tutorial/hand_position_C.jpg", // 需要一張標示手指位置和對應音符的圖片
  },
  {
    title: "認識五線譜上的音符位置",
    content: "從下往上數的五條線，可以記住一個口訣：「Every Good Boy Does Fine」(EGBDF)。線與線之間的空格則是：FACE。中央C位於第一加線下方。小技巧：找到中央C後，往右依序就是DEFGAB，就像字母表一樣順序。",
    imageSrc: "/assets/tutorial/staff_notes.jpg", // 需要一張標示五線譜音符位置的圖片
  },
  {
    title: "音符位置小技巧",
    content: "1. 中央C在兩個黑鍵組的左邊\n2. 所有的C都在兩個黑鍵組的左邊\n3. 所有的F都在三個黑鍵組的左邊\n4. 相鄰的白鍵音符永遠按字母順序排列：CDEFGAB\n5. 練習時可以用貼紙標記重要音符位置，幫助記憶",
    imageSrc: "/assets/tutorial/piano_keys_guide.jpg", // 需要一張標示鍵盤上音符位置的指引圖
  },
  {
    title: "實際練習",
    content: "現在請試著：\n1. 找到中央C\n2. 將右手拇指放在C上\n3. 其餘手指自然放在DEFG上\n4. 確保手型像握著蘋果一樣自然彎曲\n5. 依序彈奏CDEFG，感受每個手指的動作",
    imageSrc: "/assets/tutorial/practice_position.jpg", // 需要一張展示完整手位和實踐的圖片
  }
];
function Ch1_1() {
  const [showVideo, setShowVideo] = useState(true);
  const navigate = useNavigate();

  const handleVideoEnd = () => {
    setShowVideo(false);
  };

  const handleExitQuiz = () => {
    console.log("Quiz exited!");
    navigate("/");
  };

  return (
    <>
      {showVideo ? (
        <VideoBeforeQuiz
          videoSrc={quiz_video}
          onVideoEnd={handleVideoEnd}
          autoPlay={true}
          controls={true}
        />
      ) : (
        <Quiz
          title="Lesson 1: Piano Basics"
          questions={questionsCh1_1}
          onExit={handleExitQuiz}
        />
      )}
    </>
  );
}

export default Ch1_1;

