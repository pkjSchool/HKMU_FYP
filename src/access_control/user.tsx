import { useSelector } from "react-redux";
import { setInfo } from "../store/loginInfo.tsx";

export function checkUserLogined() {
    const storedInfo = getLoginedUser();

    if(storedInfo.isLogined) {
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