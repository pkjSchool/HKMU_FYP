import { useState, useRef } from 'react';
import MIDIController from './components/MidiController.js';
import TopNavBar from './components/PianoPageTopNavBar.js';
import PianoRender from './components/PianoRender.js';
import MusicNotePlayerRender from './components/MusicNotePlayerRender';

const music = "data:audio/midi;base64,TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAIYAwQ0AkUd/g2CRRX8AgUcAg2CBRQAAkUN/g2CRQX8AgUMAg2CBQQAAkUB/g2CRPn8AgUAAg2CBPgAAkTx/g2CRO38AgTwAg2CBOwAAkTl/g2CRN38AgTkAg2CBNwAAkTV/g2CRNH8AgTUAg2CBNAAAkTJ/g2CBMgAAkTB/g2CBMADDQP8vAA=="


function App() {
  const [activeNotes, setActiveNotes] = useState<number[]>([]);

  const childRef = useRef();

  const onNoteOn = (note: number) => {
    setActiveNotes((prev) => [...prev, note]);
  };

  const onNoteOff = (note: number) => {
    setActiveNotes((prev) => prev.filter((n) => n !== note));
  };

  const handlePlay = () => { childRef.current.play() }
  const handlePause = () => { childRef.current.pause() }
  const handleStop = () => { childRef.current.stop() }
  const handleMenuCollapsed = (isCollapsed:boolean) => { childRef.current.changeMenuHeight(isCollapsed?0:130) }
  // background: '#282c34', 
  return (
    <div style={{ position: "relative", height: '100%', width: '100%', overflow: 'hidden' }}>

      <MIDIController onNoteOn={onNoteOn} onNoteOff={onNoteOff} />
      <TopNavBar playCallback={handlePlay} pausingCallback={handlePause} stopCallback={handleStop} menuCollapsedCallback={handleMenuCollapsed} />
      <MusicNotePlayerRender ref={childRef} music={music} />
      <PianoRender activeNote={activeNotes} />
    </div>
  );
}

export default App;
