import { useState, useRef, useEffect } from "react";
import quizBackground from "../assets/quiz_background.jpg";
import PianoRender from "./PianoPlayingPage/PianoRender";
import { QuizProps } from "./quiz.types";
import MIDIController, {
  MidiControllerRef,
} from "../components/PianoPlayingPage/MidiController.js";

const Quiz: React.FC<QuizProps> = ({ title, questions, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const MIDIControllerRef = useRef<MidiControllerRef>(null);

  useEffect(() => {
    if (questions[currentQuestion].isPianoQuestion) {
      checkAnswer(activeNotes);
    }
  }, [activeNotes]);

  const checkAnswer = (notes: number[]) => {
    if (answered) return;
    const requiredNotes = questions[currentQuestion].requiredNotes || [];
    const allRequiredNotesPressed =
      requiredNotes.length > 0 &&
      notes.length === requiredNotes.length &&
      requiredNotes.every((requiredNote) => notes.includes(requiredNote));

    if (allRequiredNotesPressed) {
      console.log("Correct answer!");
      setScore((prevScore) => prevScore + 1);
      setTimeout(() => {
        setAnswered(true);
      }, 100);
    }
  };

  const handleAnswerButtonClick = (index: number, isCorrect: boolean) => {
    setAnswered(true);
    setSelectedAnswer(index);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const onNoteOn = (note: number) => {
    const noteArrIdx = activeNotes.indexOf(note);
    if (noteArrIdx < 0) {
      setActiveNotes((prev) => [...prev, note]);

      if (MIDIControllerRef.current) {
        MIDIControllerRef.current.playNote(note, 50);
      }
    }
  };

  const onNoteOff = (note: number) => {
    const noteArrIdx = activeNotes.indexOf(note);
    setActiveNotes((prev) => prev.filter((n) => n !== note));

    if (noteArrIdx >= 0) {
      // setActiveNotes((prev) => prev.filter((n) => n !== note));
      setActiveNotes((prev) => prev.splice(noteArrIdx, 1));

      if (MIDIControllerRef.current) {
        MIDIControllerRef.current.stopNote(note);
      }
    }
  };

  const autoPlayChord = () => {
    const requiredNotes = questions[currentQuestion].requiredNotes || [];
    setActiveNotes([]);
    requiredNotes.forEach((note) => {
      onNoteOn(note);
    });
    setTimeout(() => {
      requiredNotes.forEach((note) => {
        onNoteOff(note);
      });
    }, 1000);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setAnswered(false);
    setActiveNotes([]);
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
        className={`card shadow ${
          questions[currentQuestion].isPianoQuestion ? "w-100 h-100" : "w-50"
        }`}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="card-header d-flex justify-content-between align-items-center">
          <span className="fw-bold fs-4">{title}</span>
          <button
            className="btn btn-danger btn-sm"
            onClick={onExit}
            style={{ padding: "2px 8px" }}
          >
            X
          </button>
        </div>

        <div
          className="card-body"
          style={
            questions[currentQuestion].isPianoQuestion
              ? {
                  padding: 0,
                  flex: "1 1 auto",
                }
              : {
                  padding: "1rem",
                  flex: "1 1 auto",
                }
          }
        >
          {showScore ? (
            <div className="text-center">
              <h4>Quiz completed!</h4>
              <p>
                Score: {score} out of {questions.length}
              </p>
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

              {questions[currentQuestion].isPianoQuestion ? (
                <>
                  <div className="piano-question">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="note-indicators">
                        {questions[currentQuestion].requiredNotes?.map(
                          (note) => (
                            <span
                              key={note}
                              className={`badge ${
                                activeNotes.includes(note)
                                  ? "bg-success"
                                  : "bg-secondary"
                              } me-2`}
                            >
                              Note {note}
                            </span>
                          )
                        )}
                      </div>

                      {!answered && (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={autoPlayChord}
                          style={{ marginRight: "1rem" }}
                        >
                          <i className="bi bi-play-fill"></i> Test Chord
                        </button>
                      )}
                    </div>

                    <MIDIController
                      ref={MIDIControllerRef}
                      onNoteOn={onNoteOn}
                      onNoteOff={onNoteOff}
                    />
                    <PianoRender
                      activeNote={activeNotes}
                      onNoteOn={onNoteOn}
                      onNoteOff={onNoteOff}
                    />
                  </div>
                  <div>
                    {answered && (
                      <div className="alert alert-success mb-3">Correct!</div>
                    )}
                    {answered && (
                      <button
                        className="btn btn-primary w-100 mt-3"
                        onClick={handleNextQuestion}
                      >
                        Next Question
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  {questions[currentQuestion].answerOptions?.map(
                    (option, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleAnswerButtonClick(index, option.isCorrect)
                        }
                        className={`btn w-100 my-2 ${
                          answered
                            ? option.isCorrect
                              ? "btn-success"
                              : selectedAnswer === index
                              ? "btn-danger"
                              : "btn-outline-secondary"
                            : "btn-outline-secondary"
                        } ${answered ? "disabled" : ""}`}
                      >
                        {option.answerText}
                      </button>
                    )
                  )}
                </div>
              )}

              {answered && !questions[currentQuestion].isPianoQuestion && (
                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={handleNextQuestion}
                >
                  Next Question
                </button>
              )}

              <p className="text-center text-secondary mt-3">
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
