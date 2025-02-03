class Settings {
	constructor() {
		this.settingsById = {
			"trackColors": {
				id: "trackColors",
				value: [
					{ white: "#1ee5df", black: "#1ee5df" },
					// { white: "#ffa000", black: "#ff8f00" }, //orange
					// { white: "#1e88e5", black: "#1976d2" }, //blue
					// { white: "#43a047", black: "#388e3c" }, //green
					// { white: "#ffeb3b", black: "#fdd835" }, //yellow
					// { white: "#9c27b0", black: "#8e24aa" }, //pink
					// { white: "#f44336", black: "#e53935" }, //red
					// { white: "#673ab7", black: "#5e35b1" } //purple
				],
			},
			"showMarkersSong": {
				id: "showMarkersSong",
				value: true,
			},
			"inputNoteColor": {
				id: "inputNoteColor",
				value: "rgba(158,197,254,0.2)",
			},
			"enteredInputNoteColor": {
				id: "enteredNoteColor",
				value: "rgba(255,193,7,1)",
			},
			"accurateInputNoteColor": {
				id: "enteredNoteColor",
				value: "rgba(0,135,0,1)",
			},
			"pianoPosition": {
				id: "pianoPosition",
				value: 0,
			},
			"noteToHeightConst": {
				id: "noteToHeightConst",
				value: 3,
			},
			"strokeActiveNotesColor": {
				id: "strokeActiveNotesColor",
				value: "rgba(240,240,240,0.5)",
			},
			"strokeActiveNotesWidth": {
				id: "strokeActiveNotesWidth",
				value: "4",
			},
			"strokeNotesColor": {
				id: "strokeNotesColor",
				value: "rgba(0,0,0,1)",
			},
			"strokeNotesWidth": {
				id: "strokeNotesWidth",
				value: "1",
			},
			"noteBorderRadius": {
				id: "noteBorderRadius",
				value: 15,
			},
			"minNoteHeight": {
				id: "minNoteHeight",
				value: 2,
			},
			"showSustainOnOffs": {
				id: "showSustainOnOffs",
				label: "Draw Sustain On/Off Events",
				value: false,
			},
			"showSustainPeriods": {
				id: "showSustainPeriods",
				label: "Draw Sustain Periods",
				value: false,
			},
			"showSustainedNotes": {
				id: "showSustainedNotes",
				label: "Draw Sustained Notes",
				value: false,
			},
			"sustainedNotesOpacity": {
				id: "sustainedNotesOpacity",
				label: "Sustained Notes Opacity (%)",
				value: 50,
			},
			"showParticlesTop": {
				id: "showParticlesTop",
				label: "Enable top particles",
				value: true,
			},
			"showParticlesBottom": {
				id: "showParticlesBottom",
				label: "Enable bottom particles ",
				value: true,
			},
			"particleStroke": {
				id: "particleStroke",
				label: "Stroke particles",
				value: true,
			},
			"particleBlur": {
				id: "particleBlur",
				label: "Particle blur amount (px)",
				value: 3,
			},
			"particleAmount": {
				id: "particleAmount",
				label: "Particle Amount (per frame)",
				value: 3,
			},
			"particleSize": {
				id: "particleSize",
				label: "Particle Size",
				value: 6,
			},
			"particleLife": {
				id: "particleLife",
				label: "Particle Duration",
				value: 20,
			},
			"particleSpeed": {
				id: "particleSpeed",
				label: "Particle Speed",
				value: 4,
			}
		}
	}
}

const globalSettings = new Settings()
export const getSetting = settingId => {
	return globalSettings.settingsById[settingId].value
}
export const setSetting = (settingId, value) => {
	globalSettings.settingsById[settingId].value = value
}