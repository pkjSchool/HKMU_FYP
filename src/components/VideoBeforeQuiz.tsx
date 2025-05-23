import React, { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

interface VideoWithQuizProps {
  videoSrc: string; 
  onVideoEnd: () => void; 
  autoPlay?: boolean; 
  controls?: boolean; 
}

const VideoWithQuiz: React.FC<VideoWithQuizProps> = ({
  videoSrc,
  onVideoEnd,
  autoPlay = true,
  controls = true,
}) => {

  const { t } = useTranslation();
  const vdoRef = useRef<HTMLVideoElement>(null);
  const [playTime, setPlayTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [vdoPlay, setVdoPlay] = useState<boolean>(false);

  const vdoPause = () => {
    if(vdoRef.current) {
      if(vdoRef.current.paused) {
        vdoRef.current.play();
        setVdoPlay(true)
      } else {
        vdoRef.current.pause();
        setVdoPlay(false)
      }
    }
  }

  useEffect(() => {
    if(vdoRef.current) {
      setVdoPlay(autoPlay)

      vdoRef.current.onloadeddata = function() {
        if(vdoRef.current){
          setPlayTime(parseInt(vdoRef.current.currentTime))
          setTotalTime(parseInt(vdoRef.current.duration))
        }
      };

      vdoRef.current.addEventListener("timeupdate", () => {
        if(vdoRef.current){
          setPlayTime(parseInt(vdoRef.current.currentTime))
          setTotalTime(parseInt(vdoRef.current.duration))
        }
      })
    }
  }, [])

  return (
    <div className="d-flex justify-content-center align-items-center flex-column vh-100 bg-dark">
      <video
        ref={vdoRef}
        src={videoSrc}
        controls={controls}
        autoPlay={autoPlay}
        onEnded={onVideoEnd} 
        style={{
          maxWidth: "80%",
          maxHeight: "80%",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      />
      <div className="progress mt-3" role="progressbar" style={{"width": "80%"}}>
        <div className="progress-bar" style={{width: `${(playTime/totalTime)*100}%`, backgroundColor:"var(--bs-warning)"}}></div>
      </div>
      <div className="row mt-3" style={{"width": "80%"}}>
        <div className="col-6" style={{"color": "#FFF"}}>
          {playTime} / {totalTime}(s)
        </div>

        <div className="col-6 text-end">
          <button onClick={vdoPause}>{vdoPlay?<FaPause/>:<FaPlay/>}</button>
          <button className="ms-3" onClick={onVideoEnd}>{t("skip")}</button>
        </div>
      </div>
    </div>
  );
};

export default VideoWithQuiz;
