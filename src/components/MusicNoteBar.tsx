import React, { useEffect, useRef } from 'react'

const MusicNoteBar = (props:any) => {
    const {music, ...setting} = props

    const draw = (ctx:any, count:any) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = 'grey'
        const delta = count % 800
        ctx.fillRect(10 + delta, 10, 100, 100)
    }

    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d');
        let count = 0
        let animeId = 0

        const renderer = () => {
            count++
            draw(context, count)
            animeId = window.requestAnimationFrame(renderer)
        }

        renderer()

        return () => {
            window.cancelAnimationFrame(animeId)
        }
    }
    , [])

  return (
    <canvas ref={canvasRef} {...setting} width="800" height="400"/>
  );
};

export default MusicNoteBar;
