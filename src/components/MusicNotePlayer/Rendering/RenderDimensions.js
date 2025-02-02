import { isBlack } from "../Util.js"
import { getSetting } from "../settings/Settings.js"

export class RenderDimensions {
	constructor(wrapperEle) {
		this.wrapperEle = wrapperEle

		this.pianoHeight = 120
		this.whiteKeyHeight = 120
		this.blackKeyHeight = 80
		this.menuHeight = 200

		this.minNoteNumber = 0
		this.maxNoteNumber = 87
		this.resizeCallbacks = []
		this.numberOfWhiteKeysShown = 52

		window.addEventListener("resize", this.resize.bind(this))
		this.resize()
	}

	resize() {
		this.windowWidth = Math.floor(this.wrapperEle.offsetWidth)
		this.windowHeight = Math.floor(this.wrapperEle.offsetHeight)

		this.whiteKeyWidth = this.windowWidth / this.numberOfWhiteKeysShown
		this.blackKeyWidth = Math.floor(this.whiteKeyWidth * 0.6)

		this.keyDimensions = {}
		this.resizeCallbacks.forEach(func => func())
	}

	registerResizeCallback(callback) {
		this.resizeCallbacks.push(callback)
	}

	getKeyDimensions(noteNumber) {
		if (!this.keyDimensions.hasOwnProperty(noteNumber)) {
			let isNoteBlack = isBlack(noteNumber)
			let x = this.getKeyX(noteNumber)

			this.keyDimensions[noteNumber] = {
				x: x,
				y: 0,
				w: isNoteBlack ? this.blackKeyWidth : this.whiteKeyWidth,
				h: isNoteBlack ? this.blackKeyHeight : this.whiteKeyHeight,
				black: isNoteBlack
			}
		}
		return this.keyDimensions[noteNumber]
	}

	getAbsolutePianoPosition() {
		return this.windowHeight - this.pianoHeight
	}

	getKeyX(noteNumber) {
		return (
			(this.getWhiteKeyNumber(noteNumber) - this.getWhiteKeyNumber(this.minNoteNumber)) * this.whiteKeyWidth +
			(this.whiteKeyWidth - this.blackKeyWidth / 2) * isBlack(noteNumber)
		)
	}

	getWhiteKeyNumber(noteNumber) {
		return (
			noteNumber -
			Math.floor(Math.max(0, noteNumber + 11) / 12) -
			Math.floor(Math.max(0, noteNumber + 8) / 12) -
			Math.floor(Math.max(0, noteNumber + 6) / 12) -
			Math.floor(Math.max(0, noteNumber + 3) / 12) -
			Math.floor(Math.max(0, noteNumber + 1) / 12)
		)
	}

	getYForTime(time) {
		const height = this.windowHeight - this.whiteKeyHeight
		let noteToHeightConst = this.getNoteToHeightConst()

		return (
			height -
			(time / noteToHeightConst) * height -
			(height - this.getAbsolutePianoPosition())
		)
	}

	getNoteDimensions(
		noteNumber,
		currentTime,
		noteStartTime,
		noteEndTime,
		sustainOffTime
	) {
		const dur = noteEndTime - noteStartTime
		const isKeyBlack = isBlack(noteNumber)
		let x = this.getKeyX(noteNumber)
		let w = isKeyBlack ? this.blackKeyWidth : this.whiteKeyWidth
		let h =
			(dur / this.getNoteToHeightConst()) *
			(this.windowHeight - this.whiteKeyHeight)

		let hCorrection = 0
		let minNoteHeight = parseFloat(getSetting("minNoteHeight"))
		if (h < minNoteHeight + 2) {
			hCorrection = minNoteHeight + 2 - h
			h = minNoteHeight + 2
		}

		let rad = (getSetting("noteBorderRadius") / 100) * w
		if (h < rad * 2) {
			rad = h / 2
		}
		let y = this.getYForTime(noteEndTime - currentTime)

		let sustainY = 0
		let sustainH = 0
		if (sustainOffTime > noteEndTime) {
			sustainH =
				((sustainOffTime - noteEndTime) / this.getNoteToHeightConst()) *
				(this.windowHeight - this.whiteKeyHeight)
			sustainY = this.getYForTime(sustainOffTime - currentTime)
		}

		//adjust height/y for notes that have passed the piano / have been played
		let showSustainedNotes = getSetting("showSustainedNotes")
		let endTime = showSustainedNotes
			? Math.max(isNaN(sustainOffTime) ? 0 : sustainOffTime, noteEndTime)
			: noteEndTime

		if (showSustainedNotes) {
			if (!isNaN(sustainOffTime) && sustainOffTime < currentTime) {
				sustainY += this.whiteKeyHeight
			}
			if (
				!isNaN(sustainOffTime) &&
				sustainOffTime > currentTime &&
				noteEndTime < currentTime
			) {
				sustainH += this.whiteKeyHeight
			}
		}

		if (endTime < currentTime) {
			let endRatio = 0

			x = x + (w - w * endRatio) / 2
			w *= endRatio

			let tmpH = h
			h *= endRatio
			y += (tmpH - h)

			let tmpSustainH = sustainH
			sustainH *= endRatio
			sustainY += (tmpSustainH - sustainH) + (tmpH - h)
		}
		return {
			x: x + 1,
			y: y + 1 - hCorrection,
			w: w - 2,
			h: h - 2,
			rad: rad,
			sustainH: sustainH,
			sustainY: sustainY,
			isBlack: isKeyBlack
		}
	}

	getNoteToHeightConst() {
		return getSetting("noteToHeightConst") * this.windowHeight
	}

	getSecondsDisplayedBefore() {
		return Math.ceil(this.getNoteToHeightConst() / 1000)
	}

}