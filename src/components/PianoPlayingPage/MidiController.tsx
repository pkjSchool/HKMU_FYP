import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { notePathMap } from '../../Map.js';

export type MidiControllerRef = {
  playNote: (note: number, velocity: number) => void;
  stopNote: (note: number) => void;
}

interface MIDIControllerProps {
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
}

const MIDIController = (props: MIDIControllerProps, ref: React.Ref<MidiControllerRef>) => {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [inputs, setInputs] = useState<WebMidi.MIDIInput[]>([]);
  const [audioBuffers, setAudioBuffers] = useState<{ [key: string]: AudioBuffer }>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();;
    }
  }, [inputs]);

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
  }, [inputs]);

  useEffect(() => {
    setVolume(props.audioVolume);
  }, [props.audioVolume]);

  const preloadAudioBuffers = async () => {
    const buffers: { [key: string]: AudioBuffer } = {};
    for (const [note, audioPath] of Object.entries(notePathMap)) {
      const audioBuffer = await loadAudio(audioPath);
      buffers[note] = audioBuffer;
    }
    setAudioBuffers(buffers);
  };

  const loadAudio = async (path: string) => {
    if (!audioContextRef.current) throw new Error('Audio context not available');
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContextRef.current.decodeAudioData(arrayBuffer);
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
      props.onNoteOn(note)
    } else if (command === 128 || (command === 144 && velocity === 0)) {
      // Note off
      console.log(`Note off: ${note}`);
      stopNote(note);
      props.onNoteOff(note);
    }
  };

  const playNote = async (note: number, velocity: number) => {
    if (!audioContextRef.current) return;

    console.log("In playNote", note)

    const audioBuffer = audioBuffers[note];
    if (audioBuffer) {
      console.log(`Playing note: ${note} with velocity: ${velocity}`); // Log the note being played

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 2 * (velocity / 127) * 1.5; // Scale velocity to gain

      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

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
};

export default forwardRef(MIDIController);
