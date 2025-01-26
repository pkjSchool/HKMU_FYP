import { useEffect, useRef, useState } from 'react';
import { CSSProperties } from 'styled-components';
import { Midi } from 'tonejs-midi-fix';
import { Beam, Formatter, Stave, StaveNote, Renderer, Voice, TickContext } from 'vexflow';

import { MusicScore } from '../models/MusicNotaion';
import { midiData2MusicScore } from '../util/midi2MusicScore';
import { Form } from 'react-router-dom';

interface RenderMusicSheetProps {
    midiData: Midi | null;
    fileName: string | null;
}

const RenderMusicSheet: React.FC<RenderMusicSheetProps> = ({ midiData, fileName }) => {
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
        if (midiData) {
            const musicScore = midiData2MusicScore(midiData);
            console.log(musicScore);
        }

        // if (storedSheet && containerRef.current && !containerRef.current.hasChildNodes()) {
        //     containerRef.current.innerHTML = storedSheet;
        //     return;
        // }

        if (CurrentFileName !== fileName || (!containerRef.current?.hasChildNodes() && CurrentFileName !== fileName)) {

            if (containerRef.current?.hasChildNodes()) {
                containerRef.current.innerHTML = '';
            }

            if (containerRef.current) {
                const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);

                // Configure the rendering context.
                renderer.resize(1200, 200);
                const context = renderer.getContext();


                // Create stave
                const staveMeasure1 = new Stave(10, 40, 300);

                // Add a clef and time signature.
                staveMeasure1.addClef("treble").addTimeSignature("4/4");

                // Connect to the rendering context
                staveMeasure1.setContext(context).draw();

                const notes1Measure1 = [
                    new StaveNote({
                        keys: ["c/4"],
                        duration: "q",
                    }),

                    new StaveNote({
                        keys: ["c/4"],
                        duration: "q",
                    }),
                    new StaveNote({
                        keys: ["g/4"],
                        duration: "q",
                    }),

                    new StaveNote({
                        keys: ["g/4"],
                        duration: "q",
                    }),
                ];
                const notes2Measure1 = [
                    new StaveNote({
                        keys: ["e/3", "c/3"],
                        duration: "h",
                    }),
                    new StaveNote({
                        keys: ["c/3", "c/4"],
                        duration: "h",
                    }),
                ];
                
                const voice1 = new Voice({ num_beats: 4, beat_value: 4 }).addTickables(notes1Measure1);

                const voice2 = new Voice({ num_beats: 4, beat_value: 4 }).addTickables(notes2Measure1);

                const formatter = new Formatter().joinVoices([voice1]).format([voice1], 250);
                formatter.joinVoices([voice2]).format([voice2]);

                voice1.draw(context, staveMeasure1);
                voice2.draw(context, staveMeasure1);

                // Measure 2 - second measure is placed adjacent to first measure.
                const staveMeasure2 = new Stave(staveMeasure1.getWidth() + staveMeasure1.getX(), 40, 400);

                const notesMeasure2_part1 = [new StaveNote({ keys: ["c/4"], duration: "8" }), new StaveNote({ keys: ["d/4"], duration: "8" }), new StaveNote({ keys: ["b/4"], duration: "8" }), new StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "8" })];

                const notesMeasure2_part2 = [new StaveNote({ keys: ["c/4"], duration: "8" }), new StaveNote({ keys: ["d/4"], duration: "8" }), new StaveNote({ keys: ["b/4"], duration: "8" }), new StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "8" })];

                // Create the beams for 8th notes in second measure.
                const beam1 = new Beam(notesMeasure2_part1);
                const beam2 = new Beam(notesMeasure2_part2);

                const notesMeasure2 = notesMeasure2_part1.concat(notesMeasure2_part2);

                staveMeasure2.setContext(context).draw();
                Formatter.FormatAndDraw(context, staveMeasure2, notesMeasure2);

                // measure 3
                const staveMeasure3 = new Stave(staveMeasure2.getWidth() + staveMeasure2.getX(), 40, 250);
                const notesMeasure3 = [new StaveNote({ keys: ["a/4"], duration: "q" }), new StaveNote({ keys: ["b/4"], duration: "q" }), new StaveNote({ keys: ["c/4"], duration: "qr" }), new StaveNote({ keys: ["c/3", "e/3", "g/3"], duration: "q" })];

                staveMeasure3.setContext(context).draw();
                Formatter.FormatAndDraw(context, staveMeasure3, notesMeasure3);

                // Render beams
                beam1.setContext(context).draw();
                beam2.setContext(context).draw();

                // localStorage.setItem('renderedMusicSheet', svgContent);
            }
        }
    }, [fileName]);

    return (
        <div className="sheet-container" style={styles.sheetContainer}>
            <div ref={containerRef}></div>
        </div>
    );
};

const createNote = (musicScore: MusicScore) => {
    const notesArray = [];

    musicScore.Measures.forEach((measure) => {
        measure.groupOfNotes.forEach((group) => {
            if (group.Notes.length > 1) {
                new StaveNote({ keys: group.Notes.map((note) => note.noteName), duration: group.Notes[0].durationNotation });
            }
        });
    });


};

const styles: { [key: string]: CSSProperties } = {
    sheetContainer: {
        backgroundColor: "#fff",
        display: 'flex',
        height: '200',
        width: '100%',
        marginTop: '5px'
    },
};

export default RenderMusicSheet;
