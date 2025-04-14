import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoBeforeQuiz from '../../components/VideoBeforeQuiz';
import MemoBeforeQuiz from '../../components/MemoBeforeQuiz';
import Quiz from '../../components/Quiz';
import quiz_video from '../../assets/quiz_video/test.mp4';
import fourFourTime from "../../assets/quiz_img/quiz_4/four_four_time.png";
import threeFourTime from "../../assets/quiz_img/quiz_4/three_four_time.png";
import sixEightTime from "../../assets/quiz_img/quiz_4/six_eight_time.png";
import eighthNote from "../../assets/quiz_img/quiz_4/eighth_note.png";
import sixteenthNote from "../../assets/quiz_img/quiz_4/sixteenth_note.jpg";
import dottedQuarterNote from "../../assets/quiz_img/quiz_4/dotted_quarter_note.png";
import rest_quarter from "../../assets/quiz_img/quiz_4/rest_quarter.png";
import rest_whole from "../../assets/quiz_img/quiz_4/rest_whole.png";
import metronome from "../../assets/quiz_img/quiz_4/metronome.jpg";
import rhythmPattern from "../../assets/quiz_img/quiz_3/middle_c_position.png";


// 章節測驗題目
export const questionsCh1_4 = [
  {
    questionText: {
      en: "What does this time signature mean?",
      "zh-HK": "這個拍號是什麼意思？"
    },
    imageSrc: fourFourTime,
    answerOptions: [
      { 
        answerText: {
          en: "4 beats per measure, quarter note gets 1 beat",
          "zh-HK": "每小節4拍，四分音符為1拍"
        },
        isCorrect: true 
      },
      { 
        answerText: {
          en: "4 beats per measure, whole note gets 1 beat",
          "zh-HK": "每小節4拍，全音符為1拍"
        },
        isCorrect: false 
      },
      { 
        answerText: {
          en: "4 measures per line, 4 notes per measure",
          "zh-HK": "每行4小節，每小節4個音符"
        },
        isCorrect: false 
      }
    ]
  },
  {
    questionText: {
      en: "What does this time signature mean?",
      "zh-HK": "這個拍號是什麼意思？"
    },
    imageSrc: threeFourTime,
    answerOptions: [
      { 
        answerText: {
          en: "3 beats per measure, quarter note gets 1 beat",
          "zh-HK": "每小節3拍，四分音符為1拍"
        },
        isCorrect: true 
      },
      { 
        answerText: {
          en: "3 measures per line, 4 notes per measure",
          "zh-HK": "每行3小節，每小節4個音符"
        },
        isCorrect: false 
      },
      { 
        answerText: {
          en: "3 beats per measure, half note gets 1 beat",
          "zh-HK": "每小節3拍，二分音符為1拍"
        },
        isCorrect: false 
      }
    ]
  },
  {
    questionText: {
      en: "What does this time signature mean?",
      "zh-HK": "這個拍號是什麼意思？"
    },
    imageSrc: sixEightTime,
    answerOptions: [
      { 
        answerText: {
          en: "6 beats per measure, eighth note gets 1 beat",
          "zh-HK": "每小節6拍，八分音符為1拍"
        },
        isCorrect: true 
      },
      { 
        answerText: {
          en: "6 measures per line, 8 notes per measure",
          "zh-HK": "每行6小節，每小節8個音符"
        },
        isCorrect: false 
      },
      { 
        answerText: {
          en: "6 beats per measure, quarter note gets 1 beat",
          "zh-HK": "每小節6拍，四分音符為1拍"
        },
        isCorrect: false 
      }
    ]
  },
  {
    questionText: {
      en: "What is this note called?",
      "zh-HK": "這個音符叫什麼？"
    },
    imageSrc: eighthNote,
    answerOptions: [
      { 
        answerText: {
          en: "Quarter note",
          "zh-HK": "四分音符"
        },
        isCorrect: false 
      },
      { 
        answerText: {
          en: "Eighth note",
          "zh-HK": "八分音符"
        },
        isCorrect: true 
      },
      { 
        answerText: {
          en: "Sixteenth note",
          "zh-HK": "十六分音符"
        },
        isCorrect: false 
      }
    ]
  },
  {
    questionText: {
      en: "What is this note called?",
      "zh-HK": "這個音符叫什麼？"
    },
    imageSrc: sixteenthNote,
    answerOptions: [
      { 
        answerText: {
          en: "Sixteenth note",
          "zh-HK": "十六分音符"
        },
        isCorrect: true 
      },
      { 
        answerText: {
          en: "Thirty-second note",
          "zh-HK": "三十二分音符"
        },
        isCorrect: false 
      },
      { 
        answerText: {
          en: "Eighth note",
          "zh-HK": "八分音符"
        },
        isCorrect: false 
      }
    ]
  },
  {
    questionText: {
      en: "What is this note called?",
      "zh-HK": "這個音符叫什麼？"
    },
    imageSrc: dottedQuarterNote,
    answerOptions: [
      { 
        answerText: {
          en: "Dotted quarter note",
          "zh-HK": "附點四分音符"
        },
        isCorrect: true 
      },
      { 
        answerText: {
          en: "Quarter note",
          "zh-HK": "四分音符"
        },
        isCorrect: false 
      },
      { 
        answerText: {
          en: "Dotted half note",
          "zh-HK": "附點二分音符"
        },
        isCorrect: false 
      }
    ]
  },
  {
    questionText: {
      en: "What is this symbol called?",
      "zh-HK": "這個符號叫什麼？"
    },
    imageSrc: rest_quarter,
    answerOptions: [
      { 
        answerText: {
          en: "Half rest",
          "zh-HK": "二分休止符"
        },
        isCorrect: false 
      },
      { 
        answerText: {
          en: "Quarter rest",
          "zh-HK": "四分休止符"
        },
        isCorrect: true 
      },
      { 
        answerText: {
          en: "Eighth rest",
          "zh-HK": "八分休止符"
        },
        isCorrect: false 
      }
    ]
  },
  {
    questionText: {
      en: "What is this symbol called?",
      "zh-HK": "這個符號叫什麼？"
    },
    imageSrc: rest_whole,
    answerOptions: [
      { 
        answerText: {
          en: "Whole rest",
          "zh-HK": "全休止符"
        },
        isCorrect: true 
      },
      { 
        answerText: {
          en: "Half rest",
          "zh-HK": "二分休止符"
        },
        isCorrect: false 
      },
      { 
        answerText: {
          en: "Full measure rest",
          "zh-HK": "整小節休止符"
        },
        isCorrect: false 
      }
    ]
  },
  {
    questionText: {
      en: "What does a metronome do?",
      "zh-HK": "節拍器的功能是什麼？"
    },
    imageSrc: metronome,
    answerOptions: [
      { 
        answerText: {
          en: "Measures the pitch of notes",
          "zh-HK": "測量音符的音高"
        },
        isCorrect: false 
      },
      { 
        answerText: {
          en: "Keeps a steady beat/tempo",
          "zh-HK": "保持穩定的節拍/速度"
        },
        isCorrect: true 
      },
      { 
        answerText: {
          en: "Records your playing",
          "zh-HK": "錄製你的演奏"
        },
        isCorrect: false 
      }
    ]
  },
  {
    questionText: {
      en: "Try to play this rhythm pattern with one note (C)",
      "zh-HK": "嘗試用一個音符(C)演奏這個節奏型態"
    },
    imageSrc: rhythmPattern,
    isPianoQuestion: true,
    requiredNotes: [60] // Middle C
  }
];

// Tutorial content
const tutorialCards = [
  {
    title: { en: "Time Signatures", "zh-HK": "拍號" },
    content: { 
      en: "Time signatures tell us how many beats are in a measure and which note value gets one beat. 4/4 means 4 beats per measure, and a quarter note gets one beat.", 
      "zh-HK": "拍號告訴我們每小節有多少拍，以及哪個音符值為一拍。4/4 表示每小節有 4 拍，四分音符為一拍。" 
    },
    imageSrc: fourFourTime
  },
  {
    title: { en: "Note Values", "zh-HK": "音符時值" },
    content: { 
      en: "Different note shapes represent different durations. A dot after a note increases its duration by half its original value. For example, a dotted quarter note equals a quarter note plus an eighth note.", 
      "zh-HK": "不同的音符形狀代表不同的時值。音符後的點會將其時值增加一半。例如，附點四分音符等於四分音符加上八分音符。" 
    },
    imageSrc: dottedQuarterNote
  },
  {
    title: { en: "Rests", "zh-HK": "休止符" },
    content: { 
      en: "Rests indicate periods of silence. Each note value has a corresponding rest symbol. For example, a quarter rest equals one beat of silence in 4/4 time.", 
      "zh-HK": "休止符表示靜止的時段。每個音符時值都有相應的休止符號。例如，在 4/4 拍中，四分休止符等於一拍的靜止。" 
    },
    imageSrc: rest_quarter
  },
  {
    title: { en: "Rhythm Patterns", "zh-HK": "節奏模式" },
    content: { 
      en: "Rhythm is the pattern of long and short notes and rests in music. Practicing simple rhythms helps develop timing skills essential for playing piano.", 
      "zh-HK": "節奏是音樂中長短音符和休止符的模式。練習簡單的節奏有助於培養彈鋼琴所需的時間掌控技能。" 
    },
    imageSrc: rhythmPattern
  }
];

const chapter_ref_id = 1;
const lesson_ref_id = 4;

function Ch1_4() {
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
              en: "Lesson 4: Rhythm and Time",
              "zh-HK": "第四課：節奏與拍子"
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
              en: "Lesson 4: Rhythm and Time",
              "zh-HK": "第四課：節奏與拍子"
            }}
            questions={questionsCh1_4}
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

export default Ch1_4;