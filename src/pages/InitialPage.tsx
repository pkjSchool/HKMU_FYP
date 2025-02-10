import { useEffect } from 'react';

import { useDispatch } from "react-redux";
import { setLoginedUser, getLoginedUser, getStorageUser } from "../access_control/user.tsx";
import { setFinishInitial } from "../access_control/webStatus.tsx";
import { user_info_get } from "../api_request/request.tsx";

function InitialPage() {
    const dispatch = useDispatch();

    const loadUser = () => {
        setLoginedUser(dispatch, {
            "login_id": "user1",
            "name": "Tester",
            "password": "123",
            "user_id": 1
        });
        finishInitial();
        return;

        const storageUser = getStorageUser()

        if(storageUser) {
            setLoginedUser(dispatch, storageUser)
            const userInfo = getLoginedUser();

            if(userInfo.isLogined && userInfo.user_id) {
                user_info_get(parseInt(userInfo.user_id)).then((response) => {
                    const result = response.data
                    if(result.status) {
                        const resultData = result.data
                        console.log(resultData);
                        setLoginedUser(dispatch, resultData);
                        finishInitial()
                    } else {
                        alert(JSON.stringify(result));
                    }
                })
            }
        }
    }

    const finishInitial = () => {
        setFinishInitial(dispatch)
    }

    useEffect(() => {
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
