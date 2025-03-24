import axios from "axios";

const baseURL = "http://localhost/api";
const musicfileURL = "http://localhost/musicfile";
const midiGenURL = "http://localhost:8020/";
const pianoTranscribeURL = "http://localhost:8010/";

export function login(
                    login_id:number, 
                    password:string
                ) {
    return axios.post(`${baseURL}/login`, {
        login_id: login_id,
        password: password
    });
}

export function user_lesson_count(
    user_id:number
) {
    return axios.get(`${baseURL}/user_lesson_count/${user_id}`, {

    });
}

export function user_lesson_get(
    user_id:number
) {
    return axios.get(`${baseURL}/user_lesson/${user_id}`, {

    });
}

export function user_lesson_save(
                    user_id:number,
                    chapter_id:number,
                    lesson_id:number,
                    score:number
                ) {
    return axios.post(`${baseURL}/user_lesson`, {
        user_id: user_id,
        chapter_id: chapter_id,
        lesson_id: lesson_id,
        score: score,
    });
}

export function user_info_get(
    user_id:number
) {
    return axios.get(`${baseURL}/user_info/${user_id}`, {
        
    });
}

export function user_info_update(
    user_id:number,
    name:string,
    password:string = "",
    conformPassword:string = ""
) {
    return axios.put(`${baseURL}/user_info`, {
        user_id: user_id,
        name: name,
        password: password,
        conformPassword: conformPassword
    });
}

export function user_task_get(
    user_id:number
) {
    return axios.get(`${baseURL}/user_task/${user_id}`, {

    });
}

export function api_add_user_music_record(
    user_id:number,
    user_music_id:number,
    musicTime:number,
    playTime:number,
    score:number,
    totalNote:number,
    noteEntered:number,
    inputOnRange:number,
    noteDetail:any[]
) {
    return axios.post(`${baseURL}/user_music_record`, {
        user_id: user_id,
        user_music_id: user_music_id,
        musicTime: musicTime,
        playTime: playTime,
        score: score,
        totalNote: totalNote,
        noteEntered: noteEntered,
        inputOnRange: inputOnRange,
        noteDetail: JSON.stringify(noteDetail)
    });
}

export function api_get_user_music_record(
    user_id:number,
    user_music_id:number,
) {
    return axios.get(`${baseURL}/user_music_record/${user_id}/${user_music_id}`, {

    });
}

export function api_user_music_list(
    user_id:number
) {
    return axios.get(`${baseURL}/user_music_list/${user_id}`, {

    });
}

export function api_user_music_get(
    user_music_id:number
) {
    return axios.get(`${baseURL}/user_music_get/${user_music_id}`, {responseType: "arraybuffer", timeout: 180000});
}

export function api_fileWavToMidi(formData: FormData) {
    return axios.post(`${musicfileURL}/transcribe`, formData, {responseType: "arraybuffer", timeout: 180000});
}

export function api_fileMidiToXml(formData: FormData) {
    return axios.post(`${musicfileURL}/midi2mucicxml`, formData, {timeout: 180000});
}

export function api_user_music_upload(
    user_id:number,
    musicFile: any
) {
    const formData = new FormData();
    formData.append("user_id", user_id.toString());
    formData.append("midi", musicFile);

    return axios.post(`${baseURL}/user_music_upload`, formData);
}

export function api_midi_gen(
    formData: FormData
) {
    return axios.post(`${midiGenURL}/midi_gen`, formData, {responseType: "arraybuffer", timeout: 180000});
}

export function api_piano_transcribe(
    formData: FormData
) {
    return axios.post(`${pianoTranscribeURL}/transcribe`, formData, {responseType: "arraybuffer", timeout: 180000});
}