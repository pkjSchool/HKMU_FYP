import React, { useEffect } from 'react';
import TextBox from '../input_control/TextBox.js';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import { useDispatch } from "react-redux";
import { checkUserLogined, setLoginedUser, getLoginedUser } from "../access_control/user";
import { login } from "../api_request/request";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface IFormInput {
  username: string
  password: string
}

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const storedInfo = getLoginedUser();

  const {watch, register, handleSubmit, setValue, formState: {errors}} = useForm<IFormInput>();

  const onSubmit = (data:any) => {
    // event.preventDefault();
    // alert(JSON.stringify(data))

    login(data.username, data.password).then((response) => {
      const result = response.data
      if(result.status) {
        const resultData = result.data
        setLoginedUser(dispatch, resultData);

        navigate('/');
      } else {
        alert(JSON.stringify(result));
      }
    })
  }

  useEffect(() => {
    setValue("username", "user1");
    setValue("password", "123");
  }, []);

  // const [userName, setUserName] = React.useState('')
  // const [userPwd, setUserPwd] = React.useState('')
  // useEffect(() => {
  //   const subscription = watch((value, { name, type }) =>
  //     console.log(value, name, type)
  //   )
  //   return () => subscription.unsubscribe()
  // }, [watch])

  return (
    <div className="login-container">
      <div className="login-page">
        {/* <div className="card">
          <div className="card-body">
            React Redux Form
            <br/>login_id: {storedInfo.login_id}
            <br/>user_id: {storedInfo.user_id}
            <br/>username: {storedInfo.displayName}
          </div>
        </div> */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card">
            <h2 className="card-header text-center">{t('login')}</h2>
            <div className="card-body">
              <div className="mb-3"><label className="form-label">{t('username')}</label><input type="text" className="form-control" {...register("username", { required: true })} /></div>
              {/* {errors.username && <p role="alert" className="errorText">{errors.username.message}</p>} */}
              {errors.username?.type === "required" && (<p role="alert" className="errorText">{t('username_required')}</p>)}
              <div className="mb-3"><label className="form-label">{t('password')}</label><input type="password" className="form-control" {...register("password", { required: true })} /></div>
              {errors.password?.type === "required" && (<p role="alert" className="errorText">{t('password_required')}</p>)}
              <input type="submit" className="btn btn-primary mb-3" value={t("submit")}/>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
