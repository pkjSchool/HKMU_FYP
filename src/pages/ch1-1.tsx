import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
const questions = [
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
    questionText: "How many keys does a standard piano have?",
    answerOptions: [
      { answerText: "61", isCorrect: false },
      { answerText: "76", isCorrect: false },
      { answerText: "88", isCorrect: true },
      { answerText: "100", isCorrect: false },
    ],
  },
  {
    questionText: "Which hand typically plays the melody on a piano?",
    answerOptions: [
      { answerText: "Left hand", isCorrect: false },
      { answerText: "Right hand", isCorrect: true },
      { answerText: "Both hands equally", isCorrect: false },
      { answerText: "Neither hand", isCorrect: false },
    ],
  },
  {
    questionText: "What does the sustain pedal on a piano do?",
    answerOptions: [
      { answerText: "Makes the notes louder", isCorrect: false },
      { answerText: "Sustains the sound of the notes", isCorrect: true },
      { answerText: "Changes the pitch of the notes", isCorrect: false },
      { answerText: "Stops the sound immediately", isCorrect: false },
    ],
  },
  {
    questionText: "What is the first note of the C major scale?",
    answerOptions: [
      { answerText: "A", isCorrect: false },
      { answerText: "C", isCorrect: true },
      { answerText: "E", isCorrect: false },
      { answerText: "G", isCorrect: false },
    ],
  },
];
function Ch1_1() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handelAnswerButtonClick = (index: number, isCorrect: boolean) => {
    setAnswered(true);
    setSelectedAnswer(index);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const NextQuestion = () => {
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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card w-50 shadow">
        <div className="card-header text-center fw-bold fs-4">Quiz App</div>
        <div className="card-body">
          {showScore ? (
            <div className="card w-50 shadow">
              <div className="card-header text-center fw-bold fs-4">
                You scored {score} out of {questions.length}
              </div>
            </div>
          ) : (
            <>
              <p className="card-text fs-5">
                {questions[currentQuestion].questionText}
              </p>
              {questions[currentQuestion].answerOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handelAnswerButtonClick(index, option.isCorrect)
                  }
                  className={`btn btn-outline-secondary w-100 my-2 ${
                    answered
                      ? option.isCorrect
                        ? "btn-success text-white"
                        : selectedAnswer === index
                        ? "btn-danger text-white"
                        : ""
                      : ""
                  }`}
                >
                  {option.answerText}
                </button>
              ))}
              <button
                className={`block w-100 btn ${
                  answered ? "btn-success" : "btn-outline-success"
                }`}
                onClick={NextQuestion}
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
}

export default Ch1_1;
