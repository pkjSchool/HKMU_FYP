import { useEffect, useState } from 'react';

import { api_add_chord } from '../../api_request/request';
import RenderMusicSheet2 from '../PianoPlayingPage/RenderMusicSheet2';

import { api_fileMidiToXml } from '../../api_request/request';
import { Link } from 'react-router-dom';

const AddChordTab = () => {
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [respFile, setRespFile] = useState<File>();
    const [xmlFile, setXmlFile] = useState<string>();
    const [formData, setFormData] = useState({
        file: null,
        key: 'C',
        mode: 'Major',
        progression: '2,5,1,6',
        time_sig: '4,4',
        tempo: '90'
    });
    const [generatedMidi, setGeneratedMidi] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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

                            {/* Key */}
                            <div className="col-md-6">
                                <label className="form-label">Key</label>
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
                                <label className="form-label">Mode</label>
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
                                <label className="form-label">Chord Progression (comma separated)</label>
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
                                <label className="form-label">Time Signature (comma separated)</label>
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
                                <label className="form-label">Tempo (BPM)</label>
                                <input
                                    type="number"
                                    name="tempo"
                                    value={formData.tempo}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

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