import { useCallback, useEffect, useRef, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

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
  const [runTour, setRunTour] = useState(false);

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

  // Joyride callback
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    console.log(data)
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      console.log('Tour finished or skipped');
      setRunTour(false);
      localStorage.setItem('hasSeenHomeTour', 'true');
    }
  };

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

    // Check and start tour
    const hasSeenTour = localStorage.getItem('hasSeenHomeTour');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Welcome message update interval
  useEffect(() => {
    const intervalId = setInterval(updateWeloomeMessage, 1000 * 10); // 10 secs 
    return () => clearInterval(intervalId);
  }, [updateWeloomeMessage]);

  const resetTour = () => {
    localStorage.removeItem('hasSeenHomeTour');
    setRunTour(false);
    setTimeout(() => setRunTour(true), 50);
  };

  return (
    <div className="lesson-index-container">
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        disableOverlayClose={true}
        spotlightClicks={false}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            arrowColor: '#fff',
            backgroundColor: '#333',
            primaryColor: '#5cb7b7',
            textColor: '#fff',
            width: 300,
            zIndex: 1000,
          },
          tooltip: {
            fontSize: '14px',
          },
          buttonNext: {
            backgroundColor: '#5cb7b7',
          },
          buttonBack: {
            color: '#5cb7b7',
          },
          spotlight: {
            backgroundColor: 'transparent',
          }
        }}
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'Finish',
          next: 'Next',
          skip: 'Skip'
        }}
      />
      
      <button 
        onClick={resetTour} 
        className="tour-button"
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px',
          padding: '8px 16px',
          backgroundColor: '#5cb7b7',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 999
        }}
      >
        Show Website Tour
      </button>

      {/* <button onClick={() => pianoCharacterRef.current?.showCharacterHandler()}>Show Character</button>
      <button onClick={() => pianoCharacterRef.current?.hideCharacterHandler()}>Hide Character</button>
      <button onClick={() => pianoCharacterRef.current?.setMessageHandler(`Hello, ${Math.random().toFixed(3)}! Welcome back!`)}>Set Message</button>
      <button onClick={() => pianoCharacterRef.current?.changePositionHandler({ 
        right: `${Math.floor(Math.random() * (100 - 1) + 1)}px`, 
        bottom: `${Math.floor(Math.random() * (100 - 1) + 1)}px` 
      })}>Change Position</button> */}

      {/* <input type="file" accept=".wav" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          var formData = new FormData();
          formData.append("audio", file);
          api_piano_transcribe(formData).then((response) => {
            console.log(response);
          });
        }
      }} /> */}

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
