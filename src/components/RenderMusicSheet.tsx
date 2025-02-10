import { forwardRef, useEffect, useRef, useState } from "react";
import { CSSProperties } from "styled-components";
import { Midi } from "tonejs-midi-fix";
import {
  Beam,
  Formatter,
  Flow.Stave,
  StaveNote,
  Renderer,
  Voice,
  TickContext,
} from "vexflow";

import { MusicScore } from "../models/MusicNotaion";
import { midiData2MusicNotation } from "../util/midi2MusicNotation";
import { Note } from "../models/MusicNotaion";

interface RenderMusicSheetProps {
  midiData: Midi | null;
  fileName: string | null;
  activeNotes: number[];
  isCollapsed: boolean;
}

const RenderMusicSheet = forwardRef(
  (
    { midiData, fileName, activeNotes, isCollapsed }: RenderMusicSheetProps,
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [storedSheet, setStoredSheet] = useState<string | null>(null);
    const [CurrentFileName, setCurrentFileName] = useState<string | null>(null);
    const [measuresIndex, setMeasuresIndex] = useState<number[]>([0, 5]);
    const [staveList, setStaveList] = useState<Stave[]>([]);
    const [StaveNotesList, setStaveNotesList] = useState<StaveNote[][]>([]);
    const [musicScore, setMusicScore] = useState<MusicScore | null>(null);
    const [localActiveNotes, setLocalActiveNotes] = useState<number[]>([]);
    const [activeNoteIndex, setActiveNoteIndex] = useState<number>(0);
    const [renderer, setRenderer] = useState<Renderer | null>(null);

    // Load stored music sheet on mount
    useEffect(() => {
      const savedSheet = localStorage.getItem("renderedMusicSheet");
      if (savedSheet) {
        setStoredSheet(savedSheet);
      }
    }, []);

    useEffect(() => {
      if (fileName) {
        setCurrentFileName(fileName);
      }
    }, [fileName]);

    useEffect(() => {
      console.log("staveList", staveList);
    }, [staveList]);

    // Render the music sheet
    useEffect(() => {
      if (musicScore) {
        if (containerRef.current) {
          containerRef.current.innerHTML = "";

          const renderer = new Renderer(
            containerRef.current,
            Renderer.Backends.SVG
          );

          // Configure the rendering context.
          renderer.resize(1600, 200);
          const context = renderer.getContext();

          // draw the music sheet
          const [startIndex, endIndex] = measuresIndex;
          console.log("startIndex", startIndex, "endIndex", endIndex);
          const staveLists = staveList.slice(startIndex, endIndex);
          console.log(staveLists);
          staveLists.forEach((stave, index) => {
            stave.setContext(context).draw();
            const notes = StaveNotesList[startIndex + index];
            Formatter.FormatAndDraw(context, stave, notes);
          });

          setRenderer(renderer);
        }
      }
    }, [measuresIndex]);

    useEffect(() => {
      if (midiData) {
        setMeasuresIndex([0, 5]);

        const musicScore = midiData2MusicNotation(midiData);
        setMusicScore(musicScore);
        console.log(musicScore);

        // get the stave notes list
        const StaveNotesList = createStaveNote(musicScore);
        setStaveNotesList(StaveNotesList);

        // create stave list
        const staveList: Stave[] = [];
        let stavePositionX = 10;
        let staveWidth = 300;
        let position = 0;

        StaveNotesList.forEach((_, index) => {
          const value = index % 5;
          position = (stavePositionX + staveWidth) * value - 10 * value;
          const stave = new Stave(position, 40, staveWidth);
          if (index === 0) {
            stave
              .addClef("treble")
              .addTimeSignature(
                musicScore.timeSignature[0] + "/" + musicScore.timeSignature[1]
              );
          }

          console.log(position);
          staveList.push(stave);
        });
        setStaveList(staveList);
      }
    }, [midiData]);

    // update the music sheet when the button is clicked
    useEffect(() => {}, [measuresIndex]);

    const onClickLeftButton = () => {
      const [startIndex, endIndex] = measuresIndex;
      if (startIndex === 0) return;
      setMeasuresIndex([startIndex - 5, endIndex - 5]);
    };

    const onClickRightButton = () => {
      const [startIndex, endIndex] = measuresIndex;
      if (endIndex < staveList.length - 1) {
        setMeasuresIndex([startIndex + 5, endIndex + 5]);
      }
    };

    useEffect(() => {
      if (containerRef.current?.hasChildNodes()) {
        if (localActiveNotes.length > activeNotes.length) {
          const note = localActiveNotes.filter((n) => !activeNotes.includes(n));
        }
      }
    }, [activeNotes]);

    return (
      <div
        className="sheet-container"
        style={
          fileName
            ? { ...styles.sheetContainer, top: isCollapsed ? "-40px" : "70px" }
            : { visibility: "hidden" }
        }
      >
        {fileName && (
          <button
            style={styles.leftMusicSheetControlButton as CSSProperties}
            onClick={onClickLeftButton}
          >
            left
          </button>
        )}
        <div ref={containerRef}></div>
        {fileName && (
          <button
            style={styles.rightMusicSheetControlButton as CSSProperties}
            onClick={onClickRightButton}
          >
            right
          </button>
        )}
      </div>
    );
  }
);

// alogrithm to create notes
// for each measure
//    1. get the group of notes for the measure
//    2. create StaveNote for each group of note
//       - base on the duration, quarter note will be the duration first
//       - if there are no notes in the quarter duration, then the next duration will be half note, and whole note
// 3. return the list of StaveNote for each measure

const createStaveNote = (musicScore: MusicScore) => {
  // create StaveNote for each note
  const musicNotaionList: StaveNote[][] = [];

  musicScore.Measures.forEach((group) => {
    const groupOfNotes = group.groupOfNotes;
    const MeasureNotes: StaveNote[] = [];
    groupOfNotes.forEach((notes) => {
      const note = notes.Notes;

      const keys = Object.keys(note);

      if (keys.includes("q")) {
        var notelist: Note[] = [];
        Object.values(note).forEach((note) => {
          note.forEach((n) => {
            notelist.push(n);
          });
        });

        MeasureNotes.push(
          new StaveNote({
            keys: notelist.map((n) => n.noteName),
            duration: "q",
          })
        );
      } else if (keys.includes("h")) {
        var notelist: Note[] = [];
        Object.values(note).forEach((note) => {
          note.forEach((n) => {
            notelist.push(n);
          });
        });

        MeasureNotes.push(
          new StaveNote({
            keys: notelist.map((n) => n.noteName),
            duration: "h",
          })
        );
      } else if (keys.includes("hd")) {
        var notelist: Note[] = [];
        Object.values(note).forEach((note) => {
          note.forEach((n) => {
            notelist.push(n);
          });
        });

        MeasureNotes.push(
          new StaveNote({
            keys: notelist.map((n) => n.noteName),
            duration: "hd",
          })
        );
      } else if (keys.includes("w")) {
        var notelist: Note[] = [];
        Object.values(note).forEach((note) => {
          note.forEach((n) => {
            notelist.push(n);
          });
        });

        MeasureNotes.push(
          new StaveNote({
            keys: notelist.map((n) => n.noteName),
            duration: "w",
          })
        );
      }
    });

    musicNotaionList.push(MeasureNotes);
  });

  return musicNotaionList;
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
