import { NoteRender } from "./NoteRender.js"
import { RenderDimensions } from "./RenderDimensions.js"
import { BackgroundRender } from "./BackgroundRender.js"
import { getSetting } from "../settings/Settings.js"
import { isBlack } from "../Util.js"

export class Render {
	constructor(cnvBG, cnvMain, wrapperEle, player) {
		this.cnvBG = cnvBG
		this.cnv = cnvMain
		this.wrapperEle = wrapperEle

		this.renderDimensions = new RenderDimensions(this.wrapperEle)
		this.renderDimensions.registerResizeCallback(this.setupCanvases.bind(this))

		this.setupCanvases()

		this.noteRender = new NoteRender(
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

		let renderInfosByTrackMap = this.getRenderInfoByTrackMap(playerState)
		let inputActiveRenderInfos = this.getInputActiveRenderInfos(playerState)
		let inputPlayedRenderInfos = this.getInputPlayedRenderInfos(playerState)
		const time = this.getRenderTime(playerState)
		const end = playerState.end
		if (!playerState.loading && playerState.song) {
			const measureLines = playerState.song
				? playerState.song.getMeasureLines()
				: []

			this.drawGroupLine(time, measureLines)

			let currentActiveNotes = this.noteRender.render(
				time,
				renderInfosByTrackMap,
				inputActiveRenderInfos,
				inputPlayedRenderInfos
			)

			this.recordEnteredNotes(playerState, currentActiveNotes)
		}
	}

	drawGroupLine(time, measureLines) {
		let ctx = this.ctx

		ctx.strokeStyle = "rgba(255,255,255,1)"

		ctx.lineWidth = 0.5
		let currentSecond = Math.floor(time)
		ctx.beginPath()
		let firstSecondShown = currentSecond - 1
		let lastSecondShown =
			currentSecond + this.renderDimensions.getSecondsDisplayedBefore() + 1
		for (let i = firstSecondShown; i < lastSecondShown; i++) {
			if (!measureLines[i]) {
				continue
			}
			measureLines[i].forEach(tempoLine => {
				let ht = this.renderDimensions.getYForTime(tempoLine - time * 1000)

				ctx.moveTo(0, ht)
				ctx.lineTo(this.renderDimensions.windowWidth, ht)
			})
		}
		ctx.closePath()
		ctx.stroke()
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

        this.ctxBG = this.cnvBG.getContext('2d');
        this.ctx = this.cnv.getContext('2d');
	}
	getBgCanvas() {
		return this.cnvBG
	}
	getMainCanvas() {
		return this.cnv
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
