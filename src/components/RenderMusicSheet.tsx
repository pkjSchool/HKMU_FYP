import { useEffect, useRef, useState } from 'react';
import { CSSProperties } from 'styled-components';
import { Midi } from 'tonejs-midi-fix';
import { Beam, Formatter, Stave, StaveNote, Renderer, Voice, TickContext } from 'vexflow';

import { MusicScore } from '../models/MusicNotaion';
import { midiData2MusicNotation } from '../util/midi2MusicNotation';
import { Note } from '../models/MusicNotaion';

interface RenderMusicSheetProps {
    midiData: Midi | null;
    fileName: string | null;
    activeNotes: number[];
}

const RenderMusicSheet = ({ midiData, fileName, activeNotes }: RenderMusicSheetProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [storedSheet, setStoredSheet] = useState<string | null>(null);
    const [CurrentFileName, setCurrentFileName] = useState<string | null>(null);

    // Load stored music sheet on mount
    useEffect(() => {
        const savedSheet = localStorage.getItem('renderedMusicSheet');
        if (savedSheet) {
            setStoredSheet(savedSheet);
        }
    }, []);

    useEffect(() => {
        if (fileName) {
            setCurrentFileName(fileName);
        }
    }, [fileName]);

    // Render the music sheet
    useEffect(() => {
        let musicScore: MusicScore | null = null;

        //convert midi data to music notation
        if (midiData) {
            musicScore = midiData2MusicNotation(midiData);
            console.log(musicScore);
        }

        if (storedSheet && containerRef.current && !containerRef.current.hasChildNodes()) {
            containerRef.current.innerHTML = storedSheet;
            return;
        }

        if (CurrentFileName !== fileName || (!containerRef.current?.hasChildNodes() && CurrentFileName !== fileName)) {

            if (containerRef.current?.hasChildNodes()) {
                containerRef.current.innerHTML = '';
            }

            if (containerRef.current) {
                
                const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);

                // Configure the rendering context.
                renderer.resize(5000, 200);
                const context = renderer.getContext();


                if (musicScore) {
                    // get the stave notes list
                    const StaveNotesList = createStaveNote(musicScore);

                    // create stave
                    let stavePositionX = 10;
                    StaveNotesList.forEach((notes, index) => {
                        const stave = new Stave(stavePositionX, 40, 300);
                        if (index === 0) {
                            stave.addClef("treble").addTimeSignature(musicScore.timeSignature[0] + "/" + musicScore.timeSignature[1]);
                        }
                        stave.setContext(context).draw();

                        Formatter.FormatAndDraw(context, stave, notes);

                        stavePositionX = stave.getWidth() + stave.getX();
                    });
                }
            }
        }
    }, [fileName]);

    return (
        <div className="sheet-container" style={styles.sheetContainer}>
            <div ref={containerRef}></div>
        </div>
    );
};

// alogrithm to create notes
// for each measure
//    1. get the group of notes for the measure
//    2. create StaveNote for each group of note
//       - base on the duration, quarter note will be the duration first
//       - if there are no notes in the quarter duration, then the next duration will be half note, and whole note
// 3. return the list of StaveNote for each measure

const createStaveNote = (musicScore: MusicScore) => {

    // create StaveNote for each note
    const musicNotaionList: StaveNote[][] = []

    musicScore.Measures.forEach((group) => {
        const groupOfNotes = group.groupOfNotes;
        const MeasureNotes: StaveNote[] = [];
        groupOfNotes.forEach((notes) => {
            const note = notes.Notes;

            const keys = Object.keys(note);

            if (keys.includes("q")) {
                var notelist: Note[] = []
                Object.values(note).forEach((note) => {
                    note.forEach((n) => {
                        notelist.push(n)
                    })
                });

                MeasureNotes.push(new StaveNote({
                    keys: notelist.map((n) => n.noteName),
                    duration: "q",
                })
                );
            } else if (keys.includes("h")) {
                var notelist: Note[] = []
                Object.values(note).forEach((note) => {
                    note.forEach((n) => {
                        notelist.push(n)
                    })
                });

                MeasureNotes.push(new StaveNote({
                    keys: notelist.map((n) => n.noteName),
                    duration: "h",
                })
                );
            } else if (keys.includes("hd")) {
                var notelist: Note[] = []
                Object.values(note).forEach((note) => {
                    note.forEach((n) => {
                        notelist.push(n)
                    })
                });

                MeasureNotes.push(new StaveNote({
                    keys: notelist.map((n) => n.noteName),
                    duration: "hd",
                })
                );
            } else if (keys.includes("w")) {
                var notelist: Note[] = []
                Object.values(note).forEach((note) => {
                    note.forEach((n) => {
                        notelist.push(n)
                    })
                });

                MeasureNotes.push(new StaveNote({
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
        backgroundColor: "#fff",
        display: 'flex',
        height: '200',
        width: '100%',
        marginTop: '5px',
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap'
    },
};

export default RenderMusicSheet;
