import { useState } from 'react';
import MIDIController from './components/MidiController.js';
import TopNavBar from './components/PianoPageTopNavBar.js';
import PianoRender from './components/PianoRender.js';

function App() {
  const [activeNotes, setActiveNotes] = useState<number[]>([]);

  const onNoteOn = (note: number) => {
    setActiveNotes((prev) => [...prev, note]);
  };

  const onNoteOff = (note: number) => {
    setActiveNotes((prev) => prev.filter((n) => n !== note));
  };

  return (
    <div style={{ background: '#282c34', height: '100vh', width: '100vw' }}>

      <MIDIController onNoteOn={onNoteOn} onNoteOff={onNoteOff} />
      <TopNavBar />
      <PianoRender
        activeNote={activeNotes}
      />
    </div>
  );
}

export default App;
