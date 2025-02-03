import React from 'react'
import { Render } from "./MusicNotePlayer/Rendering/Render.js"
import { Player, getPlayer } from "./MusicNotePlayer/player/Player.js"

class MusicNotePlayerRender extends React.Component<any, any> {
  foregroundCanvasRef: React.RefObject<HTMLCanvasElement>;
  bgCanvasRef: React.RefObject<HTMLCanvasElement>;
  mainCanvasRef: React.RefObject<HTMLCanvasElement>;
  wrapperRef: React.RefObject<HTMLDivElement>;
  animeId: number;
  cnvrender: Render;
  player: Player;
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
    this.wrapperRef = React.createRef();

    // this.handleToggleClick = this.handleToggleClick.bind(this);
    // this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  play = () => {
    this.player.startPlay()
  };

  pause = () => {
    this.player.pause()
  };

  stop = () => {
    this.player.stop()
  };

  changeMenuHeight = (h:number) => {
    this.setState({menuHeight: h})
    this.cnvrender.onMenuHeightChanged(h)
  };

  onNotePress = (note:number) => {
    this.player.addInputNoteOn(note + this.noteNumberOffset)
  }

  onNoteRelease = (note:number) => {
    this.player.addInputNoteOff(note + this.noteNumberOffset)
  }

  componentDidMount() {

      const wrapperEle = this.wrapperRef.current

      const cnvForeground = this.foregroundCanvasRef.current
      const cnvBG = this.bgCanvasRef.current
      const cnvMain = this.mainCanvasRef.current

      this.animeId = 0;

      this.player = getPlayer()
      this.cnvrender = new Render(cnvBG, cnvMain, cnvForeground, wrapperEle, this.player)

      this.player.loadSong(this.props.music, "fileName.midi", "name")

      const renderer = () => {
        this.cnvrender.render(this.player.getPlayerState())
        this.animeId = window.requestAnimationFrame(renderer)
      }

      renderer()
  }
  componentWillUnmount() {
    window.cancelAnimationFrame(this.animeId)
  }

  render() {
    return (
      <div ref={this.wrapperRef} style={{position: "relative",height: "100%", width: "100%",zIndex: 0}}>
        <canvas ref={this.bgCanvasRef} style={{backgroundColor: "black",position: "absolute",top: "0px",left: "0px",zIndex: -5, pointerEvents: "none"}}/>
        <canvas ref={this.mainCanvasRef} style={{position: "absolute",top: "0px",left: "0px",zIndex: -5, pointerEvents: "none"}}/>
        <canvas ref={this.foregroundCanvasRef} style={{position: "absolute",top: "0px",left: "0px",zIndex: -5, pointerEvents: "none"}}/>
      </div>
    );
  }
}


export default MusicNotePlayerRender;
