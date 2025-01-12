import './css/App.css';
import React, {useEffect} from 'react';
import TextBox from './input_control/TextBox';
import {Controller, FormProvider, useForm} from 'react-hook-form';

interface IFormInput {
  username: string
  password: string
}

function LoginPage() {
  const {watch, register, handleSubmit, formState: {errors}} = useForm<IFormInput>();

  const onSubmit = (data:any) => {
    // event.preventDefault();
    alert(JSON.stringify(data))
  }

  handleSubmit((e)=>console.log(e));

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
      <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Login</h1>
          <div><label>username</label><input {...register("username", { required: "username is required" })} /></div>
          {errors.username && <p role="alert">{errors.username.message}</p>}
          <div><label>password</label><input type="password" {...register("password", { required: true })} /></div>
          {errors.password?.type === "required" && (<p role="alert">password is required</p>)}
          <input type="submit" />
      </form>
    </div>
  );
}

export default LoginPage;
