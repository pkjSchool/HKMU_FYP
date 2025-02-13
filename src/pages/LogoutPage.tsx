import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearInfo } from "../store/loginInfo.tsx";

function LogoutPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loadUser = () => {
      dispatch(clearInfo({}));
      navigate('/login');
    }

    useEffect(() => {
        loadUser();
    }, []);

  return <div>Logout</div>;
}

export default LogoutPage;
