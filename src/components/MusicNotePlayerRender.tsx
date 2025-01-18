import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Render } from "./MusicNotePlayer/Rendering/Render.js"
import { getPlayer, getPlayerState } from "./MusicNotePlayer/player/Player.js"
import { UI } from "./MusicNotePlayer/ui/UI.js"
import { InputListeners } from "./MusicNotePlayer/InputListeners.js"

// const MusicNotePlayerRender = forwardRef((props:any, ref) => {
//     const {music, ...setting} = props

//     const [menuHeight, setMenuHeight] = useState(0);

//     const foregroundCanvasRef = useRef(null)
//     const bgCanvasRef = useRef(null)
//     const mainCanvasRef = useRef(null)
//     const progressBarCanvasRef = useRef(null)
//     const wrapperRef = useRef(null)

//     useImperativeHandle(ref, () => ({
//         play,
//         pause,
//         stop,
//         changeMenuHeight
//     }));

//     const play = () => {
//       getPlayer().startPlay()
//     };

//     const pause = () => {
//       getPlayer().pause()
//     };

//     const stop = () => {
//       getPlayer().stop()
//     };

//     const changeMenuHeight = (h:number) => {
//       setMenuHeight(h)
//     };

//     useEffect(() => {
//         const wrapperEle = wrapperRef.current

//         const cnvForeground = foregroundCanvasRef.current
//         const cnvBG = bgCanvasRef.current
//         const cnvMain = mainCanvasRef.current
//         const progressBarCanvas = progressBarCanvasRef.current

//         let animeId = 0

//         const render = new Render(cnvBG, cnvMain, progressBarCanvas, cnvForeground, wrapperEle)
//         const ui = new UI(render)
//         const listeners = new InputListeners(ui, render, wrapperEle)
//         const player = getPlayer()
//         player.loadSong(music, "fileNameSpecific", "name")

//         const renderer = () => {
//           render.render(getPlayerState())
//           animeId = window.requestAnimationFrame(renderer)
//         }

//         renderer()

//         return () => {
//             window.cancelAnimationFrame(animeId)
//         }
//     }
//     , [])

//   return (
//     <div ref={wrapperRef} style={{position: "relative",height: "100%", width: "100%"}}>
//       <canvas ref={bgCanvasRef} style={{backgroundColor: "black",position: "absolute",top: "0px",left: "0px",zIndex: -5}}/>
//       <canvas ref={mainCanvasRef} style={{position: "absolute",top: "0px",left: "0px",zIndex: -5}}/>
//       <canvas ref={progressBarCanvasRef} style={{...progressBarCanvas, position: "absolute", top: "0px", left: "0px", zIndex: 0}}/>
//       <canvas ref={foregroundCanvasRef} style={{position: "absolute",top: "0px",left: "0px",zIndex: -5}}/>
//     </div>
//   );
// });

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

  constructor(props: any) {
    super(props);

    this.state = {
      menuHeight: 0,
    };

    this.animeId = 0;

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
      <div ref={this.wrapperRef} style={{position: "relative",height: "100%", width: "100%"}}>
        <canvas ref={this.bgCanvasRef} style={{backgroundColor: "black",position: "absolute",top: "0px",left: "0px",zIndex: -5}}/>
        <canvas ref={this.mainCanvasRef} style={{position: "absolute",top: "0px",left: "0px",zIndex: -5}}/>
        <canvas ref={this.progressBarCanvasRef} style={{...progressBarCanvas, position: "absolute", top: "0px", left: "0px", zIndex: 0}}/>
        <canvas ref={this.foregroundCanvasRef} style={{position: "absolute",top: "0px",left: "0px",zIndex: -5}}/>
      </div>
    );
  }
}


export default MusicNotePlayerRender;
