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
      const cursorX = osmdRef.current.cursor.cursorElement.x;
      const container = containerRef.current;

      // console.log("rect.left: ",osmdRef.current.cursor.cursorElement.x);
      // console.log("window.innerWidth: ", window.innerWidth);
      // console.log("rect.right ", osmdRef.current.cursor.cursorElement.y);


      if (container && window.innerWidth - cursorX < 200) {
        container.scrollLeft = 1200;
      }

      if (localActiveNotes.length < props.activeNotes.length) {
        var cursor = osmdRef.current.cursor;
        var currentSheetNote = cursor.NotesUnderCursor()[0];
        var currentPressedNote =
          props.activeNotes[props.activeNotes.length - 1];
        var currentPressedNoteName = noteMap[currentPressedNote];

        console.log(cursor.GNotesUnderCursor()[0])
        cursor.GNotesUnderCursor()[0].sourceNote.NoteheadColor = "#ff0000";
        cursor.GNotesUnderCursor()[0].sourceNote.StemColorXml = "#ff0000";
        
        osmdRef.current.render();

        // console.log("currentPressedNoteName: ", currentPressedNoteName);
        // console.log("currentSheetNote: ", currentSheetNote.Pitch.ToStringShortGet);


        if (currentPressedNoteName[0] === currentSheetNote.Pitch.ToStringShortGet[0] && currentPressedNoteName[1] === '4') {
          cursor.next();
        }
      }
    }
  }, [props.activeNotes]);

  useEffect(() => {
    setLocalActiveNotes(props.activeNotes);
  }, [localActiveNotes]);

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
      <div ref={osmdContainerRef} style={{ width: "100%", height: "200px" }} />
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
