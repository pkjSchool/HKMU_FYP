import { useEffect, useState } from 'react';

import { api_add_chord } from '../../api_request/request';
import RenderMusicSheet2 from '../PianoPlayingPage/RenderMusicSheet2';

import { api_fileMidiToXml } from '../../api_request/request';
import { Link } from 'react-router-dom';

import ChordProgressionInfoDialog from './ChordProgressionInfoDialog';
import progression_info1 from '../../assets/chord_progression/progression_1_2_5_3.png'
import progression_info2 from '../../assets/chord_progression/progression_1_5_4_5.png'
import progression_info3 from '../../assets/chord_progression/progression_3_6_2_5.png'
import progression_info4 from '../../assets/chord_progression/progression_2_5_1.png'
import progression_info5 from '../../assets/chord_progression/progression_1_6_2_5.png'

const FIELD_INFO = {
    key: "The musical key determines the root note and scale for the composition (e.g., C Major, G Minor).",
    mode: "Major = happy/bright sound, Minor = sad/melancholic sound. Determines chord quality.",
    progression: "Chord sequence using scale degree numbers (e.g., 1-4-5 for I-IV-V). Numbers correspond to positions in the chosen scale. Example: In C Major, 1=C, 4=F, 5=G",
    time_sig: "Format: beats per measure/note value. Common: 4/4 (four quarter notes), 3/4 (waltz time)",
    tempo: "Speed of the music in beats per minute (BPM). Typical range: 60-200 BPM"
  };

const AddChordTab = () => {
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [respFile, setRespFile] = useState<File>();
    const [xmlFile, setXmlFile] = useState<string>();
    const [progression, setProgression] = useState('1,2,5,3');
    const [formData, setFormData] = useState({
        file: null,
        key: 'C',
        mode: 'Major',
        progression: progression,
        time_sig: '4,4',
        tempo: '90'
    });
    const [generatedMidi, setGeneratedMidi] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showHelp, setShowHelp] = useState<keyof typeof FIELD_INFO | null>(null);
    
    const chordProgressionOptions = ['1,2,5,3', '1,5,4,5', '3,6,2,5', '2,5,1', '1,6,2,5']
    const chordProgressionInfo = [
        progression_info1,
        progression_info2,
        progression_info3,
        progression_info4,
        progression_info5
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = new FormData();
            if (uploadFile) data.append('file', uploadFile);
            data.append('key', formData.key);
            data.append('mode', formData.mode);
            data.append('progression', formData.progression);
            data.append('time_sig', formData.time_sig);
            data.append('tempo', formData.tempo);

            api_add_chord(data).then((response) => {
                const blob = new Blob([response.data], { type: 'audio/midi' });
                const midiFile = new File([blob], `${uploadFile?.name}_added_chord.mid`, { type: 'audio/midi' });
                const url = URL.createObjectURL(blob);
                setRespFile(midiFile);
                setGeneratedMidi(url);
            });

        } catch (err) {
            setError('Failed to generate MIDI file. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProgressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setProgression(value);
        setFormData(prev => ({
            ...prev,
            progression: value
        }));
    }

    useEffect(() => {
        if (respFile) {
            const formData = new FormData();
            formData.append('midi', respFile);
            api_fileMidiToXml(formData).then((response) => {
                setXmlFile(response.data);
            }).catch((error) => {
                console.error('Error converting MIDI to XML:', error);
            });
        }
    }, [respFile]);

    const HelpButton = ({ field }: { field: keyof typeof FIELD_INFO }) => (
        <button
          type="button"
          className="btn btn-info btn-sm ms-2"
          style={{ boxShadow: 'none' }}
          onClick={() => setShowHelp(field)}
          aria-label="Show help"
        >
          Info
        </button>
      );

    return (
        <div className="container py-5">
        <div className="card shadow">
          <div className="card-body p-4">
            <h1 className="card-title mb-4">Add Chord Progression</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-4">
                {/* MIDI File Upload */}
                <div className="col-12">
                  <label className="form-label">MIDI File (Optional)</label>
                  <input 
                    type="file"
                    onChange={handleFileChange}
                    accept=".mid,.midi"
                    className="form-control"
                  />
                </div>
  
                {/* Chord Progression Options */}
                <div className="col-12">
                  <label className="form-label">Default Progression Options</label>
                  <div className="d-flex flex-wrap gap-2">
                    {chordProgressionOptions.map((option, index) => (
                      <div key={index} className="form-check form-check-inline">
                        <input
                          type="radio"
                          name="progression"
                          value={option}
                          checked={formData.progression === option}
                          onChange={handleProgressionChange}
                          className="form-check-input"
                          id={`option-${index}`}
                        />
                        <label htmlFor={`option-${index}`} className="form-check-label">{option}</label>
                        <ChordProgressionInfoDialog
                          progressionIndex={index}
                          chordProgressionInfo={chordProgressionInfo}
                        />
                      </div>
                    ))}
                  </div>
                </div>
  
                {/* Key */}
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    Key
                    <HelpButton field="key" />
                  </label>
                  <select
                    name="key"
                    value={formData.key}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
  
                {/* Mode */}
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    Mode
                    <HelpButton field="mode" />
                  </label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>
  
                {/* Chord Progression */}
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    Chord Progression (comma separated)
                    <HelpButton field="progression" />
                  </label>
                  <input
                    type="text"
                    name="progression"
                    value={formData.progression}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
  
                {/* Time Signature */}
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    Time Signature (comma separated)
                    <HelpButton field="time_sig" />
                  </label>
                  <input
                    type="text"
                    name="time_sig"
                    value={formData.time_sig}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
  
                {/* Tempo */}
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    Tempo (BPM)
                    <HelpButton field="tempo" />
                  </label>
                  <input
                    type="number"
                    name="tempo"
                    value={formData.tempo}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </div>
  
              {/* Submit Button */}
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn btn-primary ${isLoading ? 'disabled' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Generating...
                    </>
                  ) : 'Generate MIDI'}
                </button>
              </div>
            </form>
  
            {/* Help Modal */}
            {showHelp && (
              <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Help Information</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowHelp(null)}
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      {FIELD_INFO[showHelp]}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowHelp(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
  
            {/* Error and Results sections remain the same */}
            {error && (
              <div className="alert alert-danger mt-4">
                {error}
              </div>
            )}
  
            {generatedMidi && (
              <div className="mt-4 p-4 bg-light rounded border">
                <h2 className="h5 mb-3">Your Generated MIDI</h2>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <a
                      href={generatedMidi}
                      download="chord_progression.mid"
                      className="btn btn-success"
                    >
                      Download MIDI
                    </a>
                  </div>
                  <div>
                    <Link to='/playing' className="btn btn-secondary mt-3" state={{respFile: respFile}}>Play Music</Link>
                  </div>
                </div>
                <RenderMusicSheet2 musicXML={xmlFile} cssProps={{top: 0}}/>
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

export default AddChordTab;