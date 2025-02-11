import { MidiLoader } from "../MidiLoader.js"
import { Song } from "../Song.js"
import { AudioPlayer } from "../audio/AudioPlayer.js"

const COLORS_LIST = [
	{ white: "#1ee5df", black: "#1ee5df" },
	// { white: "#ffa000", black: "#ff8f00" }, //orange
	// { white: "#1e88e5", black: "#1976d2" }, //blue
	// { white: "#43a047", black: "#388e3c" }, //green
	// { white: "#ffeb3b", black: "#fdd835" }, //yellow
	// { white: "#9c27b0", black: "#8e24aa" }, //pink
	// { white: "#f44336", black: "#e53935" }, //reds
	// { white: "#673ab7", black: "#5e35b1" } //purple
]

export class Player {
	constructor() {
		this.audioPlayer = new AudioPlayer()

		this.startDelay = -2
		this.lastTime = this.audioPlayer.getContextTime()
		this.progress = 0
		this.paused = true
		this.playing = false
		this.scrolling = 0
		this.loadedSongs = new Set()
		this.volume = 100
		this.ACCURATE_OFFSET = 100

		this.inputActiveNotes = {}
		this.inputPlayedNotes = []
		this.inputSortedNotes = {}

		this.playbackSpeed = 1

		this.newSongCallbacks = []
		this.finishListeners = []
		this.timeUpdatedListeners = []

		// this.oldBPM = 0
		// this.countBPM = 0
		// this.noteBPM = 0
		// this.nextBPMTime = 0
		// this.scheduleBPM = null
		this.clearScheduleBeats()

		console.log("Player created.")
		this.playTick()
	}
	getState() {
		let time = this.getTime()
		return {
			time: time,
			ctxTime: this.audioPlayer.getContextTime(),
			end: this.song ? this.song.getEnd() : 0,
			loading: this.audioPlayer.loading,
			song: this.song,
			trackColors: this.trackColors,
			inputActiveNotes: this.inputActiveNotes,
			inputPlayedNotes: this.inputPlayedNotes,
			inputSortedNotes: this.inputSortedNotes,
			bpm: this.getBPM(time)
		}
	}

	getTimeWithScrollOffset(scrollOffset) {
		return this.progress + this.startDelay - scrollOffset
	}
	getTime() {
		return this.progress + this.startDelay - this.scrollOffset
	}
	getTimeWithoutScrollOffset() {
		return this.progress + this.startDelay
	}
	setTime(seconds) {
		this.audioPlayer.stopAllSources()
		this.progress += seconds - this.getTime()
		this.runTimeUpdatedListener()
		this.resetNoteSequence()
		this.clearScheduleBeats()
	}
	async loadSong(theSong, fileName, name) {
		this.audioPlayer.stopAllSources()
		console.info("Loading " + fileName + ".")
		if (this.audioPlayer.isRunning()) {
			this.audioPlayer.suspend()
		}

		this.loading = true


		console.info("Parsing Midi File.")
		try {
			let midiFile = await MidiLoader.loadFile(theSong)
			this.setSong(new Song(midiFile, fileName, name))
			this.runTimeUpdatedListener()
			console.info("Creating Buffers")
			this.audioPlayer.loadBuffers()
		} catch (error) {
			console.log(error)
			console.warn("Couldn't read Midi-File - " + error)
		}
	}

	setSong(song) {
		this.stop()
		// this.pause()
		this.wasPaused = true
		this.song = song
		if (this.loadedSongs.has(song)) {
			this.loadedSongs.add(song)
		}
		this.trackColors = {}

		const colorsLen = COLORS_LIST.length
		for (let trackId in song.activeTracks) {
			this.trackColors[trackId] = COLORS_LIST[trackId % colorsLen]
		}
		this.runNewSongCallback()
	}
	startPlay() {
		if (!this.song || !this.paused) return
		console.log("Starting Song")
		this.wasPaused = false

		this.resetNoteSequence()
		this.lastTime = this.audioPlayer.getContextTime()
		this.resume()
	}
	getBPM(time) {
		let val = 0
		if (this.song) {
			for (let i = this.song.temporalData.bpms.length - 1; i >= 0; i--) {
				if (time * 1000 > this.song.temporalData.bpms[i].timestamp) {
					val = this.song.temporalData.bpms[i].bpm
					break
				}
			}
		}
		return val
	}
	playTick() {
		let currentContextTime = this.audioPlayer.getContextTime()

		let delta = (currentContextTime - this.lastTime) * this.playbackSpeed

		if (delta < 0.0069) {
			this.requestNextTick()
			return
		}

		let oldProgress = this.progress
		this.lastTime = currentContextTime
		if (!this.paused && this.scrolling == 0) {
			this.progress += Math.min(0.1, delta)
			this.runTimeUpdatedListener()
		} else {
			this.requestNextTick()
			return
		}

		let currentTime = this.getTime()

		if (this.isSongEnded(currentTime)) {
			this.pause()
			this.requestNextTick()
			this.runFinishListener()
			return
		}

		// if(currentTime >= 0){
			this.playMetronomeBeats()
		// }


		while (this.isNextNoteReached(currentTime)) {
			let toRemove = 0
			forLoop: for (let i = 0; i < this.noteSequence.length; i++) {
				if (currentTime > 0.05 + this.noteSequence[i].timestamp / 1000) {
					toRemove++
				} else {
					break forLoop
				}
			}
			if (toRemove > 0) {
				this.noteSequence.splice(0, toRemove)
			}

			if (
				this.noteSequence[0] &&
				(true || this.isInputKeyPressed(this.noteSequence[0].noteNumber))
			) {
				this.playNote(this.noteSequence.shift())
			} else {
				this.progress = oldProgress
				this.runTimeUpdatedListener()
				break
			}
		}

		this.requestNextTick()
	}

	clearScheduleBeats() {
		if(this.scheduleBPM) { clearTimeout(this.scheduleBPM) }
		this.oldBPM = 0
		this.noteBPM = 0

		// this.countBPM = 0
		// this.nextBPMTime = 0
	}

	setupBeats() {
		this.clearScheduleBeats()
		const currentTime = this.getTime()
		const currentBpm = this.getBPM(currentTime)
		this.oldBPM = currentBpm
		this.noteBPM = this.song.timeSignature.numerator

		// this.countBPM = 0
		// this.nextBPMTime = 0
		// console.log(this.song.timeSignature.numerator)

		const res = this.findNextBeatAndCount()

		this.nextBPMTime = res[0]
		this.countBPM = res[1]

		this.scheduleBeats()
	}

	findNextBeatAndCount() {
		const currentTime = this.getTime()
		if(currentTime <= 0.1) return [0, 0]
		let gapTime = (60.0 / parseInt(this.oldBPM, 10))
		let timesPass = Math.round(currentTime / gapTime)
		let countGroupPass = timesPass / this.noteBPM

		let targetTime = timesPass * gapTime
		let targetCount = this.noteBPM * (countGroupPass - Math.round(countGroupPass))

		if(targetCount >= this.noteBPM) {
			targetCount = 0
		}

		// console.log(targetTime, targetCount)
		return [targetTime, targetCount]
	}

	scheduleBeats() {
		if(this.oldBPM > 0){
			const currentTime = this.getTime()
			if(currentTime >= this.nextBPMTime){
				this.countBPM = this.countBPM + 1
				const newMeasure = (this.countBPM == 1) ? true : false
	
				if(this.countBPM >= this.noteBPM) {
					this.countBPM = 0
				}
	
				this.audioPlayer.playBeat(currentTime, newMeasure)
	
				this.nextBPMTime = currentTime + (60.0 / parseInt(this.oldBPM, 10))
			}
			
			if(!this.isSongEnded(currentTime + 0.005)){
				this.scheduleBPM = window.setTimeout(()=> {
					this.scheduleBeats()
				}, 10);
			}
		}
	}

	playMetronomeBeats() {
		const currentTime = this.getTime()
		const currentBpm = this.getBPM(currentTime)
		if(currentBpm != this.oldBPM) {
			this.setupBeats()
		}

		// this.playedBeats = this.playedBeats || {}
		// let beatsBySecond = this.getCurrentSong().temporalData.beatsBySecond
		// let secondsToCheck = [Math.floor(currentTime), Math.floor(currentTime) + 1]
		// secondsToCheck.forEach(second => {
		// 	if (beatsBySecond[second]) {
		// 		beatsBySecond[second].forEach(beatTimestamp => {
		// 			if (
		// 				!this.playedBeats.hasOwnProperty(beatTimestamp) &&
		// 				beatTimestamp / 1000 < currentTime + 0.01 &&
		// 				beatTimestamp >= 0 && !this.isSongEnded(currentTime + 0.01)
		// 			) {
		// 				let newMeasure = this.isNewMetronomeBeats(beatTimestamp)
		// 				this.playedBeats[beatTimestamp] = true
		// 				this.audioPlayer.playBeat(currentTime, newMeasure)
		// 			}
		// 		})
		// 	}
		// })
	}

	isNewMetronomeBeats(beatTimestamp) {
		return this.getCurrentSong().measureLines[Math.floor(beatTimestamp / 1000)] &&
		this.getCurrentSong().measureLines[ Math.floor(beatTimestamp / 1000) ].includes(beatTimestamp)
	}

	requestNextTick() {
		window.requestAnimationFrame(this.playTick.bind(this))
	}

	isInputKeyPressed(noteNumber) {
		if (
			this.inputActiveNotes.hasOwnProperty(noteNumber) &&
			!this.inputActiveNotes[noteNumber].wasUsed
		) {
			this.inputActiveNotes[noteNumber].wasUsed = true
			return true
		}
		return false
	}
	isSongEnded(currentTime) {
		return currentTime >= this.song.getEnd() / 1000
	}

	isNextNoteReached(currentTime) {
		let lookahead = 0
		return (
			this.noteSequence.length &&
			this.noteSequence[0].timestamp / 1000 <
			currentTime + lookahead * this.playbackSpeed
		)
	}

	stop() {
		this.pause()
		this.progress = 0
		this.scrollOffset = 0
		this.runTimeUpdatedListener()
		this.clearScheduleBeats()
	}
	resume() {
		if (!this.song || !this.paused) return
		console.log("Resuming Song")
		this.playing = true
		this.paused = false
		this.resetNoteSequence()
		this.audioPlayer.resume()
	}
	resetNoteSequence() {
		if (!this.song) return
		this.noteSequence = this.song.getNoteSequence()
		this.noteSequence = this.noteSequence.filter(
			note => note.timestamp > this.getTime()
		)
		this.inputActiveNotes = {}
		this.playedBeats = {}
	}

	pause() {
		if (this.paused) return
		console.log("Pausing Song")
		this.pauseTime = this.getTime()
		this.playing = false
		this.paused = true
		this.audioPlayer.suspend()
		this.audioPlayer.stopAllSources()
	}

	playNote(note) {
		if (!note.hasOwnProperty("channel") || !note.hasOwnProperty("noteNumber")) {
			return
		}
		let currentTime = this.getTime()

		this.audioPlayer.playCompleteNote(
			currentTime,
			note,
			this.playbackSpeed,
			this.getNoteVolume(note),
			false
		)
	}
	getNoteVolume(note) {
		return ((this.volume / 100) * (note.channelVolume / 127))
	}

	addInputNoteOn(noteNumber) {
		if (this.inputActiveNotes.hasOwnProperty(noteNumber)) {
			console.log("NOTE ALREADY PLAING")
			delete this.inputActiveNotes[noteNumber]
		}

		let currentTime = this.getState().time

		let audioNote = null
		let activeNoteObj = {
			audioNote: audioNote,
			wasUsed: false,
			noteNumber: noteNumber,
			timestamp: currentTime * 1000
		}

		this.inputActiveNotes[noteNumber] = activeNoteObj
	}
	addInputNoteOff(noteNumber) {
		if (!this.inputActiveNotes.hasOwnProperty(noteNumber)) {
			console.log("NOTE NOT PLAYING")
			return
		}

		let currentTime = this.getState().time

		this.inputActiveNotes[noteNumber].offTime = currentTime * 1000

		let offNote = this.inputActiveNotes[noteNumber]
		this.inputPlayedNotes.push(offNote)

		if (!this.inputSortedNotes[noteNumber]) { this.inputSortedNotes[noteNumber] = [] }
		this.inputSortedNotes[noteNumber].push({
			"noteNumber": offNote.noteNumber,
			"offTime": offNote.offTime,
			"timestamp": offNote.timestamp
		})

		for (let track of this.song.activeTracks) {

			let time = this.getState().time
			let firstSecondShown = Math.floor(time - 4)
			let lastSecondShown = Math.ceil(time + 1000)

			for (let i = firstSecondShown; i < lastSecondShown; i++) {
				if (track.notesBySeconds[i]) {
					track.notesBySeconds[i]
						.map(note => {

							if (offNote.noteNumber == note.noteNumber && !note.isInputAccurate) {
								if (
									(offNote.timestamp <= (note.timestamp + this.ACCURATE_OFFSET) && offNote.timestamp >= (note.timestamp - this.ACCURATE_OFFSET)) &&
									(offNote.offTime <= (note.offTime + this.ACCURATE_OFFSET) && offNote.offTime >= (note.offTime - this.ACCURATE_OFFSET))
								) {
									note.isInputAccurate = true
									note.noteEnterStart = offNote.timestamp
									note.noteEnterEnd = offNote.offTime
								}
							}

						})
				}
			}
		}

		delete this.inputActiveNotes[noteNumber]
	}
	getPlayingNotes() {
		let currentTime = currentTime
		let playingNotes = []

		if (!this.noteSequence) {
			return playingNotes
		}
		this.noteSequence.forEach(note => {
			if (note.timestamp <= currentTime * 1000 && note.offTime >= currentTime * 1000) {
				playingNotes.push(note)
			}
		})

		return this.noteSequence
	}

	addFinishListener(event) {
		this.finishListeners.push(event)
	}
	clearFinishListener() {
		this.finishListeners = []
	}
	runFinishListener() {
		for (let i in this.finishListeners) {
			this.finishListeners[i]()
		}
	}

	addNewSongCallback(callback) {
		this.newSongCallbacks.push(callback)
	}
	clearNewSongCallback() {
		this.newSongCallbacks = []
	}
	runNewSongCallback() {
		for (let i in this.newSongCallbacks) {
			this.newSongCallbacks[i]()
		}
	}

	addTimeUpdatedListener(event) {
		this.timeUpdatedListeners.push(event)
	}
	clearTimeUpdatedListener() {
		this.timeUpdatedListeners = []
	}
	runTimeUpdatedListener() {
		if (this.song) {
			let time = this.getTime()
			for (let i in this.timeUpdatedListeners) {
				this.timeUpdatedListeners[i](time, this.song.getEnd(), this.getBPM(time))
			}
		}
	}

	clearInputRecords() {
		this.inputActiveNotes = {}
		this.inputPlayedNotes = []
		this.inputSortedNotes = {}
	}







	getPlayer = () => {
		return this
	}

	getCurrentSong = () => {
		return this.song
	}

	getPlayerState = () => {
		return this.getState()
	}

	isPlaying = () => {
		return this.playing
	}

	resetNoteMeasurement = () => {
		const playerStatus = this.getState()
		if (playerStatus.song) {
			for (let tracksIdx in playerStatus.song.activeTracks) {
				for (let notesIdx in playerStatus.song.activeTracks[tracksIdx].notes) {
					playerStatus.song.activeTracks[tracksIdx].notes[notesIdx].isEntered = false
					playerStatus.song.activeTracks[tracksIdx].notes[notesIdx].isInputAccurate = false
					playerStatus.song.activeTracks[tracksIdx].notes[notesIdx].noteEnterStart = null
					playerStatus.song.activeTracks[tracksIdx].notes[notesIdx].noteEnterEnd = null
				}
			}
		}

		this.clearInputRecords()
	}

}

const thePlayer = new Player()

export const getPlayer = () => {
	return thePlayer
}