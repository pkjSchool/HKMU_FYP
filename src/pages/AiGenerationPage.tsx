
import { act, useState } from 'react';

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

  return (
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
  );
}

export default AiGenerationPage;
                                                 