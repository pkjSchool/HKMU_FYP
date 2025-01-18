import "./css/login.css";
import React, {useEffect} from 'react';
import TextBox from './input_control/TextBox';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import { useSelector, useDispatch } from "react-redux";
import { setInfo } from "./store/loginInfo.js";

interface IFormInput {
  username: string
  password: string
}

function LoginPage() {
  const dispatch = useDispatch();
  const storedInfo = useSelector((state:any) => state.loginInfo);

  const {watch, register, handleSubmit, formState: {errors}} = useForm<IFormInput>();

  const onSubmit = (data:any) => {
    // event.preventDefault();
    alert(JSON.stringify(data))
    dispatch(setInfo({'username': data.username, 'password': data.password}))
  }

  useEffect(() => {

      console.log('Component mounted');

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
        {/* React Redux Form
        <br/>username: {storedInfo.username}
        <br/>password: {storedInfo.password} */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card">
            <h2 className="card-header text-center">Login</h2>
            <div className="card-body">
              <div className="mb-3"><label className="form-label">Username</label><input type="text" className="form-control" {...register("username", { required: true })} /></div>
              {/* {errors.username && <p role="alert" className="errorText">{errors.username.message}</p>} */}
              {errors.username?.type === "required" && (<p role="alert" className="errorText">Username is required</p>)}
              <div className="mb-3"><label className="form-label">Password</label><input type="password" className="form-control" {...register("password", { required: true })} /></div>
              {errors.password?.type === "required" && (<p role="alert" className="errorText">Password is required</p>)}
              <input type="submit" className="btn btn-primary mb-3" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
