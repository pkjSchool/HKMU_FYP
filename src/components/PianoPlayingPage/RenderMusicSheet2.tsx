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

export type RenderMusicSheetRef = {
  cursorNext: () => void;
  cursorPrev: () => void;
  cursorMoveTo: (time:number, bpm:number) => void;
};

interface RenderMusicSheetProps {
  musicXML: string | null;
  isFileLoaded: boolean;
  activeNotes: number[];
  isCollapsed: boolean;
}

const RenderMusicSheet = (props: RenderMusicSheetProps,ref: React.Ref<RenderMusicSheetRef>) => {
  useImperativeHandle(ref, () => ({
    cursorNext,
    cursorPrev,
    cursorMoveTo
  }));
  
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdContainerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const [localActiveNotes, setLocalActiveNotes] = useState<number[]>([]);
  const [scrollAmount, setScrollAmount] = useState<number>(0);

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
          osmdRef.current!.EngravingRules.RenderSingleHorizontalStaffline = true;
          osmdRef.current!.render();

          // Add cursor
          var cursor = osmdRef.current!.cursor;
          cursor.show();
          cursorPrev()

        }).catch((e) => {
          console.error(e);
        });
    }
  }, [props.musicXML]);

  useEffect(() => {
    if (osmdRef.current) {
      // if (localActiveNotes.length < props.activeNotes.length) {

        // if (container && window.innerWidth - cursorX < 200) {
        //   console.log("adfgdsfg")
        //   container.scrollLeft = container.scrollLeft + 100;
        // }
      // }

      checkNoteIsCorrect();
      setLocalActiveNotes(props.activeNotes);
    }
  }, [props.activeNotes]);

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
          if (currentPressedNoteName[0] === currentSheetNote.Pitch.ToStringShortGet[0] && currentPressedNoteName[1] === '4') {
            cursor.GNotesUnderCursor()[0].sourceNote.StemColorXml = "#00ff00";
            cursor.GNotesUnderCursor()[0].sourceNote.NoteheadColor = "#00ff00";
            osmdRef.current.render();
            var cursor = osmdRef.current.cursor;
            // cursor.next();
          } else {
            if (cursor.GNotesUnderCursor()[0].sourceNote.NoteheadColor != "#00ff00") {
              cursor.GNotesUnderCursor()[0].sourceNote.StemColorXml = "#ff0000";
              cursor.GNotesUnderCursor()[0].sourceNote.NoteheadColor = "#ff0000";
            }
            osmdRef.current.render();
            var cursor = osmdRef.current.cursor;
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
          
          if (cursorX%window.innerWidth  > 1200) {
            var localScrollAmount = cursorX - window.innerWidth + 1200; // Adjust the offset as needed
            container.scrollLeft =  localScrollAmount;
            setScrollAmount(localScrollAmount);
          }else{
            container.scrollLeft =  scrollAmount;
          }
        }
      }
    }
  }

  return (
    <div
      className="sheet-container"
      ref={containerRef}
      style={
        true
          ? {
              ...styles.sheetContainer,
              top: props.isCollapsed ? "-70px" : "60px",
            }
          : { visibility: "hidden" }
      }
    >
      {/* <button style={styles.leftMusicSheetControlButton} onClick={cursorPrev}>Prev</button>
      <button style={styles.rightMusicSheetControlButton} onClick={cursorNext}>Next</button> */}
      <div ref={osmdContainerRef} style={{ width: "100%", height: "200px" }} ></div>
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
  leftMusicSheetControlButton: {
    position: "fixed",
    top: "20%",
    left: 0,
    zIndex: 999,
    // display: "flex",
    // alignContent: "center",
    // justifyContent: "center",
    // verticalAlign: "middle",
    // width: "30px",
  },
  rightMusicSheetControlButton: {
    position: "fixed",
    top: "20%",
    right: 0,
    zIndex: 999,
    // display: "flex",
    // alignContent: "center",
    // justifyContent: "center",
    // verticalAlign: "middle",
    // width: "30px",
  },
};

export default forwardRef(RenderMusicSheet);
