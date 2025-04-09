import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

interface JoyrideWrapperProps {
  steps: Step[];
  tourName: string;  // 用於localStorage的唯一標識
  children: React.ReactNode;
}

const JoyrideWrapper: React.FC<JoyrideWrapperProps> = ({ steps, tourName, children }) => {
  const [runTour, setRunTour] = useState(false);

  // Joyride callback
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      console.log(`${tourName} tour finished or skipped`);
      setRunTour(false);
      localStorage.setItem(`hasSeen${tourName}Tour`, 'true');
    }
  };

  // Check if user has seen this tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`hasSeen${tourName}Tour`);
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [tourName]);



  return (
    <>
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
      
      
      {children}
    </>
  );
};

export default JoyrideWrapper;