import { NoteRender } from "./NoteRender.js"
// import { SustainRender } from "./SustainRenderer.js"
import { RenderDimensions } from "./RenderDimensions.js"
import { BackgroundRender } from "./BackgroundRender.js"
import { MeasureLinesRender } from "./MeasureLinesRender.js"
import { getSetting } from "../settings/Settings.js"
import { isBlack } from "../Util.js"

export class Render {
	constructor(cnvBG, cnvMain, cnvForeground, wrapperEle, player) {
		this.cnvBG = cnvBG
		this.cnv = cnvMain
		this.cnvForeground = cnvForeground
		this.wrapperEle = wrapperEle

		this.renderDimensions = new RenderDimensions(this.wrapperEle)
		this.renderDimensions.registerResizeCallback(this.setupCanvases.bind(this))

		this.setupCanvases()

		this.noteRender = new NoteRender(
			this.ctx,
			this.ctxForeground,
			this.renderDimensions
		)
		// this.sustainRender = new SustainRender(this.ctx, this.renderDimensions)

		this.measureLinesRender = new MeasureLinesRender(
			this.ctx,
			this.renderDimensions
		)

		this.backgroundRender = new BackgroundRender(
			this.ctxBG,
			this.renderDimensions
		)

		this.mouseX = 0
		this.mouseY = 0

		this.playerState = player.getPlayerState()

	}

	setCtxBlur() {
		this.ctxForeground.filter = "blur(3px)"
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

		let renderInfosByTrackMap = this.getRenderInfoByTrackMap(playerState)
		let inputActiveRenderInfos = this.getInputActiveRenderInfos(playerState)
		let inputPlayedRenderInfos = this.getInputPlayedRenderInfos(playerState)
		const time = this.getRenderTime(playerState)
		const end = playerState.end
		if (!playerState.loading && playerState.song) {
			const measureLines = playerState.song
				? playerState.song.getMeasureLines()
				: []

			this.measureLinesRender.render(time, measureLines)

			let currentActiveNotes = this.noteRender.render(
				time,
				renderInfosByTrackMap,
				inputActiveRenderInfos,
				inputPlayedRenderInfos
			)

			this.recordEnteredNotes(playerState, currentActiveNotes)

			// this.sustainRender.render(
			// 	time,
			// 	playerState.song.sustainsBySecond,
			// 	playerState.song.sustainPeriods
			// )
		}
	}

	getRenderTime(playerState) {
		return playerState.time + 0
	}
	getRenderInfoByTrackMap(playerState) {
		let renderInfoByTrackMap = {}
		if (playerState)
			if (playerState.song) {
				playerState.song.activeTracks.forEach((track, trackIndex) => {
						renderInfoByTrackMap[trackIndex] = { black: [], white: [] }

						let time = this.getRenderTime(playerState)
						let firstSecondShown = Math.floor(time - 4)
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
				})
			}
		return renderInfoByTrackMap
	}
	recordEnteredNotes(playerState, currentActiveNotes) {
		if (playerState)
			if (playerState.song) {
				playerState.song.activeTracks.forEach((track, trackIndex) => {
						let time = this.getRenderTime(playerState)
						let firstSecondShown = Math.floor(time - 4)
						let lastSecondShown = Math.ceil(
							time + this.renderDimensions.getSecondsDisplayedBefore()
						)

						for (let i = firstSecondShown; i < lastSecondShown; i++) {
							if (track.notesBySeconds[i]) {
								track.notesBySeconds[i]
									.map(note => { 
										if (currentActiveNotes[note.id]) {
											note.isEntered = true
										}
									})
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
				? this.playerState.trackColors[note.track].black
				: this.playerState.trackColors[note.track].white,
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
			noteInputAccurate: note.isInputAccurate,
			noteEnterStart: note.noteEnterStart,
			noteEnterEnd: note.noteEnterEnd
		}
	}

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

		this.setCanvasSize(
			this.getForegroundCanvas(),
			this.renderDimensions.windowWidth,
			this.renderDimensions.windowHeight
		)

        this.ctxForeground = this.cnvForeground.getContext('2d');
        this.ctxBG = this.cnvBG.getContext('2d');
        this.ctx = this.cnv.getContext('2d');

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
		this.noteRender.setMenuHeight(menuHeight)
	}
}
