import { FC, useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";

import { user_lesson_get } from "../api_request/request";
import { getLoginedUser } from "../access_control/user";

import { calcLessonStarNumber, printLessonStar } from "../util/lessonStar";

import { FaBook } from "react-icons/fa";

import { questionsCh1_1 } from "../pages/lesson_component/ch1-1";
import { questionsCh1_2 } from "../pages/lesson_component/ch1-2";

interface Lesson {
  id: string;
  ref_id: number;
  completed: boolean;
  stars?: number;
  onClick?: () => void;
}

interface Chapter {
  ref_id: number;
  title: string;
  lessons: Lesson[];
}

interface LessonMapProps {
  chapters: Chapter[];
}

const LessonMap: FC<LessonMapProps> = ({ chapters }) => {
    const userInfo = getLoginedUser();
    // const [isLoad, setIsload] = useState<boolean>(false);
    const [userLessonRecord, setUserLessonRecord] = useState([]);

  const getConnectorDirectionClass = (idx:number) => {
    return (idx%2==0)?"connector-left":"connector-right"
  }

  // const setUserLessonRecord = (list:any) => {
  //   return userLessonRecord.current = list
  // }

  const getLessonMaxScore = (chapter_id:number, lesson_id:number) => {
    const record: { [key: number]: { [key: number]: any[] } } = {
      1: { "1": questionsCh1_1, 2: questionsCh1_2}
    }
    const target = (record[chapter_id])?record[chapter_id][lesson_id]: null
    return (target)?target.length:null
  }

  const getUserLessonRecord = (chapter_id:number, lesson_id:number) => {
    let target = null
    if (userLessonRecord && userLessonRecord.length) {
      userLessonRecord.forEach((item:any)=> {
        if(item.chapter_id == chapter_id && item.lesson_id == lesson_id) {
          target = item
        }
      })
    }
    return target
  }

  const getLessonScore = (chapter_id:number, lesson_id:number) => {
    const record = getUserLessonRecord(chapter_id, lesson_id)
    const lessonMaxScore = getLessonMaxScore(chapter_id, lesson_id)
    let lessonUserScore = null
    if (record && lessonMaxScore) {
      lessonUserScore = record.score
      if(lessonUserScore > lessonMaxScore) {
        lessonUserScore = lessonMaxScore
      }
    }
 
    return (lessonUserScore)?(lessonUserScore + " / " + lessonMaxScore):null
  }

  const getLessonStar = (chapter_id:number, lesson_id:number, lesson:Lesson) => {
    const record = getUserLessonRecord(chapter_id, lesson_id)
    const lessonMaxScore = getLessonMaxScore(chapter_id, lesson_id)
    const stars = (record && lessonMaxScore)?printLessonStar(record.score, lessonMaxScore):null
    return (record) ? stars:null
  }

  const getDocumentImage = (chapterIndex: number) => {
    const x = chapterIndex % 4 + 1
    return `/src/assets/mainpage-img/${x}.jpeg`
  }

  useEffect(() => {
    user_lesson_get(parseInt(userInfo.user_id)).then((response) => {
          const result = response.data
          if(result.status) {
            const resultData = result.data
            setUserLessonRecord(resultData)
            // setIsload(true)
          } else {
            alert(JSON.stringify(result));
          }
      })
  }, []);

  return (
    <div className="lesson-map-container">
      {chapters.map((chapter, chapterIndex) => (
        <div key={chapterIndex} className="chapter-container animate__animated animate__fadeIn">
          <h3 className="chapter-title"><FaBook style={{color:"green", fontSize: "1.2em"}}/> {chapter.title}</h3>
          <div className="lessons-wrapper">
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
                    <div className="lesson-score">{getLessonScore(chapter.ref_id, lesson.ref_id)}</div>
                    <div className="lesson-status">{getLessonStar(chapter.ref_id, lesson.ref_id, lesson)}</div>
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
            <div className="chapter-image">
              <img src={getDocumentImage(chapterIndex)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonMap;
