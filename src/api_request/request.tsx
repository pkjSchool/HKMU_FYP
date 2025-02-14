import axios from "axios";

const baseURL = "http://localhost/api";

export function login(
                    login_id:number, 
                    password:string
                ) {
    return axios.post(`${baseURL}/login`, {
        login_id: login_id,
        password: password
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