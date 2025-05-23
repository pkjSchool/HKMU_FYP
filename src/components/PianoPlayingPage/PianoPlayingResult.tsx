import {useEffect, useState} from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import shine from "../../assets/shine.mp3";

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
    const { t } = useTranslation();
    const {againCallback, handleOpenResultDetail, result} = props;
    
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

    const divisionHandle = (number1:number, number2:number) => {
        if (number1 == 0 && number2 == 0) return (0).toFixed(2)
        return (number1 / number2 * 100).toFixed(2)
    }

    const onClickDetail = () => {
        (handleOpenResultDetail)?handleOpenResultDetail():null
    }

    const calcStarNumber = (score:number, totalNote:number) => {
        const max_score = totalNote
        const score_per = score / max_score
        if (score_per <= 0.33){
            return 1
        } else if(score_per <= 0.66) {
            return 2
        } else {
            return 3
        }
    }

    const getResultStar = (score:number, totalNote:number) => {
        const starsNumber = calcStarNumber(score, totalNote)
        switch (starsNumber) {
        case 2:
            return <>
            <IoStar className={starAnime} style={{...starSmall, ...starOrder1}} />
            <IoStarOutline className={starAnime} style={{...starBig, ...starOrder2}} />
            <IoStar className={starAnime} style={{...starSmall, ...starOrder3}} />
            </>
            break;
        case 3:
            return <>
                <IoStar className={starAnime} style={{...starSmall, ...starOrder1}} />
                <IoStar className={starAnime} style={{...starBig, ...starOrder2}} />
                <IoStar className={starAnime} style={{...starSmall, ...starOrder3}} />
            </>
            break;
        default:
            return <>
            <IoStar className={starAnime} style={{...starSmall, ...starOrder1}} />
            <IoStarOutline className={starAnime} style={{...starBig, ...starOrder2}} />
            <IoStarOutline className={starAnime} style={{...starSmall, ...starOrder3}} />
            </>
            break;
        }
    }

    return (
        <div style={boxWrapper}>
            <div style={boxOverlay}></div>
            <div className="animate__animated animate__fadeIn animate__faster" style={boxContainer}>
                
                <div style={contextWrapper}>
                    
                    <h2 className="text-center fw-bold">{getResultData("name")}</h2>

                    <div className="mt-3 mb-3" style={starWrapper}>
                        { getResultStar(getResultData("noteEntered"), getResultData("totalNote")) }
                    </div>

                    <div style={starScore}>{getResultData("score")}</div>

                    <div className="row mt-3" style={itemRow}>
                        <div className="col-6" style={itemWrapper}>
                            <div style={itemLabel}>{t("music_long")}</div>
                            <div style={itemText}>{getResultData("musicTime")}</div>
                        </div>
                        <div className="col-6" style={itemWrapper}>
                            <div style={itemLabel}>{t("note_played")}</div>
                            <div style={itemText}>{getResultData("playTime")}</div>
                        </div>
                    </div>

                    <div className="row mt-3" style={itemRow}>
                        <div className="col-12" style={itemWrapper}>
                            <div style={itemLabel}>{t("note_played")}</div>
                            <div style={itemText}>{divisionHandle(getResultData("noteEntered"), getResultData("totalNote"))}%</div>
                            <div style={itemText}>{getResultData("noteEntered")} / {getResultData("totalNote")}</div>
                        </div>
                        {/* <div className="col-6" style={itemWrapper}>
                            <div style={itemLabel}>Accurate Input</div>
                            <div style={itemText}>{divisionHandle(getResultData("inputOnRange"), getResultData("noteEntered"))}%</div>
                            <div style={itemText}>{getResultData("inputOnRange")} / {getResultData("noteEntered")}</div>
                        </div> */}
                    </div>

                    <div className="pt-5 text-center">
                        <button type="button" className="btn btn-warning text-center" style={{padding: "10px 60px", margin:"0 5px"}} onClick={onClickDetail}>{t("detail")}</button>
                    </div>

                    <div className="pt-5 text-center">
                        <button type="button" className="btn btn-success text-center" style={{padding: "10px 60px", margin:"0 5px"}} onClick={onClickAgain}>{t("again")}</button>
                        <NavLink to="/" className="btn btn-danger text-center" style={{padding: "10px 60px", margin:"0 5px"}}>{t("back")}</NavLink>
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