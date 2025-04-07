import React, { useState } from 'react';

interface ChordProgressionInfoDialogProps {
  progressionIndex: number;
  chordProgressionInfo: string[];
}

const ChordProgressionInfoDialog: React.FC<ChordProgressionInfoDialogProps> = ({
  progressionIndex,
  chordProgressionInfo
}) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleOpen = () => setShowDialog(true);
  const handleClose = () => setShowDialog(false);

  if (!showDialog) {
    return (
      <button
        type="button"
        className="btn btn-info btn-sm ms-2"
        onClick={handleOpen}
      >
        Info
      </button>
    );
  }

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1050,
      width: 'auto',
      height: 'auto',
    }}>
      <div className="modal-content" style={{
        padding: '20px',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '80%',
        maxWidth: '600px',
        backgroundColor: 'white'
      }}>
        <h3>Progression Info in C Major 4/4</h3>
        <img
          src={chordProgressionInfo[progressionIndex]}
          alt={`Progression Info ${progressionIndex + 1}`}
          style={{
            borderRadius: '8px',
            margin: '10px 0'
          }}
        />
        <button
          type="button"
          onClick={handleClose}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ChordProgressionInfoDialog;