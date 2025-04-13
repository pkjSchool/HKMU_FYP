import { FC, useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";

import { user_lesson_get } from "../api_request/request";
import { getLoginedUser } from "../access_control/user";

import { calcLessonStarNumber, printLessonStar } from "../util/lessonStar";

import { useTranslation } from "react-i18next";

import { FaBook } from "react-icons/fa";
import { IoStar, IoStarOutline } from "react-icons/io5";

import { questionsCh1_1 } from "../pages/lesson_component/ch1-1";
import { questionsCh1_2 } from "../pages/lesson_component/ch1-2";
import { questionsCh1_3 } from "../pages/lesson_component/ch1-3";
import { questionsCh1_4 } from "../pages/lesson_component/ch1-4";
import { questionsCh1_5 } from "../pages/lesson_component/ch2-1";
import { questionsCh1_6 } from "../pages/lesson_component/ch2-2";

interface Lesson {
  id: string;
  ref_id: number;
  completed?: boolean;
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
  const { t } = useTranslation();

  const userInfo = getLoginedUser();
  const [userLessonRecord, setUserLessonRecord] = useState([]);
  const [firstEmptyIdx, setFirstEmptyIdx] = useState<[number, number] | null>(null);

  const getConnectorDirectionClass = (idx:number) => {
    return (idx%2==0)?"connector-left":"connector-right"
  }

  const getLessonMaxScore = (chapter_id:number, lesson_id:number) => {
    const record: { [key: number]: { [key: number]: any[] } } = {
      1: { 1: questionsCh1_1, 2: questionsCh1_2, 3: questionsCh1_3, 4: questionsCh1_4},
      2: { 1: questionsCh1_5, 2: questionsCh1_6}
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

  const getLessonStar = (chapter_id:number, lesson_id:number) => {
    const record = getUserLessonRecord(chapter_id, lesson_id)
    const lessonMaxScore = getLessonMaxScore(chapter_id, lesson_id)
    // const stars = (record && lessonMaxScore)?printLessonStar(record.score, lessonMaxScore):null
    return (record) ? getResultStar(record.score, lessonMaxScore):null
  }

  const getLessonCompleted = (chapter_id:number, lesson_id:number) => {
    const record = getUserLessonRecord(chapter_id, lesson_id)
    return (record) ? true:false
  }

  const getDocumentImage = (chapterIndex: number) => {
    const x = chapterIndex % 4 + 1
    return `/src/assets/mainpage-img/${x}.jpeg`
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

  const findFirstEmptyIdx = () => {
    for(let chapter of chapters) {
      for(let lesson of chapter.lessons) {
        if(getLessonCompleted(chapter.ref_id, lesson.ref_id) == false){
          console.log([chapter.ref_id, lesson.ref_id])
          setFirstEmptyIdx([chapter.ref_id, lesson.ref_id])
          return null
        }
      }
    }
  }

  useEffect(() => {
    if(userLessonRecord.length > 0){
      findFirstEmptyIdx()
    }
  }, [userLessonRecord]);

  useEffect(() => {
    user_lesson_get(parseInt(userInfo.user_id)).then((response) => {
          const result = response.data
          if(result.status) {
            const resultData = result.data
            setUserLessonRecord(resultData)
          } else {
            alert(JSON.stringify(result));
          }
      })
  }, []);

  return (
    <div className="lesson-map-container">
      {chapters.map((chapter, chapterIndex) => (
        <div key={chapterIndex} className="chapter-container animate__animated animate__fadeIn">
          <h3 className="chapter-title"><FaBook style={{color:"green", fontSize: "1.2em"}}/> {t(chapter.title)}</h3>
          <div className="lessons-wrapper">
            <div className="lessons-container">
              {chapter.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="lesson-item">
                  <div className="lesson-node-wrapper">
                    {(firstEmptyIdx && firstEmptyIdx[0] == chapter.ref_id && firstEmptyIdx[1] == lesson.ref_id)?(
                      <div className="lesson-node-banner animate__animated animate__tada animate__slower" style={{animationIterationCount: "infinite"}}>{t("here")}</div>
                    ):null}
                    <NavLink 
                      to={`/lesson/${lesson.id}`}  
                      className={({ isActive }) =>  
                        `lesson-node ${getLessonCompleted(chapter.ref_id, lesson.ref_id) ? 'completed' : ''} ${isActive ? 'active' : ''}`
                      }
                      onClick={() => lesson.onClick && lesson.onClick()}  
                    >
                      {lessonIndex + 1} 
                    </NavLink>
                    <div className="lesson-score">{getLessonScore(chapter.ref_id, lesson.ref_id)}</div>
                    <div className="lesson-status" style={starWrapper}>{getLessonStar(chapter.ref_id, lesson.ref_id)}</div>
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
              <img src={getDocumentImage(chapterIndex)} className='animate__animated animate__pulse animate__slower' style={{animationIterationCount: "infinite", animationDelay: `${chapterIndex*0.5}s`}} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const starOrder1 = { animationDelay: "0.0s" }

const starOrder2 = { animationDelay: "0.0s" }

const starOrder3 = { animationDelay: "0.0s" }

const starWrapper:object = { display:"flex", justifyContent:"center", alignItems:"baseline" }

const starSmall = {
  fontSize:"20px",
  color: "var(--bs-warning)"
}

const starBig = {
  fontSize:"30px",
  color: "var(--bs-warning)"  
}

const starAnime = "animate__animated animate__zoomIn animate__faster"

export default LessonMap;
