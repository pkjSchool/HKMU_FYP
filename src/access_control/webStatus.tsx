import { useSelector } from "react-redux";
import { setWebStatus } from "../store/webStatus.tsx";

export function checkIsInitial() {
    const storedInfo = getWebStatus();

    if(storedInfo.isInitial) {
        return true;
    } else {
        return false;
    }
}

export function setFinishInitial(dispatch:any) {
    dispatch(setWebStatus({'isInitial': false}));
}

export function getWebStatus() {
    return useSelector((state:any) => state.webStatus);
}