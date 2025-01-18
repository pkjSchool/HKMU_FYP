import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Render } from "./MusicNotePlayer/Rendering/Render.js"
import { getPlayer, getPlayerState } from "./MusicNotePlayer/player/Player.js"
import { UI } from "./MusicNotePlayer/ui/UI.js"
import { InputListeners } from "./MusicNotePlayer/InputListeners.js"

const progressBarCanvas: Object = {
  transition: "all 0.4s ease-out",
  backgroundColor: "#757575",
  boxSizing: "border-box",
  borderBottom: "4px solid #616161",
  float: "left",
  cursor: "pointer",
}

class MusicNotePlayerRender extends React.Component<any, any> {
  foregroundCanvasRef: React.RefObject<HTMLCanvasElement>;
  bgCanvasRef: React.RefObject<HTMLCanvasElement>;
  mainCanvasRef: React.RefObject<HTMLCanvasElement>;
  progressBarCanvasRef: React.RefObject<HTMLCanvasElement>;
  wrapperRef: React.RefObject<HTMLDivElement>;
  animeId: number;
  cnvrender: Render;
  ui: UI;
  listeners: InputListeners;
  noteNumberOffset: number;

  constructor(props: any) {
    super(props);

    this.state = {
      menuHeight: 0,
    };

    this.animeId = 0;
    this.noteNumberOffset = -21;

    this.foregroundCanvasRef = React.createRef();
    this.bgCanvasRef = React.createRef();
    this.mainCanvasRef = React.createRef();
    this.progressBarCanvasRef = React.createRef();
    this.wrapperRef = React.createRef();

    // this.handleToggleClick = this.handleToggleClick.bind(this);
    // this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  play = () => {
    getPlayer().startPlay()
  };

  pause = () => {
    getPlayer().pause()
  };

  stop = () => {
    getPlayer().stop()
  };

  changeMenuHeight = (h:number) => {
    this.setState({menuHeight: h})
    this.cnvrender.onMenuHeightChanged(h)
  };

  onNotePress = (note:number) => {
    getPlayer().addInputNoteOn(note+this.noteNumberOffset)
  }

  onNoteRelease = (note:number) => {
    getPlayer().addInputNoteOff(note+this.noteNumberOffset)
  }

  componentDidMount() {

      const wrapperEle = this.wrapperRef.current

      const cnvForeground = this.foregroundCanvasRef.current
      const cnvBG = this.bgCanvasRef.current
      const cnvMain = this.mainCanvasRef.current
      const progressBarCanvas = this.progressBarCanvasRef.current

      this.animeId = 0;

      this.cnvrender = new Render(cnvBG, cnvMain, progressBarCanvas, cnvForeground, wrapperEle)
      this.ui = new UI(this.cnvrender)
      this.listeners = new InputListeners(this.ui, this.cnvrender, wrapperEle)
      const player = getPlayer()
      player.loadSong(this.props.music, "fileNameSpecific", "name")

      const renderer = () => {
        this.cnvrender.render(getPlayerState())
        this.animeId = window.requestAnimationFrame(renderer)
      }

      renderer()
  }
  componentWillUnmount() {
    window.cancelAnimationFrame(this.animeId)
  }

  render() {
    const progressBarCanvas: Object = {
      transition: "all 0.3s ease",
      backgroundColor: "#757575",
      boxSizing: "border-box",
      borderBottom: "4px solid #616161",
      float: "left",
      cursor: "pointer",
    }

    return (
      <div ref={this.wrapperRef} style={{position: "relative",height: "100%", width: "100%",zIndex: 0}}>
        <canvas ref={this.bgCanvasRef} style={{backgroundColor: "black",position: "absolute",top: "0px",left: "0px",zIndex: -5, pointerEvents: "none"}}/>
        <canvas ref={this.mainCanvasRef} style={{position: "absolute",top: "0px",left: "0px",zIndex: -5, pointerEvents: "none"}}/>
        <canvas ref={this.progressBarCanvasRef} style={{...progressBarCanvas, position: "absolute", top: "0px", left: "0px", zIndex: 0}}/>
        <canvas ref={this.foregroundCanvasRef} style={{position: "absolute",top: "0px",left: "0px",zIndex: -5, pointerEvents: "none"}}/>
      </div>
    );
  }
}


export default MusicNotePlayerRender;
