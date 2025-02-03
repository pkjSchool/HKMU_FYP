import { useState, useEffect, useRef } from 'react';
import MIDIController from './components/MidiController.js';
import TopNavBar from './components/PianoPageTopNavBar.js';
import PianoRender from './components/PianoRender.js';
import MusicNotePlayerRender from './components/MusicNotePlayerRender';
import PianoPlayingResult from './components/PianoPlayingResult';
import { formatTime } from "./util/utils";

const MUSIC = "data:audio/midi;base64,TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAIYAwQ0AkUd/g2CRRX8AgUcAg2CBRQAAkUN/g2CRQX8AgUMAg2CBQQAAkUB/g2CRPn8AgUAAg2CBPgAAkTx/g2CRO38AgTwAg2CBOwAAkTl/g2CRN38AgTkAg2CBNwAAkTV/g2CRNH8AgTUAg2CBNAAAkTJ/g2CBMgAAkTB/g2CBMADDQP8vAA=="
const ACCURATE_OFFSET = 150

function App() {
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [isShowResult, setIsShowResult] = useState(false);
  const [playResult, setPlayResult] = useState({});

  const startTime = useRef(0);
  const endTime = useRef(0);
  const playingTime = useRef(0);
  const isFinished = useRef(false);

  const notePlayerRef = useRef<MusicNotePlayerRender | null>(null);
  const MIDIControllerRef = useRef<{ playNote: (note: number, velocity: number) => void; stopNote: (note: number) => void } | null>(null);
  const topNavBarRef = useRef<{ handleUpdatePlayingTimestemp: (t: number) => void; onPlayerTimeUpdated: (time:number, end:number, bpm:number) => void } | null>(null);

  const onNoteOn = (note: number) => {
    const noteArrIdx = activeNotes.indexOf(note)
    if(noteArrIdx < 0){
      setActiveNotes((prev) => [...prev, note]);

      if (MIDIControllerRef.current) {
        MIDIControllerRef.current.playNote(note, 50);
      }
      if (notePlayerRef.current) {
        notePlayerRef.current.onNotePress(note);
      }
    }
  };

  const onNoteOff = (note: number) => {
    const noteArrIdx = activeNotes.indexOf(note)
    if(noteArrIdx >= 0){
      // setActiveNotes((prev) => prev.filter((n) => n !== note));
      setActiveNotes((prev) => prev.splice(noteArrIdx, 0));

      if (MIDIControllerRef.current) {
        MIDIControllerRef.current.stopNote(note)
      }
      if (notePlayerRef.current) {
        notePlayerRef.current.onNoteRelease(note)
      }
    }
  };

  const releaseAllNotes = () => {
    const noteArr = [...activeNotes]

    for(let note of noteArr) {
      console.log(note)
      onNoteOff(note)
    }
  };

  const handlePlay = () => { if (notePlayerRef.current) notePlayerRef.current.play() }
  const handlePause = () => { if (notePlayerRef.current) notePlayerRef.current.pause() }
  const handleStop = () => { if (notePlayerRef.current) notePlayerRef.current.stop() }
  const handleMenuCollapsed = (isCollapsed:boolean) => { if (notePlayerRef.current) notePlayerRef.current.changeMenuHeight(isCollapsed?0:160) }
  const handleProgressChanged = (progress:number) => { if (notePlayerRef.current) notePlayerRef.current.player.setTime(progress) }

  const onPlayerTimeUpdated = (time:number, end:number, bpm:number) => { if (topNavBarRef.current) topNavBarRef.current.onPlayerTimeUpdated(time, end, bpm) }
  // background: '#282c34', 

  const changeStartTime = () => {
    // console.log("changeStartTime")
    startTime.current = Date.now()
  }

  const changeEndTime = () => {
    // console.log("changeEndTime")
    endTime.current = Date.now()
  }

  const increasePlayingTime = (time:number) => {
    const t = playingTime.current + time
    playingTime.current = t
    if (topNavBarRef.current) topNavBarRef.current.handleUpdatePlayingTimestemp(t)
  }

  const resetPlayingTime = () => {
    playingTime.current = 0
    if (topNavBarRef.current) topNavBarRef.current.handleUpdatePlayingTimestemp(0)
  }

  const getIsFinished = () => {
    return isFinished.current
  }

  const setIsFinished = (xx:boolean) => {
    return isFinished.current = xx
  }

  const againCallback = () => {
    handleReset()
  }

  const handleInitial = () => {
    if(notePlayerRef.current) notePlayerRef.current.player.resetNoteMeasurement()
    changeStartTime()
    resetPlayingTime()
    setIsFinished(false)
    setIsShowResult(false)
    handleStop()
  }

  const handleReset = () => {
    if (notePlayerRef.current) notePlayerRef.current.player.resetNoteMeasurement()
    changeStartTime()
    resetPlayingTime()
    setIsFinished(false)
    setIsShowResult(false)
    handleStop()
  }

  const handleFinish = () => {
    releaseAllNotes()
    setIsFinished(true);
    changeEndTime()
    renderResult();
    setTimeout(() => { setIsShowResult(true) }, 100);
  }

  const renderResult = () => {
    const playerStatus = (notePlayerRef.current) ? notePlayerRef.current.player.getPlayerState() : {}

    let inputOnRange = 0
    let totalNote = 0
    let noteEntered = 0

    for(let track of playerStatus.song.activeTracks){
      for(let note of track.notes){
        totalNote++;
        if(note.isEntered){ noteEntered++; }
        if(note.isInputAccurate){ inputOnRange++; }
      }
    }

    // console.log(new Date(startTime.current), new Date(endTime.current))

    let score = 0
    score += noteEntered*50
    score += inputOnRange*50
    
    const result = {
      score: score,
      name: playerStatus.song.name,
      musicTime: formatTime(playerStatus.end/1000),
      playTime: formatTime(playingTime.current),
      totalNote: totalNote,
      noteEntered: noteEntered,
      inputOnRange: inputOnRange
    }

    console.log(result)

    setPlayResult(result)
  }

  useEffect(()=> {
    const notePlayerRefCtx = notePlayerRef.current

    if(notePlayerRefCtx) {
      notePlayerRefCtx.player.addFinishListener(()=>{ handleFinish() })
      notePlayerRefCtx.player.addTimeUpdatedListener(onPlayerTimeUpdated)
      notePlayerRefCtx.player.addNewSongCallback(()=>{ handleInitial() })
    }

    const updatePlayingTime = setInterval(() => {
      if(!getIsFinished() && notePlayerRefCtx && notePlayerRefCtx.player.isPlaying()) increasePlayingTime(0.1)
    }, 100);

    return () => {
      if(notePlayerRefCtx) {
        notePlayerRefCtx.player.pause()
        notePlayerRefCtx.player.clearFinishListener()
        notePlayerRefCtx.player.clearTimeUpdatedListener()
        notePlayerRefCtx.player.clearNewSongCallback()
      }

      clearInterval(updatePlayingTime)
    }

  }, [])

  let resultComp = null;

  if (isFinished && isShowResult) {
    resultComp = <PianoPlayingResult result={playResult} againCallback={againCallback} />;
  }

  return (
    <div style={{ position: "relative", height: '100%', width: '100%', overflow: 'hidden' }}>
      {resultComp}
      <MIDIController ref={MIDIControllerRef} onNoteOn={onNoteOn} onNoteOff={onNoteOff} />
      <TopNavBar ref={topNavBarRef} playCallback={handlePlay} pausingCallback={handlePause} stopCallback={handleStop} menuCollapsedCallback={handleMenuCollapsed} progressCallback={handleProgressChanged} />
      <MusicNotePlayerRender ref={notePlayerRef} music={MUSIC} />
      <PianoRender activeNote={activeNotes} onNoteOn={onNoteOn} onNoteOff={onNoteOff} />
    </div>
  );
}

export default App;
