import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

import { api_fileMidiToXml, api_piano_transcribe } from '../../api_request/request';
import RenderMusicSheet2 from '../PianoPlayingPage/RenderMusicSheet2';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

const FormatConvertionTab = () => {
    const { t } = useTranslation();

    const [upLoadfile, setUploadFile] = useState<File | null>(null);
    const [respFile, setRespFile] = useState<File>();
    const [xmlFile, setXmlFile] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'audio/wav' || selectedFile.name.endsWith('.wav')) {
                setUploadFile(selectedFile);
                setError(null);
            } else {
                setError('Please upload a WAV file');
                setUploadFile(null);
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!upLoadfile) {
            setError('Please select a WAV file first');
            return;
        }

        setIsLoading(true);
        setError(null);
        setDownloadUrl(null);

        try {
            const formData = new FormData();
            formData.append('audio', upLoadfile);

            const response = await api_piano_transcribe(formData);
            const blob = new Blob([response.data], { type: 'audio/midi' });
            const midiFile = new File([blob], `${upLoadfile.name}.mid`, { type: 'audio/midi' });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            setRespFile(midiFile);
            
        } catch (err) {
            const error = err as AxiosError;
            const errorMessage = (error.response?.data as { message?: string })?.message || 'Conversion failed. Please try again.';
            setError(errorMessage);
            console.error('Conversion error:', error);
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
        <div className="">
            <div className="card shadow">
                <h1 className="card-header">{t("Wav to Midi Conversion")}</h1>
                <div className="card-body p-4">

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="audioFile" className="form-label">
                                {t("Upload WAV File")}
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
                                {t("Only WAV audio files are supported for conversion")}
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isLoading || !upLoadfile}
                            >
                                {isLoading ? (
                                    <>
                                        <span 
                                            className="spinner-border spinner-border-sm me-2" 
                                            role="status" 
                                            aria-hidden="true"
                                        ></span>
                                        {t("Converting...")}
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
                            <h2 className="h5 mb-3">{t("Conversion Complete")}</h2>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center gap-3">
                                    <a
                                        href={downloadUrl}
                                        download="converted_output.mid"
                                        className="btn btn-success"
                                    >
                                        {t("Download MIDI")}
                                    </a>
                                </div>
                                <div>
                                    <Link to='/playing' className="btn btn-secondary mt-3" state={{respFile: respFile}}>{t("Play Music")}</Link>
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

export default FormatConvertionTab;