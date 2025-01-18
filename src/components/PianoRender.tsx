import {useEffect, useState} from "react";
import { isBlack } from "../util/utils.tsx"; // Utility function for black keys

interface PianoActiveNote {
  activeNote: number[] | null;
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
}

const Piano = ({activeNote, onNoteOn, onNoteOff}: PianoActiveNote) => {
    const renderDimensions = {
        whiteKeyHeight: 120,
        blackKeyHeight: 80,
        whiteKeyWidthPercentage: 100/52,
        minNoteNumber: 0, // A0
        maxNoteNumber: 87, // C8
    };
    const [whiteKeys, setWhiteKeys] = useState<JSX.Element[]>([]);
    const [blackKeys, setBlackKeys] = useState<JSX.Element[]>([]);
    const [activeNotes, setActiveNotes] = useState<number[]>([]);

    const isNoteActive = (note: number) => {
      if (activeNotes === null) {
        return false;
      }else{
        return activeNotes.includes(note);
      }
    };

    const renderKeys = () => {
      let whiteKeys = [];
      let blackKeys = [];
      let currentWhiteKeyIndex = 0;
      let whiteKeyWidthPercentage = 100/52;
  
      for (let i = renderDimensions.minNoteNumber; i <= renderDimensions.maxNoteNumber; i++) {
        const noteNumber = i + 21; // Adjust base note number (A0 starts at 21)
        const isActive = isNoteActive(noteNumber); // Check if the note is active
  
        // White Key Style
        if (!isBlack(i)) {
          whiteKeys.push(
            <div
              key={`white-${noteNumber}`}
              className={`key-white-${noteNumber}`}
              style={{
                width: `${whiteKeyWidthPercentage}%`,
                height: `${renderDimensions.whiteKeyHeight}px`,
                border: "1px solid black",
                position: "relative",
                display: "inline-block",
                backgroundColor: isActive ? "lightblue" : "white",
                zIndex: 1,
              }}
              onMouseDown={() => {onNoteOn(noteNumber)}}
              // onMouseOver={() => {onNoteOn(noteNumber)}}
              // onMouseLeave={() => {onNoteOff(noteNumber)}}
              onMouseUp={() => {onNoteOff(noteNumber)}}
              onTouchEnd={() => {onNoteOff(noteNumber)}}
            />
          );
          currentWhiteKeyIndex++;
        } else {
          // Black Key Style
          blackKeys.push(
            <div
              key={`black-${noteNumber}`}
              className={`key-black-${noteNumber}`}
              style={{
                width: `${whiteKeyWidthPercentage * 0.6}%`,
                height: `${renderDimensions.blackKeyHeight}px`,
                backgroundColor: isActive ? "blue" : "black",
                position: "absolute",
                left: `${(currentWhiteKeyIndex - 1) * whiteKeyWidthPercentage + whiteKeyWidthPercentage * 0.7}%`,
                zIndex: 2,
              }}
              onMouseDown={() => {onNoteOn(noteNumber)}}
              // onMouseOver={() => {onNoteOn(noteNumber)}}
              // onMouseLeave={() => {onNoteOff(noteNumber)}}
              onMouseUp={() => {onNoteOff(noteNumber)}}
              onTouchEnd={() => {onNoteOff(noteNumber)}}
            />
          );
        }
      }
  
      return { whiteKeys, blackKeys };
    };


    useEffect(() => {
      setActiveNotes(activeNote || []);
    }, [activeNote]);
 
    useEffect(() => {
        console.log(`LocalactiveNotes: ${activeNotes}`);
        const { whiteKeys, blackKeys } = renderKeys();
        setWhiteKeys(whiteKeys);
        setBlackKeys(blackKeys);
    }, [activeNotes]);

  return (
    <div
      className="piano"
      style={{
        position: "absolute",
        bottom: 2,
        width: "100%",
        height: `${renderDimensions.whiteKeyHeight}px`,
        display: "flex",
        zIndex: 10,
      }}
    >
      {/* White keys */}
      {whiteKeys}

      {/* Black keys (overlayed) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${renderDimensions.blackKeyHeight}px`,
        }}
      >
        {blackKeys}
      </div>
    </div>
  );
};

export default Piano;
