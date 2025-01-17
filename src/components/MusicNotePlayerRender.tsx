import React, { useEffect, useRef } from 'react'
import { Render } from "./MusicNotePlayer/Rendering/Render.js"
import { getPlayer, getPlayerState } from "./MusicNotePlayer/player/Player.js"
import { UI } from "./MusicNotePlayer/ui/UI.js"
import { InputListeners } from "./MusicNotePlayer/InputListeners.js"

const MusicNotePlayerRender = (props:any) => {
    const {music, ...setting} = props

    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d');
        let animeId = 0

        const render = new Render()
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
    <canvas ref={canvasRef} {...setting} width="800" height="1"/>
  );
};

export default MusicNotePlayerRender;
