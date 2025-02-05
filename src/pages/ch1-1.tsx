import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Quiz from "../components/Quiz";
import { useNavigate } from "react-router-dom";
import VideoBeforeQuiz from "../components/VideoBeforeQuiz.tsx";
import quiz_video from "../assets/quiz_video/test.mp4";
import question1 from "../assets/quiz_img/quiz_1/quiz1_1piano.png";
import question2_ans1 from "../assets/quiz_img/quiz_1/quiz1_2.jpg";
import question2_ans2 from "../assets/quiz_img/quiz_1/quiz1_2_1.png"; 
import question2_ans3 from "../assets/quiz_img/quiz_1/quiz1_2_2.png";  
import question2_ans4 from "../assets/quiz_img/quiz_1/quiz1_2_3.png";  
import question3_ans1 from "../assets/quiz_img/quiz_1/quiz1_3.png";
import question3_ans2 from "../assets/quiz_img/quiz_1/quiz1_3_1.png";
import question3_ans3 from "../assets/quiz_img/quiz_1/quiz1_3_2.png";
import question3_ans4 from "../assets/quiz_img/quiz_1/quiz1_3_3.png";

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
    questionText:"which is the correct gesture to play the piano?",
    answerOptions:[
      {isImage:true,imageSrc:question2_ans1,isCorrect:false},
      {isImage:true,imageSrc:question2_ans4,isCorrect:true},
      {isImage:true,imageSrc:question2_ans3,isCorrect:false},
      {isImage:true,imageSrc:question2_ans2,isCorrect:false}
    ]
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
    answerOptions:[
      {isImage:true,imageSrc:question3_ans1,isCorrect:true},
      {isImage:true,imageSrc:question3_ans2,isCorrect:false},
      {isImage:true,imageSrc:question3_ans3,isCorrect:false},
      {isImage:true,imageSrc:question3_ans4,isCorrect:false}
    ]
  },

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
        <Quiz title="Lesson 1: Piano Basics" questions={questionsCh1_1} onExit={handleExitQuiz} />
      )}
    </>
  );
}

export default Ch1_1;
