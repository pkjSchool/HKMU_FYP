import { useEffect, useRef, useState } from 'react';

import LessonMap from '../components/LessonMap';
import TaskProgress from '../components/TaskProgress';
import PianoCharacter, {PianoCharacterRef} from '../components/Character/PianoCharacter.tsx';

import axios from 'axios';

import { api_piano_transcribe } from '../api_request/request.tsx';

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

  useEffect(() => {
    pianoCharacterRef.current?.setMessageHandler(`Hello! Welcome back!`);
    pianoCharacterRef.current?.showCharacterHandler();
    pianoCharacterRef.current?.changePositionHandler({ right: "50px", bottom: "0px" });
  }, []);


  const testAPI = async () => {
    // Fetch the file from the URL
    const response = await fetch("http://localhost:5173/test.wav");
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Convert the response to a Blob
    const blob = await response.blob();

    var formData = new FormData();
    formData.append("audio", blob, "test.wav");

    api_piano_transcribe(formData).then((response) => {
      console.log(response);
    });
  }

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
