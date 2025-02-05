import React from "react";

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
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <video
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
    </div>
  );
};

export default VideoWithQuiz;
