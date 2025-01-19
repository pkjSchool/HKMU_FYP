import {useEffect, useState} from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import shine from "../assets/shine.mp3";

function playSound(audioContext: AudioContext, buffer: AudioBuffer) {
    const source = audioContext.createBufferSource();
    const g = audioContext.createGain();
    source.buffer = buffer;
    // source.start(0);
    // g.gain.value = 0.5;
    // source.connect(g);
    // g.connect(audioContext.destination);

    source.connect(audioContext.destination);
    source.start();
}

function processStar() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    var request = new XMLHttpRequest();
    
    request.open('GET', shine, true);
    
    request.responseType = 'arraybuffer';
    
    request.onload = function() {
      audioContext.decodeAudioData(request.response, function(theBuffer) {
        playSound(audioContext, theBuffer);
      });
    }
    request.send();
}

const PianoPlayingResult = (props:any) => {
    const {againCallback, result} = props;
    
    useEffect(()=>{
        setTimeout(()=>{
            processStar()
        }, 500)
    }, [])

    const onClickAgain = () => {
        (againCallback)?againCallback():null
    }

    const getResultData = (label:string) => {
        return result?result[label]:null
    }

    return (
        <div style={boxWrapper}>
            <div style={boxOverlay}></div>
            <div className="animate__animated animate__fadeIn animate__faster" style={boxContainer}>
                
                <div style={contextWrapper}>
                    
                    <h2 className="text-center fw-bold">{getResultData("name")}</h2>

                    <div className="mt-3 mb-3" style={starWrapper}>
                        <IoStar className={starAnime} style={{...starSmall, ...starOrder1}} />
                        <IoStar className={starAnime} style={{...starBig, ...starOrder2}} />
                        <IoStar className={starAnime} style={{...starSmall, ...starOrder3}} />
                    </div>

                    <div style={starScore}>{getResultData("score")}</div>

                    <div className="row mt-3" style={itemRow}>
                        <div className="col-6" style={itemWrapper}>
                            <div  style={itemLabel}>Music Long</div>
                            <div  style={itemText}>{getResultData("musicTime")}</div>
                        </div>
                        <div className="col-6" style={itemWrapper}>
                            <div  style={itemLabel}>Play Time</div>
                            <div  style={itemText}>{getResultData("playTime")}</div>
                        </div>
                    </div>

                    <div className="row mt-3" style={itemRow}>
                        <div className="col-6" style={itemWrapper}>
                            <div  style={itemLabel}>Accuracy</div>
                            <div  style={itemText}>{getResultData("accuracy")}%</div>
                        </div>
                    </div>

                    <div className="pt-5 text-center">
                        <button type="button" className="btn btn-success text-center" style={{padding: "10px 60px", margin:"0 5px"}} onClick={onClickAgain}>Again</button>
                        <NavLink to="/" className="btn btn-danger text-center" style={{padding: "10px 60px", margin:"0 5px"}}>Back</NavLink>
                    </div>

                </div>

            </div>
        </div>
    )
}

const starScore:object = {fontWeight:"700", fontSize: "60px", textAlign:"center", margin:"20px 0"}

const itemRow:object = {maxWidth:"400px", marginLeft:"auto", marginRight:"auto"}

const itemWrapper:object = {textAlign:"center"}

const itemLabel:object = {fontWeight:"700", fontSize: "20px"}

const itemText:object = {fontWeight:"400", fontSize: "20px"}

const contextWrapper:object = {background: '#c29ffa', padding: "40px"}

const boxWrapper:object = {position: "fixed", top:0, left:0,right:0,bottom:0, zIndex:9999, padding: "50px", display: "flex", justifyContent:"center", alignItems:"center"}

const boxOverlay:object = {position:"absolute", top:0, left:0, right:0, bottom:0, backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex:0}

const boxContainer:object = {borderRadius: "20px", height: 'auto', maxHeight: "100%", width: '100%', maxWidth: "900px", overflow: 'hidden', background: '#FFF', zIndex: 1, overflowY:"auto" }

const starOrder1 = { animationDelay: "0.5s" }

const starOrder2 = { animationDelay: "0.8s" }

const starOrder3 = { animationDelay: "1.1s" }

const starWrapper:object = { display:"flex", justifyContent:"center", alignItems:"baseline" }

const starSmall = {
    fontSize:"60px",
    color: "var(--bs-warning)"
}
const starBig = {
    fontSize:"80px",
    color: "var(--bs-warning)"  
}

const starAnime = "animate__animated animate__zoomIn animate__faster"

export default PianoPlayingResult;