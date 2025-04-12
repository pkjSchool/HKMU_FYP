import { act, useState } from 'react';
import { Step } from "react-joyride";
import JoyrideWrapper from '../components/JoyrideWrapper';

import AddChordTab from '../components/AIGenerationPage/AddChordTab';
import FormatConvertionTab from '../components/AIGenerationPage/FormatConvertionTab';

import { useTranslation } from 'react-i18next';

import '../css/AiGenerationPage.css';

const AiGenerationPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: t('Add Chord'),
      component: <AddChordTab />
    },
    {
      name: t('Wav to Midi Conversion'),
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
      content: t("aiOverview-1"),
      placement: "bottom"
    },
    {
      target: ".tab-navbar td:nth-child(1)", 
      content: t("aiOverview-2"),
      placement: "bottom"
    },
    {
      target: ".tab-navbar td:nth-child(2)", 
      content: t("aiOverview-3"),
      placement: "bottom"
    }
  ];

  const addChordSteps: Step[] = [
    {
      target: ".tab-content h1", 
      content: t("aiChord-1"),
      placement: "bottom"
    },
    {
      target: "input[type='file']", 
      content: t("aiChord-2"),
      placement: "top"
    },
    {
      target: ".form-check-input", 
      content: t("aiChord-3"),
      placement: "bottom"
    },
    {
      target: "select[name='key']", 
      content: t("aiChord-4"),
      placement: "bottom"
    },
    {
      target: "select[name='mode']", 
      content: t("aiChord-5"),
      placement: "bottom"
    },
    {
      target: "input[name='progression']", 
      content: t("aiChord-6"),
      placement: "top"
    },
    {
      target: "input[name='time_sig']", 
      content: t("aiChord-7"),
      placement: "top"
    },
    {
      target: "input[name='tempo']", 
      content: t("aiChord-8"),
      placement: "top"
    },
    {
      target: "button.generate-midi", 
      content: t("aiChord-9"),
      placement: "left"
    }
  ];

  const formatConversionSteps: Step[] = [
    {
      target: "form .form-label", 
      content: t("aiConvert-1"),
      placement: "top"
    },
    {
      target: "#audioFile", 
      content: t("aiConvert-2"),
      placement: "top"
    },
    {
      target: "button[type='submit']", 
      content: t("aiConvert-3"),
      placement: "left"
    },
    {
      target: ".alert-danger", 
      content: t("aiConvert-4"),
      placement: "top",
      disableBeacon: true
    },
    {
      target: "a.btn-success", 
      content: t("aiConvert-5"),
      placement: "bottom",
      disableBeacon: true
    },
    {
      target: "a.btn-secondary", 
      content: t("aiConvert-6"),
      placement: "bottom",
      disableBeacon: true
    },
    {
      target: ".osmd-canvas-container", 
      content: t("aiConvert-7"),
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
          <table>
            <tbody>
              <tr>
                {tabs.map((tab, index) => {
                  return <td key={index} onClick={() => handleTabClick(index)} 
                  style={activeTab === index ? {backgroundColor: "#4CAF50"} : {}}>
                    {tab.name}</td>}
                )}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="tab-content">
          {tabs[activeTab].component}
        </div>
      </div>
    </JoyrideWrapper>
  );
}

export default AiGenerationPage;
