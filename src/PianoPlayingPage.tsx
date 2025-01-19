import { useState, useEffect, useRef } from 'react';
import MIDIController from './components/MidiController.js';
import TopNavBar from './components/PianoPageTopNavBar.js';
import PianoRender from './components/PianoRender.js';
import MusicNotePlayerRender from './components/MusicNotePlayerRender';
import PianoPlayingResult from './components/PianoPlayingResult';
import { getPlayer, getPlayerState } from "./components/MusicNotePlayer/player/Player.js"

const music = "data:audio/midi;base64,TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAIYAwQ0AkUd/g2CRRX8AgUcAg2CBRQAAkUN/g2CRQX8AgUMAg2CBQQAAkUB/g2CRPn8AgUAAg2CBPgAAkTx/g2CRO38AgTwAg2CBOwAAkTl/g2CRN38AgTkAg2CBNwAAkTV/g2CRNH8AgTUAg2CBNAAAkTJ/g2CBMgAAkTB/g2CBMADDQP8vAA=="


function App() {
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isShowResult, setIsShowResult] = useState(false);

  const notePlayerRef = useRef();
  const MIDIControllerRef = useRef();

  const onNoteOn = (note: number) => {
    setActiveNotes((prev) => [...prev, note]);
    notePlayerRef.current.onNotePress(note)
    MIDIControllerRef.current.playNote(note, 50)
    notePlayerRef.current.onNotePress(note)
  };

  const onNoteOff = (note: number) => {
    setActiveNotes((prev) => prev.filter((n) => n !== note));
    notePlayerRef.current.onNoteRelease(note)
    MIDIControllerRef.current.stopNote(note)
    notePlayerRef.current.onNoteRelease(note)
  };

  const handlePlay = () => { notePlayerRef.current.play() }
  const handlePause = () => { notePlayerRef.current.pause() }
  const handleStop = () => { notePlayerRef.current.stop() }
  const handleMenuCollapsed = (isCollapsed:boolean) => { notePlayerRef.current.changeMenuHeight(isCollapsed?0:130) }
  // background: '#282c34', 

  const againCallback = () => {
    setIsFinished(false)
    setIsShowResult(false)
    handleStop()
  }

  useEffect(()=> {
    getPlayer().addFinishListener(()=>{
      setIsFinished(true);
      setTimeout(() => { setIsShowResult(true) }, 800);
    })
    return () => {
      getPlayer().clearFinishListener()
    }

  }, [])

  let resultComp = null;

  if (isShowResult) {
    resultComp = <PianoPlayingResult againCallback={againCallback} />;
  }

  return (
    <div style={{ position: "relative", height: '100%', width: '100%', overflow: 'hidden' }}>
      {resultComp}
      <MIDIController ref={MIDIControllerRef} onNoteOn={onNoteOn} onNoteOff={onNoteOff} />
      <TopNavBar playCallback={handlePlay} pausingCallback={handlePause} stopCallback={handleStop} menuCollapsedCallback={handleMenuCollapsed} />
      <MusicNotePlayerRender ref={notePlayerRef} music={music} />
      <PianoRender activeNote={activeNotes} onNoteOn={onNoteOn} onNoteOff={onNoteOff} />
    </div>
  );
}

export default App;
