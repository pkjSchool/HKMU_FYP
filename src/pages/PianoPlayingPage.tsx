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
import { MUSIC1, MUSIC2 } from "../data/sample_music.js";
import {
  Player,
  getPlayer,
} from "../components/MusicNotePlayer/player/Player.js";
import { getLoginedUser } from "../access_control/user";
import { api_fileWavToMidi, api_fileMidiToXml, api_user_music_upload, api_add_user_music_record, api_user_music_get } from "../api_request/request.tsx";
import MusicSheetRender2, { RenderMusicSheetRef } from "../components/PianoPlayingPage/RenderMusicSheet2.js";
import RenderResultMusicSheet, { RenderResultMusicSheetRef } from "../components/PianoPlayingPage/RenderResultMusicSheet.js";

const ACCURATE_OFFSET = 150;

interface playResult {
  score: number;
  name: string;
  musicTime: string;
  playTime: string;
  totalNote: number;
  noteEntered: number;
  inputOnRange: number;
}

function App() {
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const userMusicId = useRef(0);
  const [isShowResultBrief, setIsShowResultBrief] = useState(false);
  const [isShowResultDetail, setIsShowResultDetail] = useState(false);
  const playResult = useRef<playResult>();
  const sheetResult = useRef<any[]>([]);

  const startTime = useRef(0);
  const endTime = useRef(0);
  const playingTime = useRef(0);
  const isFinished = useRef(false);

  const notePlayerRef = useRef<MusicNotePlayerRender | null>(null);
  const MIDIControllerRef = useRef<MidiControllerRef>(null);
  const topNavBarRef = useRef<TopNavBarRef>(null);
  const musicSheetRenderRef = useRef<RenderMusicSheetRef>(null);
  const resultmusicSheetRef = useRef<RenderResultMusicSheetRef>(null);

  const userInfo = getLoginedUser();

  const [volume, setVolume] = useState<number>(1);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [musicXML, setMusicXML] = useState<string | null>(null);
  const [midiData, setMidiData] = useState<Midi | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isMidi2XML, setIsMidi2XML] = useState<boolean>(false);
  const [isWav2Midi, setIsWav2Midi] = useState<boolean>(false);
  const [isUploadToUser, setIsUploadToUser] = useState<boolean>(false);
  const [isGetStortedMusicFromUser, setIsGetStortedMusicFromUser] = useState<boolean>(false);
  const [isUploadMusicRecord, setIsUploadMusicRecord] = useState<boolean>(false);
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
    if (notePlayerRef.current) {
      notePlayerRef.current.stop();
    }
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

  const getUserMusicId = () => {
    return userMusicId.current
  };

  const setUserMusicId = (id: number) => {
    userMusicId.current = id;
  };

  const getPlayResult = () => {
    return playResult.current
  };

  const setPlayResult = (id: playResult) => {
    playResult.current = id;
  };

  const getSheetResult = () => {
    return sheetResult.current
  };

  const setSheetResult = (id: any[]) => {
    sheetResult.current = id;
  };

  const againCallback = () => {
    handleReset();
  };

  const handleInitial = () => {
    if (notePlayerRef.current) getPlayer().resetNoteMeasurement();
    changeStartTime();
    resetPlayingTime();
    setIsFinished(false);
    setIsShowResultBrief(false);
    setIsShowResultDetail(false);
    handleStop();
  };

  const handleReset = () => {
    if (notePlayerRef.current) getPlayer().resetNoteMeasurement();
    changeStartTime();
    resetPlayingTime();
    setIsFinished(false);
    setIsShowResultBrief(false);
    setIsShowResultDetail(false);
    handleStop();
    if (musicSheetRenderRef.current) musicSheetRenderRef.current.rerenderSheet();
  };

  const handleFinish = () => {
    releaseAllNotes();
    setIsFinished(true);
    changeEndTime();
    renderResult();
    uploadMusicRecord()
    setTimeout(() => {
      setIsShowResultBrief(true);
      setIsShowResultDetail(false);
    }, 100);
  };

  const renderResult = () => {
    const playerStatus = notePlayerRef.current
      ? getPlayer().getPlayerState()
      : {};

    let sheetResult = []
    if (musicSheetRenderRef.current) 
      sheetResult = musicSheetRenderRef.current.exportResult();

    let inputOnRange = 0;
    let totalNote = 0;
    let noteEntered = 0;

    // // loop by bar
    // for (let track of playerStatus.song.activeTracks) {
    //   for (let note of track.notes) {
    //     totalNote++;
    //     if (note.isEntered) {
    //       noteEntered++;
    //     }
    //     if (note.isInputAccurate) {
    //       inputOnRange++;
    //     }
    //   }
    // }

    for (let measure of sheetResult) {
      for (let vsse of measure) {
        for (let staEntrie of vsse) {
          for (let voiEntrie of staEntrie) {
            for (let note of voiEntrie) {
              totalNote++;
              if(note.entered === true) {
                noteEntered++;
              }
            }
          }
        }
      }
    }

    let score = 0;
    score += noteEntered * 50;
    score += inputOnRange * 50;

    const result = {
      score: score,
      name: playerStatus.song.name,
      musicTime: formatTime(playerStatus.end / 1000),
      playTime: formatTime(playingTime.current),

      musicTimeRaw: (playerStatus.end / 1000),
      playTimeRaw: (playingTime.current),

      totalNote: totalNote,
      noteEntered: noteEntered,
      inputOnRange: inputOnRange,
    };

    console.log(result);
    console.log(sheetResult);

    setPlayResult(result);
    setSheetResult(sheetResult);
  };

  const handleOpenResultDetail = () => {
    setIsShowResultDetail(true);
  }

  const handleCloseResultDetail = () => {
    setIsShowResultDetail(false);
  }

  const uploadMusicRecord = () => {
    const _playresult = getPlayResult()
    if (musicSheetRenderRef.current && _playresult) {
      setIsUploadMusicRecord(true)
      api_add_user_music_record(
        parseInt(userInfo.user_id),
        getUserMusicId(),

        _playresult.musicTimeRaw,
        _playresult.playTimeRaw,

        _playresult.score,
        _playresult.totalNote,
        _playresult.noteEntered,
        _playresult.inputOnRange,
        getSheetResult()
      ).then((response) => {
        setIsUploadMusicRecord(false)
      })
    }
  }

  const fileWavToMidi = () => {
    if (musicFile) {
      if (musicFile.type === "audio/wav") {
        console.log("wav file entered");
        setIsWav2Midi(true);

        const formData = new FormData();
        formData.append("audio", musicFile);
        console.log("start to parse wav file");

        api_fileWavToMidi(formData).then((res) => {
          const midiBlob = new Blob([res.data], { type: "audio/midi" });
          // Convert Blob to File
          const midiFile = new File([midiBlob], "transcribed.mid", { type: "audio/midi" });
          console.log(midiFile.type);

          setMusicFile(midiFile);
          setIsWav2Midi(false);
        });
      }
    }
  };

  const fileMidiToXml = (midi_file: any) => {
    if (midi_file) {
      if (midi_file.type === "audio/midi"  || midi_file.type === "audio/mid") {
        getPlayer().loadSong(midi_file, "fileName", "fileName");

        console.log("midi file entered");
        setIsMidi2XML(true);

        const formData = new FormData();
        formData.append("midi", midi_file);
        console.log("start to parse midi file");

        api_fileMidiToXml(formData).then((res) => {
          setMusicXML(res.data);
          setIsMidi2XML(false);
        });
      }
    }
  };

  const fileUploadToUser = () => {
    if (musicFile) {
      if (musicFile.type === "audio/midi" || musicFile.type === "audio/mid") {
        setIsUploadToUser(true);

        console.log("start to upload music file to user");

        api_user_music_upload(
          parseInt(userInfo.user_id),
          musicFile
        ).then((response) => {
          const result = response.data
          const res_data = result.data;

          if(topNavBarRef.current) {
            topNavBarRef.current.updateUserMusicList();
          }
          getStortedMusicFromUser(res_data.user_music_id)
          setMusicFile(null);
          setIsUploadToUser(false);
        });
      }
    }
  };

  const getStortedMusicFromUser = (user_music_id: number) => {
    setIsGetStortedMusicFromUser(true);

    api_user_music_get(user_music_id).then((response) => {
      const result = response.data

      const midiBlob = new Blob([result], { type: "audio/midi" });
      const midiFile = new File([midiBlob], "downloaded.mid", { type: "audio/midi" });

      fileMidiToXml(midiFile);

      setUserMusicId(user_music_id);
      if(topNavBarRef.current) {
        topNavBarRef.current.setSelectedStortedMusicId(user_music_id)
      }

      setIsGetStortedMusicFromUser(false);
    });
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
        getPlayer().clearSong();
      }

      clearInterval(updatePlayingTime);
    };
  }, []);

  useEffect(() => {
    console.log("music file opened");
    if (musicFile) {
      if (musicFile.type === "audio/midi" || musicFile.type === "audio/mid") {
        fileUploadToUser();
      }
      if (musicFile.type === "audio/wav") {
        fileWavToMidi();
      }

      setIsFileLoaded(true);
    }
  }, [musicFile]);

  let resultComp = null;
  let resultDetailComp = null;

  if (isFinished && isShowResultBrief) {
    resultComp = (
      <PianoPlayingResult result={getPlayResult()} againCallback={againCallback} handleOpenResultDetail={handleOpenResultDetail} />
    );
  }

  if ((isFinished && isShowResultDetail)) {
    resultDetailComp = (
      <RenderResultMusicSheet ref={resultmusicSheetRef} musicXML={musicXML} sheetResult={getSheetResult()} handleCloseResultDetail={handleCloseResultDetail} />
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
      {resultDetailComp}
      <TopNavBar
        ref={topNavBarRef}
        playCallback={handlePlay}
        pausingCallback={handlePause}
        stopCallback={handleReset}
        menuCollapsedCallback={handleMenuCollapsed}
        progressCallback={handleProgressChanged}
        setMusicFile={setMusicFile}
        volume={volume}
        setVolume={setVolume}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        getStortedMusicFromUser={getStortedMusicFromUser}
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
      {(isWav2Midi || isMidi2XML || isUploadToUser || isGetStortedMusicFromUser || isUploadMusicRecord) ? <div className="loader-wrapper"><div className="loader"></div></div> : null}
    </div>
  );
}

export default App;
