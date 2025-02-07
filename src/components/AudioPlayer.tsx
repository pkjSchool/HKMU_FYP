import { useEffect, useRef, useState } from "react";
import { notePathMap } from '../Map.js';

interface AudioPlayerProps {
    activeNotes: number[];
    volume: number;
}

const AudioPlayer = ({ activeNotes, volume }: AudioPlayerProps) => {
    const [pianoAudioBuffers, setPianoAudioBuffers] = useState<{ [key: string]: AudioBuffer }>({});
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const [localVolume, setLocalVolume] = useState<number>(100);
    const preActiveNotes = useRef<number[]>([]);

    useEffect(() => {
        preloadPianoAudioBuffer();
    }, []);

    useEffect(() => {
        if (volume) {
            setLocalVolume(localVolume);
        }
    }, [volume]);

    useEffect(() => {
        console.log("H2")
        if (preActiveNotes.current && !areArraysEqual(preActiveNotes.current, activeNotes)){
            console.log('Playing notes:', activeNotes);
            const notPlayedNotes = preActiveNotes.current.filter(note => !activeNotes.includes(note));

            notPlayedNotes.forEach(note => {
                console.log("Hi")
                const audioBuffer = pianoAudioBuffers[note];

                if (audioBuffer){
                    const source = audioContext.createBufferSource();
                    source.buffer = audioBuffer;

                    const gainNode = audioContext.createGain();
                    gainNode.gain.value = 2 * (90/ 127);
                    
                    source.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    source.start();
                } else {
                    console.error(`No audio buffer found for note: ${note}`);
                }
            });
            preActiveNotes.current = activeNotes;
        }

    }, [activeNotes]);

    const preloadPianoAudioBuffer = async () => {
        const buffers: { [key: string]: AudioBuffer } = {};
        for (const [note, audioPath] of Object.entries(notePathMap)) {
            const audioBuffer = await loadAudio(audioPath);
            buffers[note] = audioBuffer;
        }
        setPianoAudioBuffers(buffers);
    };

    const loadAudio = async (path: string) => {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        return await audioContext.decodeAudioData(arrayBuffer);
    }

    const areArraysEqual = (array1: any[], array2: any[]): boolean => {
        if (array1.length !== array2.length) return false;
        return array1.every((value, index) => value === array2[index]);
    };



    return null;
}

export default AudioPlayer;
