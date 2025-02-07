import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { notePathMap } from '../Map.js';


interface MIDIControllerProps {
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
  audioVolume: number;
}

const MIDIController = forwardRef(({ onNoteOn, onNoteOff, audioVolume }: MIDIControllerProps, ref) => {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [inputs, setInputs] = useState<WebMidi.MIDIInput[]>([]);
  const [audioBuffers, setAudioBuffers] = useState<{ [key: string]: AudioBuffer }>({});
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  useImperativeHandle(ref, () => ({
    playNote,
    stopNote
  }));
  const [volume, setVolume] = useState<number>(1);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      console.log('WebMIDI is not supported in this browser.');
    }

    // Preload audio buffers
    preloadAudioBuffers();

    // Cleanup on unmount
    return () => {
      if (midiAccess) {
        midiAccess.inputs.forEach(input => (input.onmidimessage = null));
      }
    };
  }, []);

  useEffect(() => {
    if (audioBuffers) {

      inputs.forEach(input => {
        // Bind MIDI message handler
        input.onmidimessage = handleMIDIMessage;
      });
    }
  }, [audioBuffers]);
  
  useEffect(() => {
    setVolume(audioVolume);
  }, [audioVolume]);

  const preloadAudioBuffers = async () => {
    const buffers: { [key: string]: AudioBuffer } = {};
    for (const [note, audioPath] of Object.entries(notePathMap)) {
      const audioBuffer = await loadAudio(audioPath);
      buffers[note] = audioBuffer;
    }
    setAudioBuffers(buffers);
  };

  const loadAudio = async (path: string) => {
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  };

  const onMIDISuccess = (midiAccess: WebMidi.MIDIAccess) => {
    setMidiAccess(midiAccess);
    const inputsArray = Array.from(midiAccess.inputs.values());
    setInputs(inputsArray);

    // Log the inputs for debugging
    console.log('MIDI Inputs:', inputsArray);
  };

  const onMIDIFailure = () => {
    console.log('Could not access your MIDI devices.');
  };

  const handleMIDIMessage = (event: WebMidi.MIDIMessageEvent) => {
    const [command, note, velocity] = event.data;

    if (command === 144 && velocity > 0) {
      // Note on
      console.log(`Note on: ${note}, Velocity: ${velocity}`);
      playNote(note, velocity);
      console.log('In handleMIDIMessage', note)
      onNoteOn(note)
    } else if (command === 128 || (command === 144 && velocity === 0)) {
      // Note off
      console.log(`Note off: ${note}`);
      stopNote(note);
      onNoteOff(note);
    }
  };

  const playNote = (note: number, velocity: number) => {
    const audioBuffer = audioBuffers[note];
    if (audioBuffer) {
      console.log(`Playing note: ${note} with velocity: ${velocity}`); // Log the note being played

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = audioContext.createGain();
      console.log('velocity', velocity)
      console.log('audioVolume', volume)
      console.log('as', 2 * (velocity / 127) * volume)
      gainNode.gain.value = 2 * (velocity / 127) * volume; // Scale velocity to gain
      console.log('gainNode', gainNode.gain.value)

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      source.start();
    } else {
      console.log(`No audio loaded for note ${note}`);
    }
  };

  const stopNote = (note: number) => {
    console.log(`Stopping note ${note}`);
    // Optional: Implement additional logic for stopping notes if needed
  };

  return null;
});

export default MIDIController;
