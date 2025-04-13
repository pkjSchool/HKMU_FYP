import { useState, useRef, useEffect } from "react";

import quizBackground from "../assets/quiz_background.jpg";
import PianoRender from "./PianoPlayingPage/PianoRender";
import { QuizProps } from "./quiz.types";
import { user_lesson_save } from "../api_request/request";
import { getLoginedUser } from "../access_control/user";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { calcLessonStarNumber } from "../util/lessonStar";
import MIDIController, {
  MidiControllerRef,
} from "../components/PianoPlayingPage/MidiController.js";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import shine from "../assets/shine.mp3";

import PianoCharacter, {PianoCharacterRef} from "./Character/PianoCharacter";

function playSound(audioContext: AudioContext, buffer: AudioBuffer) {
  const source = audioContext.createBufferSource();
  const g = audioContext.createGain();
  source.buffer = buffer;
  // source.start(0);
  // g.gain.value = 0.5;
  // source.connect(g);
  // g.connect(audioContext.destination);

  source.connect(audioContext.destination);
  source.start();
}

function processStar() {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  var request = new XMLHttpRequest();
  
  request.open('GET', shine, true);
  
  request.responseType = 'arraybuffer';
  
  request.onload = function() {
    audioContext.decodeAudioData(request.response, function(theBuffer) {
      playSound(audioContext, theBuffer);
    });
  }
  request.send();
}

const Quiz: React.FC<QuizProps> = ({ lesson_ref_id, chapter_ref_id, title, questions, onExit }) => {

  const { t, i18n } = useTranslation();
  const userInfo = getLoginedUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [activeNotes, setActiveNotes] = useState<number[]>([]);

  const MIDIControllerRef = useRef<MidiControllerRef>(null);
  const pianoCharacterRef = useRef<PianoCharacterRef>(null);

  const titleRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener('resize', updateSize);

    i18next.on('languageChanged', function(lng) {
      if (showScore){ pianoCharacterSpeak() }
    })
  }, []);

  useEffect(() => {
    if (questions[currentQuestion].isPianoQuestion) {
      checkAnswer(activeNotes);
    }
  }, [activeNotes]);

  useEffect(() => {
    if (showScore){ pianoCharacterSpeak() }
  }, [showScore])

  const pianoCharacterSpeak = () => {
    const starsNumber = calcLessonStarNumber(score, questions.length)
    pianoCharacterRef.current?.showCharacterHandler()
    switch(i18n.language){
      case "zh-HK":
        if (starsNumber === 3) {
          pianoCharacterRef.current?.setMessageHandler("做得好！你已經準備好迎接更多挑戰。繼續保持！")
        } else if (starsNumber === 2) {
          pianoCharacterRef.current?.setMessageHandler("你走在正確的道路上！繼續探索琴鍵，很快你就能彈奏你的第一首歌！")
        } else {
          pianoCharacterRef.current?.setMessageHandler("學習鋼琴就像學習一門新語言一樣，需要時間！繼續練習，你很快就能掌握基礎。")
        }
        break;
      default:
        if (starsNumber === 3) {
          pianoCharacterRef.current?.setMessageHandler("Well done! You're ready to take on more challenges. Keep up the great work")
        } else if (starsNumber === 2) {
          pianoCharacterRef.current?.setMessageHandler("You're on the right track! Keep exploring the keys, and soon you'll be playing your first song!")
        } else {
          pianoCharacterRef.current?.setMessageHandler("Learning piano is like learning a new language—it takes time! Keep practicing, and soon you'll master the fundamentals.")
        }
    }
    pianoCharacterRef.current?.changePositionHandler({ right: "10%", bottom: "10%" })

  }

  const updateSize = () => {
    const x = titleRef.current.offsetHeight + stepRef.current.offsetHeight + bottomRef.current.offsetHeight
    questionRef.current.style.height = `calc(100vh - ${x}px)`;
  }

  const getResultStar = (score:number, lessonMaxScore:number) => {
    const starsNumber = calcLessonStarNumber(score, lessonMaxScore)
    switch (starsNumber) {
      case 2:
        return <>
          <IoStar className={starAnime} style={{...starSmall, ...starOrder1}} />
          <IoStarOutline className={starAnime} style={{...starBig, ...starOrder2}} />
          <IoStar className={starAnime} style={{...starSmall, ...starOrder3}} />
        </>
        break;
      case 3:
        return <>
            <IoStar className={starAnime} style={{...starSmall, ...starOrder1}} />
            <IoStar className={starAnime} style={{...starBig, ...starOrder2}} />
            <IoStar className={starAnime} style={{...starSmall, ...starOrder3}} />
          </>
        break;
      default:
        return <>
          <IoStar className={starAnime} style={{...starSmall, ...starOrder1}} />
          <IoStarOutline className={starAnime} style={{...starBig, ...starOrder2}} />
          <IoStarOutline className={starAnime} style={{...starSmall, ...starOrder3}} />
        </>
        break;
    }
  }

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
      updateSize()
    } else {
      setShowScore(true);

      setTimeout(()=>{
        processStar()
      }, 300)

      user_lesson_save(parseInt(userInfo.user_id), chapter_ref_id, lesson_ref_id, score).then((response) => {

      }).catch(()=>{

      })


    }
  };

  let steps: JSX.Element[] = [];
  for (let i = 0; i < questions.length; i++) {
    const classStr = "step-item" + (currentQuestion == i ? " active":(currentQuestion > i?" prev":""))
    steps.push(<div key={i} className={classStr}>{i + 1}</div>);
  }

  return (
    // <div
    //   className="d-flex justify-content-center align-items-center vh-100 bg-light"
    //   style={{
    //     backgroundImage: `url(${quizBackground})`,
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //     backgroundRepeat: "no-repeat",
    //   }}
    // >
    <>
      <div
        style={{
          backgroundImage: `url(${quizBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",

          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1
        }}
      ></div>
      <div className="d-flex flex-column align-items-center vh-100">

        <div className="leature-title" ref={titleRef}>{title[i18n.language]}</div>

        <div style={{width: "80%", padding: "40px 0"}} ref={stepRef}><div className="step-list">{ steps }</div></div>

        <div style={{ flexGrow: 1, width: "100%", padding: "0 0 40px" }} ref={questionRef}>
          <div
            className={`card shadow`}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              // minHeight: (questions[currentQuestion].isPianoQuestion)?0:"70vh",
              margin:"0 auto",
              maxHeight: "100%",
              overflow: "auto",
              width: "80%"
            }}
          >
            {/* <div className="card-header d-flex justify-content-between align-items-center">
              <span className="fw-bold fs-4">{title[i18n.language]}</span>
              <button
                className="btn btn-danger btn-sm"
                onClick={onExit}
                style={{ padding: "2px 8px" }}
              >
                X
              </button>
            </div> */}

            <div
              className="card-body"
              style={
                questions[currentQuestion].isPianoQuestion
                  ? {
                      padding: "1rem",
                      flex: "1 1 auto",
                    }
                  : {
                      padding: "1rem",
                      flex: "1 1 auto",
                      // overflow: "auto",
                      // maxHeight: "70vh"
                    }
              }
            >
              {showScore ? (
                <div className="text-center pb-5">
                  <div className="mt-3 mb-3" style={starWrapper}>
                    { getResultStar(score, questions.length) }
                  </div>
                  <h4>{t("quiz_completed")}</h4>
                  <p>
                  {t("score")}: {score} {t("out of")} {questions.length}
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    {questions[currentQuestion].imageSrc && (
                      <img
                        src={questions[currentQuestion].imageSrc}
                        alt="Question"
                        className="img-fluid mb-3"
                        style={{maxWidth: '100%', maxHeight: '70%', objectFit: "contain" }}
                      />
                    )}
                    <p className="card-text fs-5">
                      {questions[currentQuestion].questionText[i18n.language]}
                    </p>
                    <p className="text-center text-secondary mt-2">
                      {t("question")} {currentQuestion + 1} {t("of")} {questions.length}
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
                                  {t("note")} {note}
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
                              <i className="bi bi-play-fill"></i> {t("Test Chord")}
                            </button>
                          )}
                        </div>

                      </div>
                      <div>
                        {answered && (
                          <div className="alert alert-success mb-3">{t("Correct!")}</div>
                        )}
                      </div>
                    </>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="quiz-bottom-panel" ref={bottomRef}>
          <div className="quiz-bottom-panel-inner">

            {!questions[currentQuestion].isPianoQuestion?
              <div className="answer-btn-list">
                {questions[currentQuestion].answerOptions?.map(
                  (option, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleAnswerButtonClick(index, option.isCorrect)
                      }
                      className={`btn ${
                        answered
                          ? option.isCorrect
                            ? "btn-success animate__animated animate__shakeY"
                            : selectedAnswer === index
                            ? "btn-danger animate__animated animate__shakeX"
                            : "btn-outline-secondary"
                          : "btn-outline-secondary"
                      } ${answered ? "disabled" : ""}`}
                    >
                      {option.answerText?option.answerText[i18n.language]:""}
                    </button>
                  )
                )}
              </div>
            :null}

            <div className="mt-3" style={{height: "43px"}}>
              {answered && (
                <button className="btn btn-warning w-100" onClick={handleNextQuestion}>
                  {t("Next Question")}
                </button>
              )}
              {showScore && (
                <button className="btn btn-danger w-100" onClick={onExit}>{t("exit")}</button>
              )}
            </div>

          </div>

          {!showScore && !answered && questions[currentQuestion].isPianoQuestion ? (
            <>
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
            </>
          ):null}
        </div>

        <PianoCharacter ref={pianoCharacterRef}/>

      </div>
    </>
  );
};

const starOrder1 = { animationDelay: "0.5s" }

const starOrder2 = { animationDelay: "0.8s" }

const starOrder3 = { animationDelay: "1.1s" }

const starWrapper:object = { display:"flex", justifyContent:"center", alignItems:"baseline" }

const starSmall = {
    fontSize:"60px",
    color: "var(--bs-warning)"
}

const starBig = {
    fontSize:"80px",
    color: "var(--bs-warning)"  
}

const starAnime = "animate__animated animate__zoomIn animate__faster"

export default Quiz;
