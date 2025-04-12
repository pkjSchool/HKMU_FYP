import { useCallback, useEffect, useRef, useState } from 'react';
import { Step } from "react-joyride";
import JoyrideWrapper, { JoyrideWrapperRef } from '../components/JoyrideWrapper';
import LessonMap from '../components/LessonMap';
import TaskProgress from '../components/TaskProgress';
import PianoCharacter, {PianoCharacterRef} from '../components/Character/PianoCharacter.tsx';

import { useTranslation } from 'react-i18next';

import { CiCircleQuestion } from "react-icons/ci";

import { api_piano_transcribe, user_info_get, user_lesson_get } from '../api_request/request.tsx';
import { getStorageUser } from '../access_control/user.tsx';

export const sampleChapters = [
  {
    ref_id: 1,
    title: "Chapter 1",
    lessons: [
      { id: "ch1-1", ref_id: 1, completed: false },
      { id: "ch1-2", ref_id: 2, completed: false },
      { id: "ch1-3", ref_id: 3, completed: false },
      { id: "ch1-4", ref_id: 4, completed: false },
    ],
  },
  {
    ref_id: 2,
    title: "Chapter 2",
    lessons: [
      { id: "ch2-1", ref_id: 1, completed: false },
      { id: "ch2-2", ref_id: 2, completed: false },
    ],
  },
  {
    ref_id: 3,
    title: "Chapter 3",
    lessons: [
      { id: "ch3-1", ref_id: 1, completed: false },
      { id: "ch3-2", ref_id: 2, completed: false },
    ],
  },
];

function App() {
  const { t, i18n } = useTranslation();
  const JoyrideRef = useRef<JoyrideWrapperRef>(null);

  const handleLessonClick = (lessonId: string) => {
    console.log(`Lesson ${lessonId} clicked`);
  };

  const pianoCharacterRef = useRef<PianoCharacterRef>(null);
  // Joyride steps
  const steps: Step[] = [
    {
      target: "body",
      content: t("lesson-1"),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: ".lesson-index-container",
      content: t("lesson-2"),
      placement: "bottom",
    },
    {
      target: ".lesson-map-container",
      content: t("lesson-3"),
      placement: "bottom",
    },
    {
      target: ".chapter-container",
      content: t("lesson-4"),
      placement: "bottom",
    },
    {
      target: ".lesson-node",
      content: t("lesson-5"),
      placement: "top",
    },
    {
      target: "div:has(> .progress)",
      content: t("lesson-6"),
      placement: "bottom",
    },
    {
      target: "input[type='file']",
      content: t("lesson-7"),
      placement: "top",
    },
    {
      target: "button:nth-of-type(1)",
      content: t("lesson-8"),
      placement: "top",
    },
  ];

  // Welcome message update logic
  const updateWeloomeMessage = useCallback(async () => {
    console.log("updateWeloomeMessage")
    const user = getStorageUser();
    let message = '';
    if (user) {
      const res = await user_lesson_get(parseInt(user));
      const userRes = await user_info_get(parseInt(user));
      if (res.data.status) {
        const latestLesson = res.data.data.reduce((latest: Date, lesson: any) => {
          const currentDate = new Date(lesson.datetime);
          return currentDate > latest ? currentDate : latest;
        }, new Date(0));

        const today = new Date();
        const isToday = latestLesson.toDateString() === today.toDateString();

        switch(i18n.language) {
          case "zh-HK":
            message = isToday 
              ? `你好！歡迎回來！`
              : `你好！今天還未完成任何課程。讓我們開始學習吧！`;
            break
          default:
            message = isToday 
              ? `Hello! Welcome back!`
              : `Hello! You haven't completed any lessons today. Let's get started!`;
        }
        
        pianoCharacterRef.current?.setMessageHandler(message);
      }
    }
  }, []);

  // Initial setup effect
  useEffect(() => {
    const user = getStorageUser();
    if (user) {
      const res = user_info_get(parseInt(user))
      res.then((response) => {
        const name = response.data.data.name;
        if (name) {
          let message = "";
          switch(i18n.language) {
            case "zh-HK":
              message = `你好！${name}! 歡迎回來！`;
              break
            default:
              message = `Hello, ${name}! Welcome back!`;
          }
          pianoCharacterRef.current?.setMessageHandler(message);
        }
      })

      pianoCharacterRef.current?.showCharacterHandler();
      pianoCharacterRef.current?.changePositionHandler({ right: "50px", bottom: "0px" });
    }
  }, []);

  // Welcome message update interval
  useEffect(() => {
    const intervalId = setInterval(updateWeloomeMessage, 1000 * 10); // 10 secs 
    return () => clearInterval(intervalId);
  }, [updateWeloomeMessage]);

  return (
    <JoyrideWrapper steps={steps} tourName="HomeTour" ref={JoyrideRef}>
      <div className="lesson-index-container">
        <LessonMap 
          chapters={sampleChapters.map(chapter => ({
            ...chapter,
            lessons: chapter.lessons.map(lesson => ({
              ...lesson,
              onClick: () => handleLessonClick(lesson.id)
            }))
          }))}
        />
        <TaskProgress />
        <PianoCharacter ref={pianoCharacterRef}/> 
        <button className="tourBtn" onClick={()=>{JoyrideRef.current.setRunTour(true)}}><CiCircleQuestion/></button>
      </div>
    </JoyrideWrapper>
  );
}

export default App;
