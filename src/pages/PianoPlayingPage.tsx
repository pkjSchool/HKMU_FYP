import { useState, useEffect, useRef } from "react";
import { Midi } from "tonejs-midi-fix";

import MIDIController, {
  MidiControllerRef,
} from "../components/PianoPlayingPage/MidiController.js";
import TopNavBar, {
  CollapsibleNavBarRef as TopNavBarRef,
} from "../components/PianoPlayingPage/PianoPageTopNavBar.js";
import PianoRender from "../components/PianoPlayingPage/PianoRender.js";
import MusicNotePlayerRender from "../components/PianoPlayingPage/MusicNotePlayerRender.js";
import PianoPlayingResult from "../components/PianoPlayingPage/PianoPlayingResult.js";
import { formatTime } from "../util/utils.js";
import MusicSheetRender from "../components/PianoPlayingPage/RenderMusicSheet.js";
import { MUSIC1, MUSIC2 } from "../data/sample_music.js";
import {
  Player,
  getPlayer,
} from "../components/MusicNotePlayer/player/Player.js";
import MusicSheetRender2, { RenderMusicSheetRef } from "../components/PianoPlayingPage/RenderMusicSheet2.js";
import axios from "axios";

const ACCURATE_OFFSET = 150;

function App() {
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [isShowResult, setIsShowResult] = useState(false);
  const [playResult, setPlayResult] = useState({});

  const startTime = useRef(0);
  const endTime = useRef(0);
  const playingTime = useRef(0);
  const isFinished = useRef(false);

  const notePlayerRef = useRef<MusicNotePlayerRender | null>(null);
  const MIDIControllerRef = useRef<MidiControllerRef>(null);
  const topNavBarRef = useRef<TopNavBarRef>(null);
  const musicSheetRenderRef = useRef<RenderMusicSheetRef>(null);
  

  const [volume, setVolume] = useState<number>(1);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [musicXML, setMusicXML] = useState<string | null>(null);
  const [midiData, setMidiData] = useState<Midi | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isMidi2XML, setIsMidi2XML] = useState<boolean>(false);
  const [isWav2Midi, setIsWav2Midi] = useState<boolean>(false);
  const [isFileLoaded, setIsFileLoaded] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  /**
    add the note to the active notes array 
  */
  const onNoteOn = (note: number) => {
    const noteArrIdx = activeNotes.indexOf(note);
    if (noteArrIdx < 0) {
      setActiveNotes((prev) => [...prev, note]);

      if (MIDIControllerRef.current) {
        MIDIControllerRef.current.playNote(note, 50);
      }
      if (notePlayerRef.current) {
        notePlayerRef.current.onNotePress(note);
      }
    }
  };

  /**
    Remove the note from the active notes array 
  */
  const onNoteOff = (note: number) => {
    const noteArrIdx = activeNotes.indexOf(note);
    setActiveNotes((prev) => prev.filter((n) => n !== note));

    if (noteArrIdx >= 0) {
      // setActiveNotes((prev) => prev.filter((n) => n !== note));
      setActiveNotes((prev) => prev.splice(noteArrIdx, 1));

      if (MIDIControllerRef.current) {
        MIDIControllerRef.current.stopNote(note);
      }
      if (notePlayerRef.current) {
        notePlayerRef.current.onNoteRelease(note);
      }
    }
  };

  const releaseAllNotes = () => {
    const noteArr = [...activeNotes];

    for (let note of noteArr) {
      console.log(note);
      onNoteOff(note);
    }
  };

  const handlePlay = () => {
    if (notePlayerRef.current) notePlayerRef.current.play();
  };
  const handlePause = () => {
    if (notePlayerRef.current) notePlayerRef.current.pause();
  };
  const handleStop = () => {
    if (notePlayerRef.current) notePlayerRef.current.stop();
  };
  const handleMenuCollapsed = (isCollapsed: boolean) => {
    if (notePlayerRef.current) {
      notePlayerRef.current.changeMenuHeight(isCollapsed ? 0 : 160);
    }
  };
  const handleProgressChanged = (progress: number) => {
    if (notePlayerRef.current) getPlayer().setTime(progress);
  };

  const onPlayerTimeUpdated = (time: number, end: number, bpm: number) => {
    if (topNavBarRef.current)
      topNavBarRef.current.onPlayerTimeUpdated(time, end, bpm);
  };
  // background: '#282c34',

  const changeStartTime = () => {
    // console.log("changeStartTime")
    startTime.current = Date.now();
  };

  const changeEndTime = () => {
    // console.log("changeEndTime")
    endTime.current = Date.now();
  };

  const increasePlayingTime = (time: number) => {
    const t = playingTime.current + time;
    playingTime.current = t;
    if (topNavBarRef.current)
      topNavBarRef.current.handleUpdatePlayingTimestemp(t);
  };

  const resetPlayingTime = () => {
    playingTime.current = 0;
    if (topNavBarRef.current)
      topNavBarRef.current.handleUpdatePlayingTimestemp(0);
  };

  const getIsFinished = () => {
    return isFinished.current;
  };

  const setIsFinished = (xx: boolean) => {
    return (isFinished.current = xx);
  };

  const againCallback = () => {
    handleReset();
  };

  const handleInitial = () => {
    if (notePlayerRef.current) getPlayer().resetNoteMeasurement();
    changeStartTime();
    resetPlayingTime();
    setIsFinished(false);
    setIsShowResult(false);
    handleStop();
  };

  const handleReset = () => {
    if (notePlayerRef.current) getPlayer().resetNoteMeasurement();
    changeStartTime();
    resetPlayingTime();
    setIsFinished(false);
    setIsShowResult(false);
    handleStop();
  };

  const handleFinish = () => {
    releaseAllNotes();
    setIsFinished(true);
    changeEndTime();
    renderResult();
    setTimeout(() => {
      setIsShowResult(true);
    }, 100);
  };

  const renderResult = () => {
    const playerStatus = notePlayerRef.current
      ? getPlayer().getPlayerState()
      : {};

    let inputOnRange = 0;
    let totalNote = 0;
    let noteEntered = 0;

    for (let track of playerStatus.song.activeTracks) {
      for (let note of track.notes) {
        totalNote++;
        if (note.isEntered) {
          noteEntered++;
        }
        if (note.isInputAccurate) {
          inputOnRange++;
        }
      }
    }

    // console.log(new Date(startTime.current), new Date(endTime.current))

    let score = 0;
    score += noteEntered * 50;
    score += inputOnRange * 50;

    const result = {
      score: score,
      name: playerStatus.song.name,
      musicTime: formatTime(playerStatus.end / 1000),
      playTime: formatTime(playingTime.current),
      totalNote: totalNote,
      noteEntered: noteEntered,
      inputOnRange: inputOnRange,
    };

    console.log(result);

    setPlayResult(result);
  };

  useEffect(() => {
    const notePlayerRefCtx = notePlayerRef.current;

    if (notePlayerRefCtx) {
      getPlayer().addFinishListener(() => {
        handleFinish();
      });

      getPlayer().addTimeUpdatedListener(onPlayerTimeUpdated);
      getPlayer().addTimeUpdatedListener((time: number, end: number, bpm: number)=>{
        musicSheetRenderRef.current?.cursorMoveTo(time * 1000, bpm)
      });

      getPlayer().addNewSongCallback(() => {
        handleInitial();
      });
    }

    const updatePlayingTime = setInterval(() => {
      if (!getIsFinished() && notePlayerRefCtx && getPlayer().isPlaying())
        increasePlayingTime(0.1);
    }, 100);

    return () => {
      if (notePlayerRefCtx) {
        getPlayer().pause();
        getPlayer().clearFinishListener();
        getPlayer().clearTimeUpdatedListener();
        getPlayer().clearNewSongCallback();
      }

      clearInterval(updatePlayingTime);
    };
  }, []);

  useEffect(() => {
    console.log("music file changed");
    if (musicFile) {
      if (musicFile.type === "audio/midi"  || musicFile.type === "audio/mid") {
        getPlayer().loadSong(musicFile, "fileName", "fileName");
        setIsMidi2XML(true);

        const formData = new FormData();
        formData.append("midi", musicFile);
        console.log("start to parse midi file");
        axios.post("http://localhost/musicfile/midi2mucicxml", formData).then((res) => {
          setMusicXML(res.data);
          setIsMidi2XML(false);
        });
      }

      if (musicFile.type === "audio/wav") {
        setIsWav2Midi(true);

        const formData = new FormData();
        formData.append("audio", musicFile);
        console.log("start to parse wav file");
        axios.post("http://localhost/musicfile/transcribe", formData, {responseType: "arraybuffer", timeout: 180000}).then((res) => {
          const midiBlob = new Blob([res.data], { type: "audio/midi" });

          // Convert Blob to File
          const midiFile = new File([midiBlob], "transcribed.mid", { type: "audio/midi" });
          console.log(midiFile.type);
          setMusicFile(midiFile);
          setIsWav2Midi(false);
        });
      }
      setIsFileLoaded(true);
    }
  }, [musicFile]);

  let resultComp = null;

  if (isFinished && isShowResult) {
    resultComp = (
      <PianoPlayingResult result={playResult} againCallback={againCallback} />
    );
  }

  /**
    Parse the midi file and set the midi data
  */
  // const parseMidi = async (file: File) => {
  //   try {
  //     const midiArrayBuffer = await file.arrayBuffer();
  //     const fileName = file.name;
  //     const midiData = new Midi(midiArrayBuffer);
  //     setMidiData(midiData);
  //     setFileName(fileName);

  //     getPlayer().loadSong(file, fileName, fileName);
  //   } catch (e) {
  //     console.error("Error parsing MIDI file", e);
  //   }
  // };

  return (
    <div style={{ background: "#282c34", height: "100vh" }}>
      <MIDIController
        ref={MIDIControllerRef}
        onNoteOn={onNoteOn}
        onNoteOff={onNoteOff}
      />
      {resultComp}
      <TopNavBar
        ref={topNavBarRef}
        playCallback={handlePlay}
        pausingCallback={handlePause}
        stopCallback={handleStop}
        menuCollapsedCallback={handleMenuCollapsed}
        progressCallback={handleProgressChanged}
        setMusicFile={setMusicFile}
        volume={volume}
        setVolume={setVolume}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div
        style={{
          position: "absolute",
          top: "0px",
          height: "100%",
          width: "100%",
          zIndex: 0,
        }}
      >
        <MusicNotePlayerRender ref={notePlayerRef} />
      </div>
      <MusicSheetRender2
        ref={musicSheetRenderRef}
        musicXML={musicXML}
        activeNotes={activeNotes}
        isFileLoaded={isFileLoaded}
        isCollapsed={isCollapsed}
      />
      <PianoRender
        activeNote={activeNotes}
        onNoteOn={onNoteOn}
        onNoteOff={onNoteOff}
      />
    </div>
  );
}

export default App;
