import { useCallback, useEffect, useRef, useState } from 'react';

import LessonMap from '../components/LessonMap';
import TaskProgress from '../components/TaskProgress';
import PianoCharacter, {PianoCharacterRef} from '../components/Character/PianoCharacter.tsx';

import axios from 'axios';

import { api_piano_transcribe, user_info_get, user_lesson_get } from '../api_request/request.tsx';
import { getStorageUser } from '../access_control/user.tsx';

// import { showCharacter, hideCharater, setMessage, changePosition } from '../store/pianoCharacherSlice';
// import { AppDispatch, RootState } from '../store/globalConfig';

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

  const updateWeloomeMessage = useCallback(async () => {
    console.log("updateWeloomeMessage")
    const user = getStorageUser();
    var message = 'Hello! Welcome back!';
    if (user) {
      const res = await user_lesson_get(parseInt(user));
      if (res.data.status) {
        const latestLesson = res.data.data.reduce((latest: Date, lesson: any) => {
          const currentDate = new Date(lesson.datetime);
          return currentDate > latest ? currentDate : latest;
        }, new Date(0)); // Initialize with earliest possible date

        const today = new Date();
        const isToday = latestLesson.toDateString() === today.toDateString();
        if (isToday) {
          message = `Hello! Welcome back!`;
        } else {
          message = `Hello! You haven't completed any lessons today. Let's get started!`;
        }
        pianoCharacterRef.current?.setMessageHandler(message);
  
      }
    }
  }, []);

  useEffect(() => {
    const user = getStorageUser();
    var message = `Hello! Welcome back!`;
    if (user) {
      const res = user_info_get(parseInt(user))
      res.then((response) => {
        const name = response.data.data.name;
        if (name) {
          message = `Hello, ${name}! Welcome back!`;
              
          pianoCharacterRef.current?.setMessageHandler(message);
        }
      })

      pianoCharacterRef.current?.showCharacterHandler();
      pianoCharacterRef.current?.changePositionHandler({ right: "50px", bottom: "0px" });

    }
  }, []);

  useEffect(() => {

    const inervalId = setInterval(updateWeloomeMessage, 1000 * 60 * 5); // 5 minutes

    return () => clearInterval(inervalId);
  }, [updateWeloomeMessage]);

  return (
    <div className="lesson-index-container">
        <button onClick={() => pianoCharacterRef.current?.showCharacterHandler()}>Show Character</button>
        <button onClick={() => pianoCharacterRef.current?.hideCharacterHandler()}>Hide Character</button>
        <button onClick={() => pianoCharacterRef.current?.setMessageHandler(`Hello, ${Math.random().toFixed(3)}! Welcome back!`)}>Set Message</button>
        <button onClick={() => pianoCharacterRef.current?.changePositionHandler({ right: Math.floor(Math.random() * (100 - 1) + 1), bottom: Math.floor(Math.random() * (100 - 1) + 1) })}>Change Position</button>
        <input type="file" accept=".wav" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            var formData = new FormData();
            formData.append("audio", file);
            api_piano_transcribe(formData).then((response) => {
              console.log(response);
            });
          }
        }} />
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
  );
}

export default App;
