import { act, useState } from 'react';
import { Step } from "react-joyride";
import JoyrideWrapper from '../components/JoyrideWrapper';

import AddChordTab from '../components/AIGenerationPage/AddChordTab';
import FormatConvertionTab from '../components/AIGenerationPage/FormatConvertionTab';

import '../css/AiGenerationPage.css';

const AiGenerationPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Add Chord',
      component: <AddChordTab />
    },
    {
      name: 'Wav to Midi Conversion',
      component: <FormatConvertionTab/>
    }
  ]

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  }

  // 共享的步驟（標籤欄）
  const sharedSteps: Step[] = [
    {
      target: ".tab-navbar",
      content: "Here you can switch between different AI generation features.",
      placement: "bottom"
    },
    {
      target: ".tab-navbar td:nth-child(1)", 
      content: "Click here to access the Add Chord feature, which helps you create chord progressions.",
      placement: "bottom"
    },
    {
      target: ".tab-navbar td:nth-child(2)", 
      content: "Click here to access the Wav to Midi Conversion feature, which converts audio files to MIDI format.",
      placement: "bottom"
    }
  ];

  const addChordSteps: Step[] = [
    {
      target: ".tab-content h1", 
      content: "This section allows you to create custom chord progressions.",
      placement: "bottom"
    },
    {
      target: "input[type='file']", 
      content: "You can optionally upload an existing MIDI file as a starting point.",
      placement: "top"
    },
    {
      target: "input[type='radio']", 
      content: "Select from these common chord progression patterns to get started quickly.",
      placement: "bottom"
    },
    {
      target: "select", 
      content: "Choose the key and mode for your chord progression.",
      placement: "bottom"
    },
    {
      target: "input[placeholder='1,2,5,3']", 
      content: "Enter your chord progression using numbers representing scale degrees, separated by commas.",
      placement: "top"
    },
    {
      target: "input[placeholder='4,4']", 
      content: "Enter the time signature for your music (e.g., 4,4 for 4/4 time).",
      placement: "top"
    },
    {
      target: "input[placeholder='90']", 
      content: "Set the tempo in beats per minute (BPM).",
      placement: "top"
    },
    {
      target: "button.generate-midi", 
      content: "Click this button to generate your MIDI file based on the settings you've chosen.",
      placement: "left"
    }
  ];

  const formatConversionSteps: Step[] = [
    {
      target: "form .form-label", 
      content: "This tool converts WAV audio files to MIDI format. Start by uploading your file here.",
      placement: "top"
    },
    {
      target: "#audioFile", 
      content: "Click here to select a WAV audio file from your device. Only WAV format is supported.",
      placement: "top"
    },
    {
      target: "button[type='submit']", 
      content: "After selecting your file, click this button to start the conversion process.",
      placement: "left"
    },
    {
      target: ".alert-danger", 
      content: "If there's an error with your file or the conversion, you'll see a message here.",
      placement: "top",
      disableBeacon: true
    },
    {
      target: "a.btn-success", 
      content: "Once conversion is complete, click here to download your converted MIDI file.",
      placement: "bottom",
      disableBeacon: true
    },
    {
      target: "a.btn-secondary", 
      content: "Click here to open the piano player and immediately play your converted melody.",
      placement: "bottom",
      disableBeacon: true
    },
    {
      target: ".osmd-canvas-container", 
      content: "This shows a sheet music preview of your converted audio. You can see how your music looks in standard notation.",
      placement: "top",
      disableBeacon: true
    }
  ];

  const getCurrentSteps = (): Step[] => {
    const steps = [...sharedSteps];
    
    if (activeTab === 0) {
      steps.push(...addChordSteps);
    } else {
      steps.push(...formatConversionSteps);
    }
    return steps;
  };

  return (
    <JoyrideWrapper steps={getCurrentSteps()} tourName={`AIGeneration${activeTab === 0 ? 'AddChord' : 'FormatConversion'}Tour`}>
      <div className="tab-container" >
        <div className="tab-navbar">
          <tr>
            {tabs.map((tab, index) => {
              return <td key={index} onClick={() => handleTabClick(index)} 
              style={activeTab === index ? {backgroundColor: "#4CAF50"} : {}}>
                {tab.name}</td>}
            )}
          </tr>
        </div>
        <div className="tab-content">
          {tabs[activeTab].component}
        </div>
      </div>
    </JoyrideWrapper>
  );
}

export default AiGenerationPage;
