import { useEffect } from 'react';

import { useDispatch } from "react-redux";
import { setLoginedUser, getLoginedUser, getStorageUser } from "../access_control/user.tsx";
import { setFinishInitial } from "../access_control/webStatus.tsx";
import { user_info_get } from "../api_request/request.tsx";

import { clearInfo } from "../store/loginInfo.tsx";

import { useTranslation } from 'react-i18next';

function InitialPage() {
    const { i18n } = useTranslation();
    const dispatch = useDispatch();

    const setLang = () => {
        const lang = localStorage.getItem("lang")
        const langList = ['en', 'zh-HK']
        if(lang && langList.includes(lang)) {
            i18n.changeLanguage(lang)
        }
    }

    const loadUser = () => {
        // setLoginedUser(dispatch, {
        //     "login_id": "user1",
        //     "name": "Tester",
        //     "password": "123",
        //     "user_id": 1
        // });
        // finishInitial();
        // return;

        const storageUser = getStorageUser()

        if(storageUser) {
            console.log("getLoginedUser", storageUser);
            if(storageUser) {
                user_info_get(parseInt(storageUser)).then((response) => {
                    const result = response.data
                    if(result.status) {
                        const resultData = result.data
                        console.log("user_info_get", resultData);
                        setLoginedUser(dispatch, resultData);
                        finishInitial()
                    } else {
                        alert(JSON.stringify(result));
                        dispatch(clearInfo({}));
                        finishInitial()
                    }
                }).catch((error) => {
                    alert("id: " + storageUser + "\n" + error);
                    dispatch(clearInfo({}));
                    finishInitial()
                })
            }
        } else {
            finishInitial()
        }
    }

    const finishInitial = () => {
        setFinishInitial(dispatch)
    }

    useEffect(() => {
        setLang()
        loadUser();
    }, []);

  return (

        <div className="card">
            <div className="card-body">
                Loading
            </div>
        </div>

  );
}

export default InitialPage;
