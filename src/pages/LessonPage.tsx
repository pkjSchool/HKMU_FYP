import { useCallback, useEffect, useRef, useState } from 'react';
import { Step } from "react-joyride";
import JoyrideWrapper from '../components/JoyrideWrapper';
import LessonMap from '../components/LessonMap';
import TaskProgress from '../components/TaskProgress';
import PianoCharacter, {PianoCharacterRef} from '../components/Character/PianoCharacter.tsx';

import { api_piano_transcribe, user_info_get, user_lesson_get } from '../api_request/request.tsx';
import { getStorageUser } from '../access_control/user.tsx';

export const sampleChapters = [
  {
    ref_id: 1,
    title: "Chapter 1",
    lessons: [
      { id: "ch1-1", ref_id: 1, completed: true, stars: 3 },
      { id: "ch1-2", ref_id: 2, completed: false, stars: 2 },
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
  const handleLessonClick = (lessonId: string) => {
    console.log(`Lesson ${lessonId} clicked`);
  };

  const pianoCharacterRef = useRef<PianoCharacterRef>(null);
  // Joyride steps
  const steps: Step[] = [
    {
      target: "body",
      content: "Welcome to the piano learning platform! Let me guide you through the main features and areas.",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: ".lesson-index-container",
      content: "This is our homepage where you can browse all courses and track your progress.",
      placement: "bottom",
    },
    {
      target: ".lesson-map-container",
      content: "Here you can see all piano course chapters and progress. Click on any course to start learning.",
      placement: "bottom",
    },
    {
      target: ".chapter-container",
      content: "Each chapter contains multiple lessons. Completing them in order provides the best learning experience.",
      placement: "bottom",
    },
    {
      target: ".lesson-node",
      content: "Click on these lesson nodes to access the corresponding learning content. Green indicates completed, gray indicates incomplete.",
      placement: "top",
    },
    {
      target: "div:has(> .progress)",
      content: "This area shows your learning tasks and progress, helping you track your achievements.",
      placement: "bottom",
    },
    {
      target: "input[type='file']",
      content: "You can upload audio files here. The system will analyze and convert them into sheet music to assist your learning and creation.",
      placement: "top",
    },
    {
      target: "button:nth-of-type(1)",
      content: "Click this button to show your learning assistant.",
      placement: "top",
    },
  ];

  // Welcome message update logic
  const updateWeloomeMessage = useCallback(async () => {
    console.log("updateWeloomeMessage")
    const user = getStorageUser();
    var message = 'Hello! Welcome back!';
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
        message = isToday 
          ? `Hello! Welcome back!`
          : `Hello! You haven't completed any lessons today. Let's get started!`;
        
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
          const message = `Hello, ${name}! Welcome back!`;
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
    <JoyrideWrapper steps={steps} tourName="HomeTour">
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
      </div>
    </JoyrideWrapper>
  );
}

export default App;
