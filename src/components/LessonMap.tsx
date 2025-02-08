import { FC } from 'react';
import { NavLink } from "react-router-dom";

interface Lesson {
  id: string;
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

  const getConnectorDirectionClass = (idx:number) => {
    return (idx%2==0)?"connector-left":"connector-right"
  }

  return (
    <div className="lesson-map-container">
      {chapters.map((chapter, chapterIndex) => (
        <div key={chapterIndex} className="chapter-container animate__animated animate__fadeIn">
          <h3 className="chapter-title">{chapter.title}</h3>
          <div className="lessons-container">
            {chapter.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="lesson-item">
                <div className="lesson-node-wrapper">
                <NavLink 
                    to={`/lesson/${lesson.id}`}  
                    className={({ isActive }) =>  
                      `lesson-node ${lesson.completed ? 'completed' : ''} ${isActive ? 'active' : ''}`
                    }
                    onClick={() => lesson.onClick && lesson.onClick()}  
                  >
                    {lessonIndex + 1} 
                  </NavLink>
                  {lesson.stars !== undefined && (
                    <div className="lesson-status">
                      {Array(lesson.stars).fill('⭐').join('')}
                    </div>
                  )}
                </div>
                {lessonIndex < chapter.lessons.length - 1 && (
                  <div className={["connector-wrapper", getConnectorDirectionClass(lessonIndex)].join(" ")}>
                    <div className="connector-line connector-line-1"></div>
                    <div className="connector-line connector-line-2"></div>
                    <div className="connector-line connector-line-3"></div>
                  </div>
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
