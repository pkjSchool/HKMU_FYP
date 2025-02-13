const questions = [
  // 一般選擇題
  {
    questionText: "What is the name of this note?",
    imageSrc: "path/to/image.png",
    answerOptions: [
      { answerText: "C4", isCorrect: true },
      { answerText: "D4", isCorrect: false },
      { answerText: "E4", isCorrect: false },
    ]
  },
  // 彈奏題
  {
    questionText: "請彈奏中央 C (Middle C)",
    imageSrc: "path/to/sheet.png",
    isPianoQuestion: true,
    requiredNotes: [60] // 中央 C 的 MIDI 音符編號
  },
  // 和弦彈奏題
  {
    questionText: "請彈奏 C 大三和弦",
    imageSrc: "path/to/chord.png",
    isPianoQuestion: true,
    requiredNotes: [60, 64, 67] // C4, E4, G4
  }
];