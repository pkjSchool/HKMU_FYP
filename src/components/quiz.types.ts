export interface AnswerOption {
    answerText?: string;
    isImage?: boolean;
    imageSrc?: string;
    isCorrect: boolean;
  }
  
  export interface Question {
    questionText: string;
    imageSrc?: string;
    answerOptions?: AnswerOption[];
    isPianoQuestion?: boolean; 
    requiredNotes?: number[];   
  }
  
  export interface QuizProps {
    lesson_ref_id: number;
    chapter_ref_id: number;
    title: string;
    questions: Question[];
    onExit?: () => void;
  }