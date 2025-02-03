import { getSetting } from "../settings/Settings.js"
import { drawRoundRect } from "../Util.js"

/**
 * Class to render the notes on screen.
 */
export class NoteRender {
	constructor(ctx, renderDimensions) {
		this.ctx = ctx
		this.renderDimensions = renderDimensions

		this.lastActiveNotes = {}
	}
	render(time, renderInfoByTrackMap, inputActiveNotes, inputPlayedNotes) {
		//sustained note "tails"
		if (getSetting("showSustainedNotes")) {
			this.drawSustainedNotes(renderInfoByTrackMap, time)
		}

		let activeNotesByTrackMap = this.getActiveNotesByTrackMap(
			renderInfoByTrackMap
		)
		//Active notes effect
		Object.keys(activeNotesByTrackMap).forEach(trackIndex => {
			this.renderActiveNotesEffects(activeNotesByTrackMap[trackIndex])
		})

		//Notes
		Object.keys(renderInfoByTrackMap).forEach(trackIndex => {
			this.drawNotes(
				renderInfoByTrackMap[trackIndex].white,
				renderInfoByTrackMap[trackIndex].black
			)
		})

		let currentActiveNotes = {}
		let currentActiveObj = {}

		//Active keys on piano + stroking of active notes
		Object.keys(activeNotesByTrackMap).forEach(trackIndex => {
			this.renderActivePianoKeys(
				activeNotesByTrackMap[trackIndex],
				currentActiveNotes,
				currentActiveObj
			)
		})

		this.lastActiveNotes = currentActiveNotes

		this.drawInputNotes(inputActiveNotes, inputPlayedNotes)

		let pressActiveNotes = {}
		inputActiveNotes.forEach(noteInfo => {
			let tItem = currentActiveObj[parseInt(noteInfo.noteNumber)]
			if(tItem){
				pressActiveNotes[tItem.noteId] = true
			}
		})

		return pressActiveNotes
	}

	drawSustainedNotes(renderInfoByTrackMap, time) {
		Object.keys(renderInfoByTrackMap).forEach(trackIndex => {
			let notesRenderInfoBlack = renderInfoByTrackMap[trackIndex].black
			let notesRenderInfoWhite = renderInfoByTrackMap[trackIndex].white

			this.ctx.globalAlpha = getSetting("sustainedNotesOpacity") / 100
			this.ctx.strokeStyle = "rgba(0,0,0,1)"
			this.ctx.lineWidth = 1
			if (notesRenderInfoWhite.length > 0) {
				this.ctx.fillStyle = notesRenderInfoWhite[0].fillStyle
			}
			notesRenderInfoWhite.forEach(renderInfo =>
				this.drawSustainedNote(renderInfo)
			)
			if (notesRenderInfoBlack.length > 0) {
				this.ctx.fillStyle = notesRenderInfoBlack[0].fillStyle
			}
			notesRenderInfoBlack.forEach(renderInfo =>
				this.drawSustainedNote(renderInfo)
			)
		})
	}

	drawSustainedNote(renderInfos) {
		let ctx = this.ctx

		let x = renderInfos.x
		let w = renderInfos.w / 2

		if (renderInfos.sustainH && renderInfos.sustainY) {
			ctx.beginPath()
			ctx.rect(x + w / 2, renderInfos.sustainY, w, renderInfos.sustainH)
			ctx.closePath()
			ctx.fill()
		}
	}

	getActiveNotesByTrackMap(renderInfoByTrackMap) {
		return Object.keys(renderInfoByTrackMap).map(trackIndex =>
			this.getActiveNotes(
				renderInfoByTrackMap[trackIndex].black,
				renderInfoByTrackMap[trackIndex].white
			)
		)
	}
	getActiveNotes(notesRenderInfoBlack, notesRenderInfoWhite) {
		let activeNotesBlack = notesRenderInfoBlack
			.slice(0)
			.filter(renderInfo => renderInfo.isOn)

		let activeNotesWhite = notesRenderInfoWhite
			.slice(0)
			.filter(renderInfo => renderInfo.isOn)
		return { white: activeNotesWhite, black: activeNotesBlack }
	}

	renderActiveNotesEffects(activeNotes) {
		if (activeNotes.white.length) {
			this.ctx.fillStyle = activeNotes.white[0].fillStyle
		}
		activeNotes.white.forEach(note => this.renderActiveNoteEffect(note))

		if (activeNotes.black.length) {
			this.ctx.fillStyle = activeNotes.black[0].fillStyle
		}
		activeNotes.black.forEach(note => this.renderActiveNoteEffect(note))
	}

	renderActiveNoteEffect(renderInfos) {
		let ctx = this.ctx
		ctx.globalAlpha = Math.max(
			0,
			0.7 - Math.min(0.7, renderInfos.noteDoneRatio)
		)
		let wOffset = Math.pow(
			this.renderDimensions.whiteKeyWidth / 2,
			1 + Math.min(1, renderInfos.noteDoneRatio) * renderInfos.isOn
		)
		this.doNotePath(renderInfos, {
			x: renderInfos.x - wOffset / 2,
			w: renderInfos.w + wOffset,
			y: renderInfos.y,
			h: renderInfos.h + this.renderDimensions.whiteKeyHeight
		})

		ctx.fill()
		ctx.globalAlpha = 1
	}

	drawNotes(notesRenderInfoWhite, notesRenderInfoBlack) {
		let {
			incomingWhiteNotes,
			incomingBlackNotes,
			playedWhiteNotes,
			playedBlackNotes
		} = this.getIncomingAndPlayedNotes(
			notesRenderInfoWhite,
			notesRenderInfoBlack
		)

		this.ctx.globalAlpha = 1
		this.ctx.strokeStyle = getSetting("strokeNotesColor")
		this.ctx.lineWidth = getSetting("strokeNotesWidth")

		this.drawIncomingNotes(incomingWhiteNotes, incomingBlackNotes)
	}

	rectAbovePiano() {
		this.ctx.rect(
			0,
			0,
			this.renderDimensions.windowWidth,
			this.renderDimensions.getAbsolutePianoPosition()
		)
	}

	strokeActiveAndOthers(renderInfo, isInput = false) {
		if (renderInfo.isOn && !isInput) {
			this.ctx.strokeStyle = getSetting("strokeActiveNotesColor")
			this.ctx.lineWidth = getSetting("strokeActiveNotesWidth")
			this.ctx.stroke()
		} else {
			this.ctx.strokeStyle = getSetting("strokeNotesColor")
			this.ctx.lineWidth = getSetting("strokeNotesWidth")
			this.ctx.stroke()
		}
	}

	drawIncomingNotes(incomingWhiteNotes, incomingBlackNotes) {
		this.ctx.save()
		this.ctx.beginPath()
		this.rectAbovePiano()
		this.ctx.clip()
		this.ctx.closePath()

		incomingWhiteNotes.forEach(renderInfo => {
			
			if(renderInfo.noteInputAccurate == true) {
				this.ctx.fillStyle = getSetting("accurateInputNoteColor")
			} else if(renderInfo.noteEntered == true){
				this.ctx.fillStyle = getSetting("enteredInputNoteColor")
			} else {
				this.ctx.fillStyle = incomingWhiteNotes[0].fillStyle
			}

			this.drawNoteBefore(renderInfo)
			this.ctx.fill()
			this.strokeActiveAndOthers(renderInfo, false)
		})

		incomingBlackNotes.forEach(renderInfo => {

			if(renderInfo.noteInputAccurate == true) {
				this.ctx.fillStyle = getSetting("accurateInputNoteColor")
			} else if(renderInfo.noteEntered == true){
				this.ctx.fillStyle = getSetting("enteredInputNoteColor")
			} else {
				this.ctx.fillStyle = incomingBlackNotes[0].fillStyle
			}

			this.drawNoteBefore(renderInfo)
			this.ctx.fill()
			this.strokeActiveAndOthers(renderInfo, false)
		})
		this.ctx.restore()
	}

	getIncomingAndPlayedNotes(notesRenderInfoWhite, notesRenderInfoBlack) {
		let incomingWhiteNotes = []
		let playedWhiteNotes = []
		notesRenderInfoWhite
			.filter(renderInfo => renderInfo.w > 0 && renderInfo.h > 0)
			.forEach(renderInfo => {
				if (renderInfo.noteDoneRatio < 1) {
					incomingWhiteNotes.push(renderInfo)
				}
			})
		let incomingBlackNotes = []
		let playedBlackNotes = []
		notesRenderInfoBlack
			.filter(renderInfo => renderInfo.w > 0 && renderInfo.h > 0)
			.forEach(renderInfo => {
				if (renderInfo.noteDoneRatio < 1) {
					incomingBlackNotes.push(renderInfo)
				}
			})
		return {
			incomingWhiteNotes,
			incomingBlackNotes,
			playedWhiteNotes,
			playedBlackNotes
		}
	}

	drawInputNotes(inputActiveNotes, inputPlayedNotes) {
		this.ctx.globalAlpha = 1
		this.ctx.strokeStyle = getSetting("strokeNotesColor")
		this.ctx.lineWidth = getSetting("strokeNotesWidth")

		inputActiveNotes.forEach(noteInfo => {
			this.ctx.fillStyle = noteInfo.fillStyle

			this.drawNoteAfter(noteInfo)
			this.ctx.fill()
			this.strokeActiveAndOthers(noteInfo, true)
		})
		inputPlayedNotes.forEach(noteInfo => {
			this.ctx.fillStyle = noteInfo.fillStyle

			this.drawNoteAfter(noteInfo)
			this.ctx.fill()
			this.strokeActiveAndOthers(noteInfo, true)
		})
	}

	drawNoteAfter(renderInfos) {
		this.doNotePath(renderInfos, {  })
	}

	drawNoteBefore(renderInfos) {
		this.doNotePath(renderInfos /*, { h }*/)
	}

	renderActivePianoKeys(activeNotes, currentActiveNotes, currentActiveObj) {
		activeNotes.white.forEach(noteRenderInfo => {
			currentActiveNotes[noteRenderInfo.noteId] = true
			currentActiveObj[noteRenderInfo.noteNumber] = noteRenderInfo
		})
		activeNotes.black.forEach(noteRenderInfo => {
			currentActiveNotes[noteRenderInfo.noteId] = true
			currentActiveObj[noteRenderInfo.noteNumber] = noteRenderInfo
		})
	}

	strokeNote(renderInfo) {
		this.drawNoteBefore(renderInfo)
		this.ctx.stroke()

		if (renderInfo.isOn) {
			this.drawNoteAfter(renderInfo)
			this.ctx.stroke()
		}
	}

	doNotePath(renderInfo, overWriteParams) {
		if (!overWriteParams) {
			overWriteParams = {}
		}
		for (let key in renderInfo) {
			if (!overWriteParams.hasOwnProperty(key)) {
				overWriteParams[key] = renderInfo[key]
			}
		}
		if (getSetting("noteBorderRadius") > 0) {
			drawRoundRect(
				this.ctx,
				overWriteParams.x,
				overWriteParams.y,
				overWriteParams.w,
				overWriteParams.h,
				overWriteParams.rad,
				true
			)
		} else {
			this.ctx.beginPath()
			this.ctx.rect(
				overWriteParams.x,
				overWriteParams.y,
				overWriteParams.w,
				overWriteParams.h
			)
			this.ctx.closePath()
		}
	}

	getAlphaFromY(y) {
		//TODO broken.
		return Math.min(
			1,
			Math.max(
				0,
				(y - this.menuHeight - 5) /
					((this.renderDimensions.windowHeight - this.menuHeight) * 0.5)
			)
		)
	}

	setMenuHeight(menuHeight) {
		this.menuHeight = menuHeight
	}
}
