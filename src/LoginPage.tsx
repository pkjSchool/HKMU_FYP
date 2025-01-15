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
    <div className="login-page">
      React Redux Form
      <br/>username: {storedInfo.username}
      <br/>password: {storedInfo.password}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Login</h2>
            <div className="mb-3"><label className="form-label">username</label><input type="text" className="form-control" {...register("username", { required: "username is required" })} /></div>
            {errors.username && <p role="alert" className="errorText">{errors.username.message}</p>}
            <div className="mb-3"><label className="form-label">password</label><input type="password" className="form-control" {...register("password", { required: true })} /></div>
            {errors.password?.type === "required" && (<p role="alert" className="errorText">password is required</p>)}
            <input type="submit" className="btn btn-primary mb-3" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
