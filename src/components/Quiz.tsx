import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import quizBackground from "../assets/quiz_background.jpg";

interface AnswerOption {
  answerText?: string;
  isImage?: boolean;
  imageSrc?: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  imageSrc?: string;
  answerOptions: AnswerOption[];
}

interface QuizProps {
  title: string;
  questions: Question[];
  onExit?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ title, questions,onExit  }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswerButtonClick = (index: number, isCorrect: boolean) => {
    setAnswered(true);
    setSelectedAnswer(index);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setAnswered(false);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      style={{
        backgroundImage: `url(${quizBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card w-50 shadow"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="card-header d-flex justify-content-between align-items-center">
          <span className="fw-bold fs-4">{title}</span>
          <button
            className="btn btn-danger btn-sm"
            onClick={onExit} 
            style={{
              padding: "2px 8px",
            }}
          >
            X
          </button>
        </div>
        <div className="card-body">
          {showScore ? (
            <div className="card w-50 shadow">
              <div className="card-header text-center fw-bold fs-4">
                You scored {score} out of {questions.length}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-center">
                {questions[currentQuestion].imageSrc && (
                  <img
                    src={questions[currentQuestion].imageSrc}
                    alt="Question"
                    className="img-fluid mb-3"
                    style={{ maxHeight: "300px", objectFit: "contain" }}
                  />
                )}
                <p className="card-text fs-5">
                  {questions[currentQuestion].questionText}
                </p>
              </div>

              {questions[currentQuestion].answerOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleAnswerButtonClick(index, option.isCorrect)
                  }
                  className={`btn w-100 my-2 ${
                    answered
                      ? option.isCorrect
                        ? "btn-success text-white"
                        : selectedAnswer === index
                        ? "btn-danger text-white"
                        : "btn-outline-secondary"
                      : "btn-outline-secondary"
                  } ${answered ? "disabled" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px",
                  }}
                >
                  {option.isImage ? (
                    <img
                      src={option.imageSrc}
                      alt={`Option ${index + 1}`}
                      className="img-fluid"
                      style={{
                        maxHeight: "100px",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    option.answerText
                  )}
                </button>
              ))}
              <button
                className={`block w-100 btn ${
                  answered ? "btn-success" : "btn-outline-success"
                }`}
                onClick={handleNextQuestion}
                disabled={!answered}
              >
                Next Question
              </button>
              <p className="text-center text-secondary w-100">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
