import { useSelector } from "react-redux";
import { setInfo } from "../store/loginInfo.tsx";

export function checkUserLogined() {
    const storedInfo = getLoginedUser();

    if(storedInfo.isLogined && storedInfo.user_id) {
        return true;
    } else {
        return false;
    }
}

export function setLoginedUser(dispatch:any, resultData: any) {
    dispatch(setInfo({'user_id': resultData.user_id, 'login_id': resultData.login_id, 'displayName': resultData.name, 'jsondata': resultData}));
}

export function getLoginedUser() {
    return useSelector((state:any) => state.loginInfo);
}

export function getStorageUser() {
    return localStorage.getItem("logined_user");
}

export function clearStorageUser() {
    return localStorage.removeItem("logined_user");
}

export function setStorageUser(jsondata: any) {
    return localStorage.setItem("logined_user", jsondata);
}