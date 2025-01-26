class MusicScore {
    musicName: string;
    timeSignature: number[];
    bpm: number;
    Measures: Measure[];
    beatDuration: number;

    constructor(musicName: string, timeSignature: number[], bpm: number, Muasures: Measure[], beatDuration: number) {
        this.musicName = musicName;
        this.timeSignature = timeSignature;
        this.bpm = bpm;
        this.Measures = Muasures;
        this.beatDuration = beatDuration; // a single beat duration in seconds
    }
}

class Measure {
    muasureStartTime: number;
    muasureEndTime: number;
    groupOfNotes: { noteStartTime: number, Notes: Note[] }[];

    constructor(muasureStartTime: number, muasureEndTime: number, groupOfNotes: { noteStartTime: number, Notes: Note[] }[]) {
        this.muasureStartTime = muasureStartTime;
        this.muasureEndTime = muasureEndTime;
        this.groupOfNotes = groupOfNotes;
    }
}

class Note {
    noteName: string;
    durationNotation: string;
    duration: number;
    velocity: number;
    midi: number
    noteStartTime: number;

    constructor(noteName: string, durationNotation: string, duration: number, velocity: number, midi: number, noteStartTime: number) {
        this.noteName = noteName;
        this.durationNotation = durationNotation;
        this.duration = duration;
        this.velocity = velocity;
        this.midi = midi;
        this.noteStartTime = noteStartTime;
    }
}

export { MusicScore, Measure, Note };