import { useEffect, useState } from 'react';
import { Midi } from 'tonejs-midi-fix';

import MIDIController from './components/MidiController.js';
import TopNavBar from './components/PianoPageTopNavBar.js';
import PianoRender from './components/PianoRender.js';
import MusicSheetRender from './components/RenderMusicSheet.js';

function App() {
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [midiData, setMidiData] = useState<Midi | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (musicFile) {
      parseMidi(musicFile);
    }
  }, [musicFile]);

  /**
    add the note to the active notes array 
  */
  const onNoteOn = (note: number) => {
    setActiveNotes((prev) => [...prev, note]);
  };

  /**
    Remove the note from the active notes array 
  */
  const onNoteOff = (note: number) => {
    setActiveNotes((prev) => prev.filter((n) => n !== note));
  };

  /**
    Parse the midi file and set the midi data
  */
  const parseMidi = async (file: File) => {
    try {

      const midiArrayBuffer = await file.arrayBuffer();
      const fileName = file.name;
      const midiData = new Midi(midiArrayBuffer);
      setMidiData(midiData);
      setFileName(fileName);

    } catch (e) {
      console.error("Error parsing MIDI file", e);
    }
  };

  return (
    <div style={{ background: '#282c34', height: '100vh', width: '100vw' }}>

      <MIDIController onNoteOn={onNoteOn} onNoteOff={onNoteOff} />
      <TopNavBar setMusicFile={setMusicFile} />
      
      <MusicSheetRender midiData={midiData} fileName={fileName} />
      <PianoRender
        activeNote={activeNotes}
      />
    </div>
  );
}

export default App;
