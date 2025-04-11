import {useEffect, useRef, useState} from "react";
import { isBlack } from "../../util/utils.ts"; // Utility function for black keys

interface PianoRenderProps {
  activeNote: number[] | null;
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
}

const keyLabels = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
  'Z', 'X', 'C', 'V', 'B', 'N', 'M'
];

const Piano = (props: PianoRenderProps) => {
  const renderDimensions = {
    whiteKeyHeight: 120,
    blackKeyHeight: 80,
    whiteKeyWidthPercentage: 100/52,
    minNoteNumber: 0, // A0 (21)
    maxNoteNumber: 87, // C8 (108)
  };
  
  const [whiteKeys, setWhiteKeys] = useState<JSX.Element[]>([]);
  const [blackKeys, setBlackKeys] = useState<JSX.Element[]>([]);
  const keyboardActiveNotes = useRef<Set<number>>(new Set());

  // Keyboard handling
  useEffect(() => {
    const keyCodes = [
      'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 
      'Digit8', 'Digit9', 'Digit0', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 
      'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 
      'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 
      'KeyB', 'KeyN', 'KeyM'
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      const codeIndex = keyCodes.indexOf(e.code);
      if (codeIndex === -1) return;

      e.preventDefault();
      const note = 48 + codeIndex;
      if (!keyboardActiveNotes.current.has(note)) {
        keyboardActiveNotes.current.add(note);
        props.onNoteOn(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const codeIndex = keyCodes.indexOf(e.code);
      if (codeIndex === -1) return;

      e.preventDefault();
      const note = 48 + codeIndex;
      if (keyboardActiveNotes.current.has(note)) {
        keyboardActiveNotes.current.delete(note);
        props.onNoteOff(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [props.onNoteOn, props.onNoteOff]);

  // Key rendering
  const renderKeys = () => {
    const whiteKeyElements: JSX.Element[] = [];
    const blackKeyElements: JSX.Element[] = [];
    let whiteKeyIndex = 0;

    for (let i = 0; i <= 87; i++) {
      const noteNumber = i + 21;
      const isActive = props.activeNote?.includes(noteNumber) || false;
      const showLabel = noteNumber >= 48 && noteNumber <= 83;
      const keyLabel = showLabel ? keyLabels[noteNumber - 48] : null;

      if (!isBlack(i)) {
        whiteKeyElements.push(
          <div
            key={`white-${noteNumber}`}
            style={{
              width: `${renderDimensions.whiteKeyWidthPercentage}%`,
              height: `${renderDimensions.whiteKeyHeight}px`,
              border: "1px solid black",
              position: "relative",
              display: "inline-block",
              backgroundColor: isActive ? "lightblue" : "white",
              zIndex: 1,
            }}
            onMouseDown={() => props.onNoteOn(noteNumber)}
            onMouseLeave={() => props.onNoteOff(noteNumber)}
            onMouseUp={() => props.onNoteOff(noteNumber)}
          >
            {keyLabel && (
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#666',
                fontSize: '12px'
              }}>
                {keyLabel}
              </div>
            )}
          </div>
        );
        whiteKeyIndex++;
      } else {
        blackKeyElements.push(
          <div
            key={`black-${noteNumber}`}
            style={{
              width: `${renderDimensions.whiteKeyWidthPercentage * 0.6}%`,
              height: `${renderDimensions.blackKeyHeight}px`,
              backgroundColor: isActive ? "blue" : "black",
              position: "absolute",
              left: `${(whiteKeyIndex - 1) * renderDimensions.whiteKeyWidthPercentage + renderDimensions.whiteKeyWidthPercentage * 0.7}%`,
              zIndex: 2,
            }}
            onMouseDown={() => props.onNoteOn(noteNumber)}
            onMouseLeave={() => props.onNoteOff(noteNumber)}
            onMouseUp={() => props.onNoteOff(noteNumber)}
          >
            {keyLabel && (
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                fontSize: '10px'
              }}>
                {keyLabel}
              </div>
            )}
          </div>
        );
      }
    }

    return { whiteKeys: whiteKeyElements, blackKeys: blackKeyElements };
  };

  useEffect(() => {
    const { whiteKeys, blackKeys } = renderKeys();
    setWhiteKeys(whiteKeys);
    setBlackKeys(blackKeys);
  }, [props.activeNote]);

  return (
    <div style={{
      position: "absolute",
      bottom: 2,
      width: "100%",
      height: `${renderDimensions.whiteKeyHeight}px`,
      display: "flex",
      userSelect: "none"
    }}>
      {whiteKeys}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${renderDimensions.blackKeyHeight}px`,
      }}>
        {blackKeys}
      </div>
    </div>
  );
};

export default Piano;
