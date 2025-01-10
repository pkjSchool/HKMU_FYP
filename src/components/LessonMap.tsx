import { FC } from 'react';
import '../css/LessonMap.css';

interface Lesson {
  id: number;
  completed: boolean;
  stars?: number;
  onClick?: () => void;
}

interface Chapter {
  title: string;
  lessons: Lesson[];
}

interface LessonMapProps {
  chapters: Chapter[];
}

const LessonMap: FC<LessonMapProps> = ({ chapters }) => {
  return (
    <div className="lesson-map-container">
      {chapters.map((chapter, chapterIndex) => (
        <div key={chapterIndex} className="chapter-container">
          <h3 className="chapter-title">{chapter.title}</h3>
          <div className="lessons-container">
            {chapter.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="lesson-item">
                <div className="lesson-node-wrapper">
                  <button 
                    className={`lesson-node ${lesson.completed ? 'completed' : ''}`}
                    onClick={() => lesson.onClick && lesson.onClick()}
                  >
                    {lessonIndex + 1}
                  </button>
                  {lesson.stars !== undefined && (
                    <div className="lesson-status">
                      {Array(lesson.stars).fill('⭐').join('')}
                    </div>
                  )}
                </div>
                {lessonIndex < chapter.lessons.length - 1 && (
                  <div className="connector-line" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonMap;
