import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Render } from "./MusicNotePlayer/Rendering/Render.js"
import { getPlayer, getPlayerState } from "./MusicNotePlayer/player/Player.js"
import { UI } from "./MusicNotePlayer/ui/UI.js"
import { InputListeners } from "./MusicNotePlayer/InputListeners.js"

const MusicNotePlayerRender = forwardRef((props:any, ref) => {
    const {music, ...setting} = props

    const foregroundCanvasRef = useRef(null)
    const bgCanvasRef = useRef(null)
    const mainCanvasRef = useRef(null)
    const progressBarCanvasRef = useRef(null)

    useImperativeHandle(ref, () => ({
        play,
        pause,
        stop
    }));

    const play = () => {
      getPlayer().startPlay()
    };

    const pause = () => {
      getPlayer().pause()
    };

    const stop = () => {
      getPlayer().stop()
    };

    useEffect(() => {
        const cnvForeground = foregroundCanvasRef.current
        const cnvBG = bgCanvasRef.current        
        const cnvMain = mainCanvasRef.current
        const progressBarCanvas = progressBarCanvasRef.current

        let animeId = 0

        const render = new Render(cnvBG, cnvMain, progressBarCanvas, cnvForeground)
        const ui = new UI(render)
        const listeners = new InputListeners(ui, render)
        const player = getPlayer()
        player.loadSong(music, "fileNameSpecific", "name")

        const renderer = () => {
          render.render(getPlayerState())
          animeId = window.requestAnimationFrame(renderer)
        }

        renderer()

        return () => {
            window.cancelAnimationFrame(animeId)
        }
    }
    , [])

  return (
    <>
      <canvas ref={bgCanvasRef} style={{backgroundColor: "black",position: "absolute",top: "0px",left: "0px"}}/>
      <canvas ref={mainCanvasRef} style={{position: "absolute",top: "0px",left: "0px"}}/>
      <canvas ref={progressBarCanvasRef} style={{position: "absolute",top: "0px",left: "0px"}}/>
      <canvas ref={foregroundCanvasRef} style={{position: "absolute",top: "0px",left: "0px"}}/>
    </>
  );
});

export default MusicNotePlayerRender;
