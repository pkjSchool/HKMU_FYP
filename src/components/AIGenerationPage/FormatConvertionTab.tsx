import { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import axios, { AxiosError } from 'axios';

import { api_fileMidiToXml, api_piano_transcribe } from '../../api_request/request';
import RenderMusicSheet2, { RenderMusicSheetRef } from '../PianoPlayingPage/RenderMusicSheet2';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { formatTime } from "../../util/utils";

import { FaPlay, FaPause, FaStop } from "react-icons/fa";

import { Player, getPlayer } from "../MusicNotePlayer/player/Player.js";

const FormatConvertionTab = () => {
    const { t } = useTranslation();

    const progressBarReadonly = false;

    const [upLoadfile, setUploadFile] = useState<File | null>(null);
    const [respFile, setRespFile] = useState<File>();
    const [xmlFile, setXmlFile] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [valBpm, setValBpm] = useState<number>(0);
    const [valPrePlay, setValPrePlay] = useState<number>(-2);
    const [valProgress, setValProgress] = useState<number>(0);
    const [valSongEndSecond, setValSongEndSecond] = useState<number>(0);
    const [valSongCurSecond, setValSongCurSecond] = useState<number>(0);

    const musicSheetRenderRef = useRef<RenderMusicSheetRef>(null);

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

    const togglePlay = () => {
        if(getIsPlaying()) {
            handlePause()
        } else {
            handlePlay()
        }
    };
    
    const getIsPlaying = () => {
        return getPlayer().isPlaying()
    };
    const handlePlay = () => {
        getPlayer().startPlay();
        setIsPlaying(true)
    };
    const handlePause = () => {
        getPlayer().pause();
        setIsPlaying(false)
    };
    const handleStop = () => {
        getPlayer().stop();
        setIsPlaying(false)
    };
    const handleFinish = () => {
        setIsPlaying(false)
      };

    const onPlayerTimeUpdated = (time: number, end: number, bpm: number) => {
        // setValProgress((time / (end / 1000 / 100)));
        setValProgress(time);
        setValSongCurSecond(time);
        setValSongEndSecond(end / 1000);
        setValBpm(bpm);
    };

    const progressChanged = (progress: number) => {
        handlePause();
        setValProgress(progress);
        getPlayer().setTime(progress);
    };

    useEffect(() => {
        if (respFile) {
            getPlayer().loadSong(respFile, "fileName", "fileName");

            const formData = new FormData();
            formData.append('midi', respFile);
            api_fileMidiToXml(formData).then((response) => {
                setXmlFile(response.data);
            }).catch((error) => {
                console.error('Error converting MIDI to XML:', error);
            });
        }
    }, [respFile]);

    useEffect(() => {
        getPlayer().setHaveNodeVoice(true)
        getPlayer().setHaveBeatVoice(false)
        getPlayer().setHaveStartDelay(false)
  
        getPlayer().addFinishListener(() => {
          handleFinish();
        });
        
        getPlayer().addTimeUpdatedListener((time: number, end: number, bpm: number)=>{
          musicSheetRenderRef.current?.cursorMoveTo(time * 1000, bpm)
        });
        getPlayer().addTimeUpdatedListener(onPlayerTimeUpdated);
  
        setValPrePlay(getPlayer().startDelay)
    
        return () => {
          getPlayer().setHaveNodeVoice(false)
          getPlayer().setHaveBeatVoice(true)
          getPlayer().setHaveStartDelay(true)
  
          getPlayer().pause();
          getPlayer().clearFinishListener();
          getPlayer().clearTimeUpdatedListener();
          getPlayer().clearNewSongCallback();
          getPlayer().clearSong();
        };
      }, []);

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
                                    <a href={downloadUrl} download="converted_output.mid" className="btn btn-success">{t("Download MIDI")}</a>
                                    <Link to='/playing' className="btn btn-secondary" state={{respFile: respFile}}>{t("Play Music")}</Link>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <button onClick={togglePlay}>{isPlaying?<FaPause/>:<FaPlay/>}</button>
                                    <button onClick={handleStop}><FaStop/></button>
                                </div>
                            </div>
                            <div style={progressBarStyles}>
                                <input
                                type="range"
                                className="musicProgressBar"
                                name="valPrograss"
                                min={valPrePlay}
                                max={valSongEndSecond}
                                step="0.01"
                                value={valProgress}
                                disabled={progressBarReadonly}
                                onChange={(e) => {
                                    progressChanged(parseFloat(e.target.value));
                                }}
                                />
                            </div>
                            <div style={statusBarStyles}>
                                <div>{formatTime(valSongCurSecond)} / {formatTime(valSongEndSecond)} | {valBpm} BPM</div>
                            </div>
                            <RenderMusicSheet2 ref={musicSheetRenderRef} musicXML={xmlFile} cssProps={{top: 0}} singleHorizontalStaffline={false}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const progressBarStyles: Object = {
    backgroundColor: "#757575",
    padding: "10px 20px",
  };
  
  const statusBarStyles: Object = {
    background: "Black",
    color: "white",
    padding: "0 20px",
  };

export default FormatConvertionTab;