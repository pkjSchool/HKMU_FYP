import { NoteRender } from "./NoteRender.js"
import { SustainRender } from "./SustainRenderer.js"
// import { MarkerRenderer } from "./MarkerRenderer.js"
import { RenderDimensions } from "./RenderDimensions.js"
import { BackgroundRender } from "./BackgroundRender.js"
import { MeasureLinesRender } from "./MeasureLinesRender.js"
// import { ProgressBarRender } from "./ProgressBarRender.js"
import { getSetting, setSettingCallback } from "../settings/Settings.js"
import { isBlack } from "../Util.js"
import { getTrackColor, isTrackDrawn } from "../player/Tracks.js"
import { getPlayerState } from "../player/Player.js"
// import { InSongTextRenderer } from "./InSongTextRenderer.js"

const PROGRESS_BAR_CANVAS_HEIGHT = 20

export class Render {
	constructor(cnvBG, cnvMain, cnvForeground, wrapperEle) {
		this.cnvBG = cnvBG
		this.cnv = cnvMain
		// this.progressBarCanvas = progressBarCanvas
		this.cnvForeground = cnvForeground
		this.wrapperEle = wrapperEle

		this.renderDimensions = new RenderDimensions(this.wrapperEle)
		this.renderDimensions.registerResizeCallback(this.setupCanvases.bind(this))
		setSettingCallback("particleBlur", this.setCtxBlur.bind(this))

		this.setupCanvases()

		this.noteRender = new NoteRender(
			this.ctx,
			this.ctxForeground,
			this.renderDimensions
		)
		this.sustainRender = new SustainRender(this.ctx, this.renderDimensions)
		// this.markerRender = new MarkerRenderer(this.ctx, this.renderDimensions)
		// this.inSongTextRender = new InSongTextRenderer(
		// 	this.ctx,
		// 	this.renderDimensions
		// )

		this.measureLinesRender = new MeasureLinesRender(
			this.ctx,
			this.renderDimensions
		)

		// this.progressBarRender = new ProgressBarRender(
		// 	this.progressBarCtx,
		// 	this.renderDimensions
		// )

		this.backgroundRender = new BackgroundRender(
			this.ctxBG,
			this.renderDimensions
		)

		this.mouseX = 0
		this.mouseY = 0

		this.playerState = getPlayerState()

		this.showKeyNamesOnPianoWhite = getSetting("showKeyNamesOnPianoWhite")
		this.showKeyNamesOnPianoBlack = getSetting("showKeyNamesOnPianoBlack")
	}

	setCtxBlur() {
		let blurPx = parseInt(getSetting("particleBlur"))
		if (blurPx == 0) {
			this.ctxForeground.filter = "none"
		} else {
			this.ctxForeground.filter = "blur(" + blurPx + "px)"
		}
	}

	/**
	 * Main rendering function
	 */
	render(playerState) {
		this.playerState = playerState
		this.ctx.clearRect(
			0,
			0,
			this.renderDimensions.windowWidth,
			this.renderDimensions.windowHeight
		)
		this.ctxForeground.clearRect(
			0,
			0,
			this.renderDimensions.windowWidth,
			this.renderDimensions.windowHeight
		)

		if (
			this.showKeyNamesOnPianoWhite != getSetting("showKeyNamesOnPianoWhite") ||
			this.showKeyNamesOnPianoBlack != getSetting("showKeyNamesOnPianoBlack")
		) {
			this.showKeyNamesOnPianoWhite = getSetting("showKeyNamesOnPianoWhite")
			this.showKeyNamesOnPianoBlack = getSetting("showKeyNamesOnPianoBlack")
		}

		if (
			this.renderDimensions.pianoPositionY !=
			parseInt(getSetting("pianoPosition"))
		) {
			this.renderDimensions.pianoPositionY = parseInt(
				getSetting("pianoPosition")
			)
		}
		this.backgroundRender.renderIfColorsChanged()

		let renderInfosByTrackMap = this.getRenderInfoByTrackMap(playerState)
		let inputActiveRenderInfos = this.getInputActiveRenderInfos(playerState)
		let inputPlayedRenderInfos = this.getInputPlayedRenderInfos(playerState)
		const time = this.getRenderTime(playerState)
		const end = playerState.end
		if (!playerState.loading && playerState.song) {
			const measureLines = playerState.song
				? playerState.song.getMeasureLines()
				: []

			// this.progressBarRender.render(time, end, playerState.song.markers)
			this.measureLinesRender.render(time, measureLines)
			this.sustainRender.render(
				time,
				playerState.song.sustainsBySecond,
				playerState.song.sustainPeriods
			)

			let currentActiveNotes = this.noteRender.render(
				time,
				renderInfosByTrackMap,
				inputActiveRenderInfos,
				inputPlayedRenderInfos
			)

			this.recordEnteredNotes(playerState, currentActiveNotes)
			
			// this.markerRender.render(time, playerState.song.markers)
			// this.inSongTextRender.render(time, playerState.song.markers)
		}

		// if (getSetting("showBPM")) {
		// 	this.drawBPM(playerState)
		// }
	}

	getRenderTime(playerState) {
		return playerState.time + 0
	}
	getRenderInfoByTrackMap(playerState) {
		let renderInfoByTrackMap = {}
		if (playerState)
			if (playerState.song) {
				playerState.song.activeTracks.forEach((track, trackIndex) => {
					if (isTrackDrawn(trackIndex)) {
						renderInfoByTrackMap[trackIndex] = { black: [], white: [] }

						let time = this.getRenderTime(playerState)
						let firstSecondShown = Math.floor(
							time - this.renderDimensions.getSecondsDisplayedAfter() - 4
						)
						let lastSecondShown = Math.ceil(
							time + this.renderDimensions.getSecondsDisplayedBefore()
						)

						for (let i = firstSecondShown; i < lastSecondShown; i++) {
							if (track.notesBySeconds[i]) {
								track.notesBySeconds[i]
									// .filter(note => note.instrument != "percussion")
									.map(note => this.getNoteRenderInfo(note, time))
									.forEach(renderInfo =>
										renderInfo.isBlack
											? renderInfoByTrackMap[trackIndex].black.push(renderInfo)
											: renderInfoByTrackMap[trackIndex].white.push(renderInfo)
									)
							}
						}
					}
				})
			}
		return renderInfoByTrackMap
	}
	recordEnteredNotes(playerState, currentActiveNotes) {
		if (playerState)
			if (playerState.song) {
				playerState.song.activeTracks.forEach((track, trackIndex) => {
					if (isTrackDrawn(trackIndex)) {
						let time = this.getRenderTime(playerState)
						let firstSecondShown = Math.floor(
							time - this.renderDimensions.getSecondsDisplayedAfter() - 4
						)
						let lastSecondShown = Math.ceil(
							time + this.renderDimensions.getSecondsDisplayedBefore()
						)

						for (let i = firstSecondShown; i < lastSecondShown; i++) {
							if (track.notesBySeconds[i]) {
								track.notesBySeconds[i]
									.map(note => { 
										if (currentActiveNotes[note.id]) {
											note.isEntered = true
											// note.noteEnterStart = time
											// note.noteEnterEnd
										}
									})
							}
						}
					}
				})
			}
	}
	getInputActiveRenderInfos(playerState) {
		let inputRenderInfos = []
		for (let key in playerState.inputActiveNotes) {
			let activeInputNote = playerState.inputActiveNotes[key]

			let time = this.getRenderTime(playerState)

			inputRenderInfos.push(
				this.getNoteRenderInfo(
					{
						timestamp: activeInputNote.timestamp,
						noteNumber: activeInputNote.noteNumber,
						offTime: time * 1000,
						duration: playerState.ctxTime * 1000 - activeInputNote.timestamp,
						velocity: 127,
						fillStyle: getSetting("inputNoteColor")
					},
					time
				)
			)
		}
		return inputRenderInfos
	}
	getInputPlayedRenderInfos(playerState) {
		let inputRenderInfos = []
		for (let key in playerState.inputPlayedNotes) {
			let playedInputNote = playerState.inputPlayedNotes[key]
			// if(key==0){ console.log(playerState.ctxTime * 1000 - playedInputNote.timestamp) }

			let time = this.getRenderTime(playerState)

			inputRenderInfos.push(
				this.getNoteRenderInfo(
					{
						timestamp: playedInputNote.timestamp,
						noteNumber: playedInputNote.noteNumber,
						offTime: playedInputNote.offTime,
						duration: playerState.ctxTime * 1000 + playedInputNote.timestamp,
						velocity: 127,
						fillStyle: getSetting("inputNoteColor")
					},
					time
				)
			)
		}
		return inputRenderInfos
	}
	getNoteRenderInfo(note, time) {
		time *= 1000
		let noteDims = this.renderDimensions.getNoteDimensions(
			note.noteNumber,
			time,
			note.timestamp,
			note.offTime,
			note.sustainOffTime
		)
		let isOn = note.timestamp < time && note.offTime > time ? 1 : 0
		let elapsedTime = Math.max(0, time - note.timestamp)
		let noteDoneRatio = elapsedTime / note.duration

		let isKeyBlack = isBlack(note.noteNumber)
		//TODO Clean up. Right now it returns more info than necessary to use in DebugRender..
		return {
			noteNumber: note.noteNumber,
			timestamp: note.timestamp,
			offTime: note.offTime,
			duration: note.duration,
			instrument: note.instrument,
			track: note.track,
			channel: note.channel,
			fillStyle: note.fillStyle
				? note.fillStyle
				: isKeyBlack
				? getTrackColor(note.track).black
				: getTrackColor(note.track).white,
			currentTime: time,
			isBlack: isKeyBlack,
			noteDims: noteDims,
			isOn: isOn,
			noteDoneRatio: noteDoneRatio,
			rad: noteDims.rad,
			x: noteDims.x + 1,
			y: noteDims.y,
			w: noteDims.w - 2,
			h: noteDims.h,
			sustainH: noteDims.sustainH,
			sustainY: noteDims.sustainY,
			velocity: note.velocity,
			noteId: note.id,
			noteEntered: note.isEntered,
			noteEnterStart: note.noteEnterStart,
			noteEnterEnd: note.noteEnterEnd
		}
	}

	// drawBPM(playerState) {
	// 	this.ctx.font = "20px Arial black"
	// 	this.ctx.fillStyle = "rgba(255,255,255,0.8)"
	// 	this.ctx.textBaseline = "top"
	// 	this.ctx.fillText(
	// 		Math.round(playerState.bpm) + " BPM",
	// 		20,
	// 		this.renderDimensions.menuHeight + PROGRESS_BAR_CANVAS_HEIGHT + 12
	// 	)
	// }

	setCanvasSize(cnv, width, height) {
		if (cnv.width != width) {
			cnv.width = width
		}
		if (cnv.height != height) {
			cnv.height = height
		}
	}

	setupCanvases() {
		this.setCanvasSize(
			this.getBgCanvas(),
			this.renderDimensions.windowWidth,
			this.renderDimensions.windowHeight
		)

		this.setCanvasSize(
			this.getMainCanvas(),
			this.renderDimensions.windowWidth,
			this.renderDimensions.windowHeight
		)

		// this.setCanvasSize(
		// 	this.getProgressBarCanvas(),
		// 	this.renderDimensions.windowWidth,
		// 	PROGRESS_BAR_CANVAS_HEIGHT
		// )

		this.setCanvasSize(
			this.getForegroundCanvas(),
			this.renderDimensions.windowWidth,
			this.renderDimensions.windowHeight
		)

		// this.getProgressBarCanvas().style.height = PROGRESS_BAR_CANVAS_HEIGHT + "px"
		// this.getProgressBarCanvas().id = "progressBarCanvas"
		// this.getForegroundCanvas().style.zIndex = "101"

        this.ctxForeground = this.cnvForeground.getContext('2d');
        this.ctxBG = this.cnvBG.getContext('2d');
        this.ctx = this.cnv.getContext('2d');
        // this.progressBarCtx = this.progressBarCanvas.getContext('2d');

		this.setCtxBlur()
	}
	getBgCanvas() {
		return this.cnvBG
	}
	getMainCanvas() {
		return this.cnv
	}
	getForegroundCanvas() {
		return this.cnvForeground
	}

	// getProgressBarCanvas() {
	// 	return this.progressBarCanvas
	// }

	isNoteDrawn(note, tracks) {
		return !tracks[note.track] || !tracks[note.track].draw
	}

	isOnMainCanvas(position) {
		return (
			(position.x > this.renderDimensions.menuHeight &&
				position.y < this.renderDimensions.getAbsolutePianoPosition()) ||
			position.y >
				this.renderDimensions.getAbsolutePianoPosition() +
					this.renderDimensions.whiteKeyHeight
		)
	}

	getTimeFromHeight(height) {
		return (
			(height * this.renderDimensions.getNoteToHeightConst()) /
			(this.renderDimensions.windowHeight -
				this.renderDimensions.whiteKeyHeight) /
			1000
		)
	}
	onMenuHeightChanged(menuHeight) {
		this.renderDimensions.menuHeight = menuHeight
		// this.getProgressBarCanvas().style.top = menuHeight + "px"
		this.noteRender.setMenuHeight(menuHeight)
	}
}
