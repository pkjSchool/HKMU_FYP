import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react";
import { CSSProperties } from "styled-components";
import cursorImg from "../../assets/Sheet_music/cursor.png";
import "../../css/RenderMusicSheet.css";
import { noteMap } from "../../Map";

import {
  MusicPartManagerIterator,
  OpenSheetMusicDisplay,
  VoiceEntry,
  Note,
  
  StemDirectionType,
} from "opensheetmusicdisplay";
import { set } from "react-hook-form";

const TRUECOLOR = "#00ff00"
const FALSECOLOR = "#ff0000"

export type RenderMusicSheetRef = {
  cursorNext: () => void;
  cursorPrev: () => void;
  cursorMoveTo: (time:number, bpm:number) => void;
  rerenderSheet: () => void;
  exportResult: () => any;
  checkNoteIsCorrect2: () => void;
};

interface RenderMusicSheetProps {
  musicXML?: string | null;
  isFileLoaded?: boolean;
  activeNotes?: number[];
  isCollapsed?: boolean;
  cssProps?: CSSProperties;
  singleHorizontalStaffline?: boolean;
}

const RenderMusicSheet = (props: RenderMusicSheetProps,ref: React.Ref<RenderMusicSheetRef>) => {
  useImperativeHandle(ref, () => ({
    cursorNext,
    cursorPrev,
    cursorMoveTo,
    rerenderSheet,
    exportResult,
    checkNoteIsCorrect2
  }));
  
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdContainerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const [localActiveNotes, setLocalActiveNotes] = useState<number[]>([]);
  const [scrollAmount, setScrollAmount] = useState<number>(0);
  const [musicSheet, setMusicSheet] = useState<string | null>(null);

  useEffect(() => {
    console.log("RenderMusicSheet: musicXML");

    if (osmdContainerRef.current && props.musicXML) {
      osmdContainerRef.current.innerHTML = "";

      // Initialize OpenSheetMusicDisplay
      osmdRef.current = new OpenSheetMusicDisplay(osmdContainerRef.current, {
        autoResize: true,
        drawTitle: false,
        drawSubtitle: false,
        drawComposer: false,
        drawLyricist: false,
        drawPartNames: false,
        drawMeasureNumbers: false,
        drawFingerings: false,
        drawCredits: false,
        disableCursor: false,
      });

      let cursorsOptions = [{type: 0, color: "#3d5e94", alpha: 0.5, follow: true}];
      osmdRef.current.setOptions({cursorsOptions: cursorsOptions});

      // Load the XML and render
      osmdRef.current.load(props.musicXML).then(() => {
          // Set the options to display only one system (row)
          osmdRef.current!.EngravingRules.RenderSingleHorizontalStaffline = (props.singleHorizontalStaffline == false)?false:true;
          osmdRef.current!.zoom = 1.3;
          osmdRef.current!.render();

          // Add cursor
          var cursor = osmdRef.current!.cursor;
          cursor.show();
          cursorPrev()

          setMusicSheet(props.musicXML)
        }).catch((e) => {
          console.error(e);
        });
    }
  }, [props.musicXML]);

  // useEffect(() => {
  //   if (osmdRef.current) {
  //     // if (localActiveNotes.length < props.activeNotes.length) {

  //       // if (container && window.innerWidth - cursorX < 200) {
  //       //   console.log("adfgdsfg")
  //       //   container.scrollLeft = container.scrollLeft + 100;
  //       // }
  //     // }

  //     checkNoteIsCorrect();
  //     setLocalActiveNotes(props.activeNotes);
  //   }
  // }, [props.activeNotes]);

  const rerenderSheet = () => {
    if (osmdRef.current && osmdContainerRef.current && musicSheet) {
      osmdContainerRef.current.innerHTML = "";

      // Initialize OpenSheetMusicDisplay
      osmdRef.current = new OpenSheetMusicDisplay(osmdContainerRef.current, {
        autoResize: true,
        drawTitle: false,
        drawSubtitle: false,
        drawComposer: false,
        drawLyricist: false,
        drawPartNames: false,
        drawMeasureNumbers: false,
        drawFingerings: false,
        drawCredits: false,
        disableCursor: false,
      });

      let cursorsOptions = [{type: 0, color: "#3d5e94", alpha: 0.5, follow: true}];
      osmdRef.current.setOptions({cursorsOptions: cursorsOptions});

      // Load the XML and render
      osmdRef.current.load(musicSheet).then(() => {
          // Set the options to display only one system (row)
          osmdRef.current!.EngravingRules.RenderSingleHorizontalStaffline = (props.singleHorizontalStaffline == false)?false:true;
          osmdRef.current!.zoom = 1.3;
          osmdRef.current!.render();

          // Add cursor
          var cursor = osmdRef.current!.cursor;
          cursor.show();
          cursorPrev()

        }).catch((e) => {
          console.error(e);
        });
    }
  }

  const exportResult = () => {
    let _result: any[] = []
    if (osmdRef.current) {
      let osmd = osmdRef.current

      for(const measure of osmd.Sheet.SourceMeasures) {
        let _measure = []
        for(const vsse of measure.VerticalSourceStaffEntryContainers) {
          let _vsse = []
          for(const staEntrie of vsse.StaffEntries) {
            let _sta = []
            for(const voiEntrie of staEntrie.VoiceEntries) {
              let _voi = []
              for(const note of voiEntrie.Notes) {
                _voi.push({ "entered": (note.StemColorXml === TRUECOLOR)})
              }
              _sta.push(_voi)
            }
            _vsse.push(_sta)
          }
          _measure.push(_vsse)
        }
        _result.push(_measure)
      }

    }

    return _result
  }

  const cursorNext = () => {
    if (osmdRef.current) {

      let cursor = osmdRef.current.cursor;
      cursor.next();
      scrollToCursor()
    }
  };

  const cursorPrev = () => {
    if (osmdRef.current) {

      let cursor = osmdRef.current.cursor;
      cursor.previous();
      scrollToCursor()
    }
  };

  const cursorReset = () => {
    if (osmdRef.current) {

      let cursor = osmdRef.current.cursor;
      cursor.reset();
      cursor.previous();
      scrollToCursor()
    }
  };

  const cursorMoveTo = (playTime:number, bpm:number) => {
    if (osmdRef.current) {
      let osmd = osmdRef.current

      if(playTime < 0) {
        cursorReset();
      } else {
        const denominator = osmd.Sheet.playbackSettings?.rhythm.denominator
        const numerator = osmd.Sheet.playbackSettings?.rhythm.numerator
        const userStartTempoInBPM = osmd.Sheet.userStartTempoInBPM

        const targetIndexInfo = _timestampToMeasureTndex(osmd.Sheet.SourceMeasures, userStartTempoInBPM, playTime, denominator)
        const targetMeasuresIndex = targetIndexInfo["index"]
        const targetMeasuresOffset = targetIndexInfo["offset"]
        // 獲取指定小節
        const measure = osmd.Sheet.SourceMeasures[targetMeasuresIndex];
        // 在小節內找到特定時間的位置
        if(measure){
            // 遍歷小節內的所有垂直 staff entry 容器：
            for (let v = measure.VerticalSourceStaffEntryContainers.length - 1; v >= 0; v--) {
                const vsse = measure.VerticalSourceStaffEntryContainers[v];
                // 檢查時間戳是否小於或等於指定的偏移量：
                if (_timestampToMillisecs(measure, vsse.Timestamp) <= targetMeasuresOffset + Number.EPSILON) {
                    // 如果是相同的 staff entry，則不做任何操作
                    // if (_currentMeasureIndex !== index || _currentVoiceEntryIndex !== v) {
                        _updateCursor(osmd, targetMeasuresIndex, v);
                    // }
                    scrollToCursor()
                    return;
                }
            }
        }
      }
    }
  }

  const _timestampToMeasureTndex = (measureList:any, bpm:number, playTime:number, measureBeat:number) => {
    // 這個輔助函數將時間戳轉換為毫秒 / BPM
    // const beatLong = (60 / bpm * measureBeat) * 1000
    // const measurePlayed = Math.floor(playTime / beatLong)
    // const totalTime = (measurePlayed * beatLong)
    // const measureOffset = playTime - totalTime
    // return {"index": measurePlayed, "offset": measureOffset}

    let measurePlayed = 0
    let totalTime = 0
    
    for (let listIdx = 0; listIdx < measureList.length; listIdx++) {
      const measure = measureList[listIdx];
      const tempoInBPM = measure.tempoInBPM
      const beatLong = (60 / tempoInBPM * measureBeat) * 1000
      measurePlayed = listIdx

      if(playTime <= (totalTime + beatLong)) {
        // console.log({"listIdx": listIdx, "totalTime": totalTime})
        break
      }

      totalTime = (totalTime + beatLong)
    }

    const measureOffset = playTime - totalTime

    return {"index": measurePlayed, "offset": measureOffset}
  }

  const _timestampToMillisecs = (measure:any, timestamp:any) => {
    // 這個輔助函數將時間戳轉換為毫秒 / BPM
    return (timestamp.RealValue * 4 * 60 * 1000) / measure.TempoInBPM;
  }

  const _updateCursor = (osmd:any, index:number, voiceEntryIndex:number) => {
    const measure = osmd.Sheet.SourceMeasures[index];
    const vsse = measure.VerticalSourceStaffEntryContainers[voiceEntryIndex];
    // _currentMeasureIndex = index;
    // _currentVoiceEntryIndex = voiceEntryIndex;
    if (index === 0 && voiceEntryIndex === 0) {
        osmd.cursor.reset();
    } else {
        const startTimestamp = measure.AbsoluteTimestamp.clone();
        startTimestamp.Add(vsse.Timestamp);

        osmd.cursor.iterator = new MusicPartManagerIterator(
            osmd.Sheet,
            startTimestamp,
            undefined,
        );
        osmd.cursor.update();
    }
  }

  const scrollToCursor = () => {
    if (osmdRef.current) {
      let cursor = osmdRef.current.cursor;
      if (containerRef.current && osmdContainerRef.current) {
        let cursor = osmdRef.current.cursor;
        let newCursorPos = cursor.cursorElement.getBoundingClientRect().left - osmdContainerRef.current.getBoundingClientRect().left - 200
        containerRef.current.scrollTo(newCursorPos, 0);
      }

      if(false && cursor.Iterator.CurrentVoiceEntries.length){
        const cursorVoiceEntry: VoiceEntry =
          cursor.Iterator.CurrentVoiceEntries[0];
        const baseNote: Note = cursorVoiceEntry.Notes[0];
        console.log(
          "Stem direction of VoiceEntry under Cursor: " +
            StemDirectionType[cursorVoiceEntry.StemDirection]
        );
        if (!baseNote.isRest()) {
          console.log(
            "base note of Voice Entry at second cursor position: " +
              baseNote.Pitch.ToString()
          );
        }
      }
    }
  }

  const checkNoteIsCorrect = () => {
    if (localActiveNotes.length < props.activeNotes.length) {
      if (osmdRef.current) {
      
        // get current sheet note
        var cursor = osmdRef.current.cursor;
        if (cursor.GNotesUnderCursor().length === 0) {
          return;
        }
        var currentSheetNote = cursor.NotesUnderCursor()[0];

        // get user press note
        var currentPressedNote = props.activeNotes[props.activeNotes.length - 1];
        var currentPressedNoteName = noteMap[currentPressedNote];

        // console.log(cursor.GNotesUnderCursor()[0])

        // console.log("currentPressedNoteName: ", currentPressedNoteName);
        // console.log("currentSheetNote: ", currentSheetNote.Pitch.ToStringShortGet);

        if (!currentSheetNote.isRest()) {
          console.log("currentPressedNoteName: ", (parseInt(currentPressedNoteName[1]) - 3).toString());
          console.log("currentSheetNote: ", currentSheetNote.Pitch?.ToStringShortGet);
          if (currentPressedNoteName[0] === currentSheetNote.Pitch?.ToStringShortGet[0] && (parseInt(currentPressedNoteName[1]) - 3).toString() === currentSheetNote.Pitch?.ToStringShortGet[1]) {
            noteMarkGreen( cursor.GNotesUnderCursor()[0].sourceNote)
            // osmdRef.current.render();
            // var cursor = osmdRef.current.cursor;
            // cursor.next();
          } else {
            noteMarkRed(cursor.GNotesUnderCursor()[0].sourceNote)
            // osmdRef.current.render();
            // var cursor = osmdRef.current.cursor;
            // cursor.next();
          }
        } else {
          // cursor.next();
        }
        const cursorX = osmdRef.current.cursor.cursorElement.x;
        const container = containerRef.current;

        // console.log("current.cursor.cursorElement.x ",osmdRef.current.cursor.cursorElement.x);
        // console.log("window.innerWidth: ", window.innerWidth);
        
        if (container) {
          // Calculate the required scrollLeft value
          // console.log("asdfsadfsadfa", cursorX%window.innerWidth)
          
          if (cursorX % window.innerWidth  > 1200) {
            var localScrollAmount = cursorX - window.innerWidth + 1200; // Adjust the offset as needed
            container.scrollLeft = localScrollAmount;
            setScrollAmount(localScrollAmount);
          }else{
            container.scrollLeft = scrollAmount;
          }
        }
      }
    }else {
      if (osmdRef.current) {
        var cursor = osmdRef.current.cursor;
        var currentSheetNote = cursor.NotesUnderCursor()[0];
        if (currentSheetNote?.isRest()) {
          noteMarkGreen(cursor.GNotesUnderCursor()[0].sourceNote)
          // osmdRef.current.render();
        }
      }
    }
  }  

  const checkNoteIsCorrect2 = () => {
      if (osmdRef.current && props.activeNotes) {
      
        // get current sheet note
        var cursor = osmdRef.current.cursor;
        if (cursor.GNotesUnderCursor().length === 0) {
          return;
        }
        var currentSheetNote = cursor.NotesUnderCursor()[0];

        if (cursor.GNotesUnderCursor()[0].sourceNote.StemColorXml === TRUECOLOR) {
          return;
        }

        if (props.activeNotes) {
          if (props.activeNotes.length > 0) {
            var currentPressedNote = props.activeNotes[props.activeNotes.length - 1];
            var currentPressedNoteName = noteMap[currentPressedNote];
            console.log("currentPressedNoteName: ", currentPressedNoteName);
            if (!currentSheetNote.isRest()) {
              if (currentPressedNoteName[0] === currentSheetNote.Pitch?.ToStringShortGet[0] && 
                (parseInt(currentPressedNoteName[1]) - 3).toString() === currentSheetNote.Pitch?.ToStringShortGet[1]) {
                noteMarkGreen( cursor.GNotesUnderCursor()[0].sourceNote)
              } else {
                noteMarkRed(cursor.GNotesUnderCursor()[0].sourceNote)
              }
            }
          } else {
            if (currentSheetNote.isRest()) {
              noteMarkGreen(cursor.GNotesUnderCursor()[0].sourceNote)
            }
          }

          if (!currentSheetNote.isRest()) {
            console.log("currentSheetNote: ", currentSheetNote.Pitch.ToStringShortGet);
          } else {
            console.log("currentSheetNote: ", "rest");
          }
          setLocalActiveNotes(props.activeNotes);
        }

        if (!currentSheetNote.isRest()) {
          console.log("currentSheetNote: ", currentSheetNote.Pitch.ToStringShortGet);
        } else {
          console.log("currentSheetNote: ", "rest");
        }
    }
  }  

  const noteMarkGreen = (sourceNote:any) => {
    sourceNote.StemColorXml = TRUECOLOR;
    sourceNote.NoteheadColor = TRUECOLOR;
    if (osmdRef.current) {
      osmdRef.current.render();
    }
  }

  const noteMarkRed = (sourceNote:any) => {
    if (sourceNote.NoteheadColor != TRUECOLOR) {
      sourceNote.StemColorXml = FALSECOLOR;
      sourceNote.NoteheadColor = FALSECOLOR;
      if (osmdRef.current) {
        osmdRef.current.render();
      }
    }
  }

  return (
    <div
      className="sheet-container"
      ref={containerRef}
      style={
        musicSheet && osmdContainerRef.current 
          ? {
              ...styles.sheetContainer,
              top: props.isCollapsed ? "-70px" : "60px",
              ...props.cssProps,
            }
          : { visibility: "hidden" }
      }
    >
      <div ref={osmdContainerRef} style={{ width: "100%", marginTop: "-40px" }} ></div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  sheetContainer: {
    position: "relative",
    top: "64px",
    backgroundColor: "#fff",
    // display: "flex",
    height: "450",
    width: "100%",
    marginTop: "5px",
    overflowX: "auto",
    overflowY: "hidden",
    whiteSpace: "nowrap",
    // justifyContent: "space-between",
    transition: "top 0.3s ease",
  },
};

export default forwardRef(RenderMusicSheet);
