import { keysMap } from '../Map';
import { Midi } from "tonejs-midi-fix";

import { MusicScore, Measure, Note } from "../models/MusicNotaion";

// convert midi data to music score
// algorithm:
// 1. parsing header information
//    - get beatDuration, timeSignature, bpm, musicName
// 2. create measures map
// 3. Process Notes
//   - add the note to the corresponding measure
// 4. Fill measures with rests dynamically only if needed
const midiData2MusicNotation = (midiData: Midi) => {

  const measuresMap: { [startTime: number]: Measure } = {};
  const musicName = midiData.name;
  const timeSignature = midiData.header.timeSignatures[0].timeSignature;
  const bpm = midiData.header.tempos[0].bpm;
  const beatDuration = 60 / bpm;

  const notes = midiData.tracks[0].notes;
  const muasureDuration = getMeasureDuration(timeSignature, beatDuration);


  // Process Notes
  notes.forEach((note) => {
    const measureIndex = Math.floor(note.time / muasureDuration);
    const measureStartTime = measureIndex * muasureDuration;
    const noteDurationinBeat = Math.ceil(note.duration / beatDuration);
    const noteDurationNotaion = getVexFlowDurationNotation(noteDurationinBeat, timeSignature);


    // Create a new measure if it doesn't exist
    if (!measuresMap[measureStartTime]) {
      measuresMap[measureStartTime] = {
        muasureStartTime: measureStartTime,
        muasureEndTime: measureStartTime + muasureDuration,
        groupOfNotes: [],
      };
    }


    // Add the note to the corresponding measure
    const measure = measuresMap[measureStartTime];

    // Check if the note belongs to an existing group of notes
    const groupOfNotes = measure.groupOfNotes.find(
      (group) => group.noteStartTime === note.time
    );

    if (groupOfNotes) {
      if (Object.keys(groupOfNotes.Notes).includes(noteDurationNotaion)) {
        groupOfNotes.Notes[noteDurationNotaion].push(
          new Note(
            getVexFlowNoteNameNotation(note.name),
            noteDurationNotaion,
            note.duration,
            note.velocity,
            note.midi,
            note.time
          )
        );
      }else{
        groupOfNotes.Notes[noteDurationNotaion] = [new Note(
          getVexFlowNoteNameNotation(note.name),
          noteDurationNotaion,
          note.duration,
          note.velocity,
          note.midi,
          note.time
        )];
      }
    }else{
      measure.groupOfNotes.push({
        noteStartTime: note.time,
        Notes: { [noteDurationNotaion]: [new Note(
          getVexFlowNoteNameNotation(note.name),
          noteDurationNotaion,
          note.duration,
          note.velocity,
          note.midi,
          note.time
        )]}
      });
    }
  });

  const measures = Object.values(measuresMap);

  // Fill measures with rests dynamically only if needed
  measures.forEach((measure) => {

    let durationScore = 0;

    measure.groupOfNotes.forEach((group) => {
      const duration = Object.keys(group.Notes);
      if (duration.includes('q')){
        durationScore += 1;
      } else if (duration.includes('h')){
        durationScore += 2;
      } else if (duration.includes('hd')){
        durationScore += 3;
      } else if (duration.includes('w')){
        durationScore += 4;
      }
    });

    if (durationScore < timeSignature[0]) {
      const restCount = timeSignature[0] - durationScore;
      for (let i = 0; i < restCount; i++) {
        measure.groupOfNotes.push({
          noteStartTime: measure.muasureStartTime + i * beatDuration,
          Notes: { 'qr':  [new Note('c/4', 'qr', beatDuration, 0, 0, measure.muasureStartTime)] }
        });
      }
    }

    // if (measure.groupOfNotes.length < timeSignature[0]) {
    //   const restCount = timeSignature[0] - measure.groupOfNotes.length;
    //   for (let i = 0; i < restCount; i++) {
    //     measure.groupOfNotes.push({
    //       noteStartTime: measure.muasureStartTime + i * beatDuration,
    //       Notes: { 'qr':  [new Note('c/4', 'qr', beatDuration, 0, 0, measure.muasureStartTime)] }
    //     });
    //   }
    // }
  });

  return new MusicScore(musicName, timeSignature, bpm, measures, beatDuration);
};


const getVexFlowNoteNameNotation = (noteName: string) => {
  if (noteName) {
    const index = noteName.match(/\d/)?.index;
    if (index) {
      return noteName.slice(0, index).toLowerCase() + '/' + noteName.slice(index);
    }
  }
  return 'c/4';
}

const getVexFlowDurationNotation = (durationNotation: number, timeSignature: number[]) => {
  if (timeSignature[1] == 4) {
    switch (durationNotation) {
      case 1:
        return 'q';
      case 2:
        return 'h';
      case 3:
        return 'hd';
      case 4:
        return 'w';
      default:
        return 'q';
    }
  }
  return 'q';
}

const getMeasureDuration = (timeSignature: number[], beatDuration: number) => {
  return timeSignature[0] * beatDuration;
}

export { midiData2MusicNotation };