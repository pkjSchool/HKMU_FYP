export interface AnswerOption {
    answerText?: Record<string, string>;
    isImage?: boolean;
    imageSrc?: string;
    isCorrect: boolean;
  }
  
  export interface Question {
    questionText: Record<string, string>;
    imageSrc?: string;
    answerOptions?: AnswerOption[];
    isPianoQuestion?: boolean; 
    requiredNotes?: number[];
  }
  
  export interface QuizProps {
    lesson_ref_id: number;
    chapter_ref_id: number;
    title: Record<string, string>;
    questions: Question[];
    onExit?: () => void;
  }