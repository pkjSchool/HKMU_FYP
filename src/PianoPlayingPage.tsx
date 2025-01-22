import { useState, useEffect, useRef } from 'react';
import MIDIController from './components/MidiController.js';
import TopNavBar from './components/PianoPageTopNavBar.js';
import PianoRender from './components/PianoRender.js';
import MusicNotePlayerRender from './components/MusicNotePlayerRender';
import PianoPlayingResult from './components/PianoPlayingResult';
import { getPlayer, getPlayerState, resetNoteMeasurement } from "./components/MusicNotePlayer/player/Player.js"

const music = "data:audio/midi;base64,TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAIYAwQ0AkUd/g2CRRX8AgUcAg2CBRQAAkUN/g2CRQX8AgUMAg2CBQQAAkUB/g2CRPn8AgUAAg2CBPgAAkTx/g2CRO38AgTwAg2CBOwAAkTl/g2CRN38AgTkAg2CBNwAAkTV/g2CRNH8AgTUAg2CBNAAAkTJ/g2CBMgAAkTB/g2CBMADDQP8vAA=="


function App() {
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isShowResult, setIsShowResult] = useState(false);
  const [playResult, setPlayResult] = useState({});

  const startTime = useRef(0);
  const endTime = useRef(0);

  const notePlayerRef = useRef();
  const MIDIControllerRef = useRef();

  const onNoteOn = (note: number) => {
    const noteArrIdx = activeNotes.indexOf(note)
    if(noteArrIdx < 0){
      setActiveNotes((prev) => [...prev, note]);

      MIDIControllerRef.current.playNote(note, 50)
      notePlayerRef.current.onNotePress(note)
    }
  };

  const onNoteOff = (note: number) => {
    const noteArrIdx = activeNotes.indexOf(note)
    if(noteArrIdx >= 0){
      // setActiveNotes((prev) => prev.filter((n) => n !== note));
      setActiveNotes((prev) => prev.splice(noteArrIdx, 0));
      
      MIDIControllerRef.current.stopNote(note)
      notePlayerRef.current.onNoteRelease(note)
    }
  };

  const handlePlay = () => { notePlayerRef.current.play() }
  const handlePause = () => { notePlayerRef.current.pause() }
  const handleStop = () => { notePlayerRef.current.stop() }
  const handleMenuCollapsed = (isCollapsed:boolean) => { notePlayerRef.current.changeMenuHeight(isCollapsed?0:130) }
  // background: '#282c34', 

  const changeStartTime = () => {
    console.log("changeStartTime")
    startTime.current = Date.now()
  }

  const changeEndTime = () => {
    console.log("changeEndTime")
    endTime.current = Date.now()
  }

  const againCallback = () => {
    handleReset()
  }

  const handleInitial = () => {
    changeStartTime()
  }

  const handleReset = () => {
    resetNoteMeasurement()
    changeStartTime()
    setIsFinished(false)
    setIsShowResult(false)
    handleStop()
  }

  const handleFinish = () => {
    setIsFinished(true);
    changeEndTime()
    renderResult();
    setTimeout(() => { 

      setIsShowResult(true)
      setTimeout(() => { setIsShowResult(true) }, 800);

    }, 100);
  }

  const renderResult = () => {
    const playerStatus = getPlayerState()

    let totalNote = 0
    let entered = 0
    for(let tracksIdx in playerStatus.song.activeTracks){
      for(let notesIdx in playerStatus.song.activeTracks[tracksIdx].notes){
        totalNote++;
        if(playerStatus.song.activeTracks[tracksIdx].notes[notesIdx].isEntered){ entered++; }
      }
    }

    let accuracy = (entered / totalNote).toFixed(2);

    const result = {
      score: entered*100,
      name: playerStatus.song.name,
      musicTime: playerStatus.end/1000,
      playTime: ((endTime.current - startTime.current)/1000).toFixed(2),
      accuracy: accuracy,
    }

    console.log(playerStatus)
    console.log(result)

    setPlayResult(result)
  }

  useEffect(()=> {
    handleInitial()

    getPlayer().addFinishListener(()=>{
      handleFinish()
    })

    return () => {
      getPlayer().clearFinishListener()
    }

  }, [])

  let resultComp = null;

  if (isShowResult) {
    resultComp = <PianoPlayingResult result={playResult} againCallback={againCallback} />;
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
