import { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';

import { api_piano_transcribe } from '../../api_request/request';

const FormatConvertionTab = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'audio/wav' || selectedFile.name.endsWith('.wav')) {
                setFile(selectedFile);
                setError(null);
            } else {
                setError('Please upload a WAV file');
                setFile(null);
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!file) {
            setError('Please select a WAV file first');
            return;
        }

        setIsLoading(true);
        setError(null);
        setDownloadUrl(null);

        try {
            const formData = new FormData();
            formData.append('audio', file);

            const response = await api_piano_transcribe(formData);
            const blob = new Blob([response.data], { type: 'audio/midi' });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            
        } catch (err) {
            const error = err as AxiosError;
            const errorMessage = (error.response?.data as { message?: string })?.message || 'Conversion failed. Please try again.';
            setError(errorMessage);
            console.error('Conversion error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="card shadow">
                <div className="card-body p-4">
                    <h1 className="card-title mb-4">Audio Format Conversion</h1>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="audioFile" className="form-label">
                                Upload WAV File
                            </label>
                            <input
                                type="file"
                                id="audioFile"
                                onChange={handleFileChange}
                                accept=".wav,audio/wav"
                                className="form-control"
                                disabled={isLoading}
                            />
                            <div className="form-text">
                                Only WAV audio files are supported for conversion
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isLoading || !file}
                            >
                                {isLoading ? (
                                    <>
                                        <span 
                                            className="spinner-border spinner-border-sm me-2" 
                                            role="status" 
                                            aria-hidden="true"
                                        ></span>
                                        Converting...
                                    </>
                                ) : 'Convert to MIDI'}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="alert alert-danger mt-4">
                            {error}
                        </div>
                    )}

                    {downloadUrl && (
                        <div className="mt-4 p-4 bg-light rounded border">
                            <h2 className="h5 mb-3">Conversion Complete</h2>
                            <div className="d-flex align-items-center gap-3">
                                <a
                                    href={downloadUrl}
                                    download="converted_output.mid"
                                    className="btn btn-success"
                                >
                                    Download MIDI
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormatConvertionTab;