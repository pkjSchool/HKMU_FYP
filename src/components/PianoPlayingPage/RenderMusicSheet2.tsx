import { forwardRef, useEffect, useRef, useState } from "react";
import { CSSProperties } from "styled-components";
import cursorImg from "../../assets/Sheet_music/cursor.png";
import "../../css/RenderMusicSheet.css";
import { noteMap } from "../../Map";

import {
  OpenSheetMusicDisplay,
  VoiceEntry,
  Note,
  StemDirectionType,
} from "opensheetmusicdisplay";
import { set } from "react-hook-form";

interface RenderMusicSheetProps {
  musicXML: string | null;
  isFileLoaded: boolean;
  activeNotes: number[];
  isCollapsed: boolean;
}

const RenderMusicSheet = (props: RenderMusicSheetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdContainerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const cursorRef = useRef<HTMLImageElement>(null);
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
      console.log("RenderMusicSheet: musicXML1");

      // Load the XML and render
      osmdRef.current
        .load(props.musicXML)
        .then(() => {
          console.log("RenderMusicSheet: musicXML2");
          // Set the options to display only one system (row)
          osmdRef.current!.EngravingRules.RenderSingleHorizontalStaffline =
            true;
          osmdRef.current!.render();

          // Add cursor
          var cursor = osmdRef.current!.cursor;
          cursor.show();

        })
        .catch((e) => {
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

  const onchange = () => {
    if (osmdRef.current) {

      var cursor = osmdRef.current.cursor;

      cursor.next();
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
  };

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

      console.log(cursor.GNotesUnderCursor()[0])
      
      

      // console.log("currentPressedNoteName: ", currentPressedNoteName);
      // console.log("currentSheetNote: ", currentSheetNote.Pitch.ToStringShortGet);

    if (!currentSheetNote.isRest()){
      if (currentPressedNoteName[0] === currentSheetNote.Pitch.ToStringShortGet[0] && currentPressedNoteName[1] === '4') {
        cursor.GNotesUnderCursor()[0].sourceNote.StemColorXml = "#00ff00";
        cursor.GNotesUnderCursor()[0].sourceNote.NoteheadColor = "#00ff00";
        osmdRef.current.render();
        var cursor = osmdRef.current.cursor;
        cursor.next();
      }else {
        cursor.GNotesUnderCursor()[0].sourceNote.StemColorXml = "#ff0000";
        cursor.GNotesUnderCursor()[0].sourceNote.NoteheadColor = "#ff0000";
        osmdRef.current.render();
        var cursor = osmdRef.current.cursor;
        cursor.next();
      }
      }else{
        cursor.next();
      }
      const cursorX = osmdRef.current.cursor.cursorElement.x;
      const container = containerRef.current;

      console.log("current.cursor.cursorElement.x ",osmdRef.current.cursor.cursorElement.x);
      console.log("window.innerWidth: ", window.innerWidth);
      
      if (container) {
        // Calculate the required scrollLeft value
        console.log("asdfsadfsadfa", cursorX%window.innerWidth)
        
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
              top: props.isCollapsed ? "-40px" : "70px",
            }
          : { visibility: "hidden" }
      }
    >
      <button onClick={onchange}>HI</button>
      <div ref={osmdContainerRef} style={{ width: "100%", height: "200px" }} ></div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  sheetContainer: {
    position: "relative",
    top: "64px",
    backgroundColor: "#fff",
    display: "flex",
    height: "450",
    width: "100%",
    marginTop: "5px",
    overflowX: "auto",
    overflowY: "hidden",
    whiteSpace: "nowrap",
    justifyContent: "space-between",
    transition: "top 0.3s ease",
  },
  leftMusicSheetControlButton: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    verticalAlign: "middle",
    width: "30px",
  },
  rightMusicSheetControlButton: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    verticalAlign: "middle",
    width: "30px",
  },
};

export default RenderMusicSheet;
