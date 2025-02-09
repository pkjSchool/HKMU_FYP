import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearInfo } from "../store/loginInfo.tsx";
import { setCookie } from "../util/cookie";

function LogoutPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loadUser = () => {
            dispatch(clearInfo({}));
            setCookie('user_id', "", 0)
            navigate('/login');
    }

    useEffect(() => {
        loadUser();
    }, []);

  return <div>Logout</div>;
}

export default LogoutPage;
