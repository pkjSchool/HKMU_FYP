export class Settings {
	constructor() {
		this.settingsById = {
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