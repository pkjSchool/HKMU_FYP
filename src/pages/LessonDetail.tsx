import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import Ch1_1 from "./lesson_component/ch1-1";
import Ch1_2 from "./lesson_component/ch1-2";
import Ch1_3 from "./lesson_component/ch1-3";
import Ch1_4 from "./lesson_component/ch1-4";
import Ch2_1 from "./lesson_component/ch2-1";
import Ch2_2 from "./lesson_component/ch2-2";
type LessonComponent = () => JSX.Element;

interface LessonMap {
  [key: string]: LessonComponent;
}

const lessonPageMap: LessonMap = {
  "ch1-1": Ch1_1,
  "ch1-2": Ch1_2,
  "ch1-3": Ch1_3,
  "ch1-4": Ch1_4, 
  "ch2-1": Ch2_1,  
  "ch2-2": Ch2_2,  
};

const LessonDetail = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [runTour, setRunTour] = useState(false);

  const LessonComponent = lessonPageMap[lessonId || ""];

  // Joyride steps for lesson detail page
  const steps: Step[] = [
    {
      target: "body",
      content: `Welcome to the "${lessonId}" lesson! Let me guide you through this lesson.`,
      placement: "center",
      disableBeacon: true,
    },
    {
      target: ".lesson-content",
      content: "This is the main lesson content. Read through it carefully to understand the concepts.",
      placement: "bottom",
    },
    {
      target: ".video-container",
      content: "Watch the lesson video to learn key concepts and techniques.",
      placement: "top",
    },
    {
      target: ".memo-cards",
      content: "Review these flashcards to reinforce what you've learned before taking the quiz.",
      placement: "bottom",
    },
    {
      target: ".quiz-container",
      content: "Test your knowledge with this interactive quiz after watching the lesson.",
      placement: "top",
    },
  ];

  // Joyride callback
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      console.log('Lesson tour finished or skipped');
      setRunTour(false);
      localStorage.setItem(`hasSeenTour_${lessonId}`, 'true');
    }
  };

  // Check if user has seen this specific lesson's tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`hasSeenTour_${lessonId}`);
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lessonId]);

  const resetTour = () => {
    localStorage.removeItem(`hasSeenTour_${lessonId}`);
    setRunTour(false);
    setTimeout(() => setRunTour(true), 50);
  };

  if (!LessonComponent) {
    return <div>Level not found</div>;
  }

  return (
    <div className="lesson-detail-container">
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
        Show Lesson Tour
      </button>
      
      <LessonComponent />
    </div>
  );
};
export default LessonDetail;
