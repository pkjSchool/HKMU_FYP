import React, { useEffect } from 'react';
import {useForm} from 'react-hook-form';
import { useSelector, useDispatch } from "react-redux";
import { setInfo } from "./store/loginInfo.js";

interface IFormInput {
  username: string
  password?: string
  conformPassword: string
}

function ProfilePage() {

  const dispatch = useDispatch();
  const storedInfo = useSelector((state:any) => state.loginInfo);

  const {watch, register, handleSubmit, formState: {errors}} = useForm<IFormInput>();

  const onSubmit = (data:any) => {
    alert(JSON.stringify(data))
    dispatch(setInfo({'username': data.username, 'password': data.password}))
  }

  useEffect(() => {

      console.log('Component mounted');

  }, []);

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Login</h2>
            <div className="mb-3"><label className="form-label">Username</label><input type="text" className="form-control" {...register("username", { required: "username is required" })} /></div>
            {errors.username && <p role="alert" className="errorText">{errors.username.message}</p>}
            <div className='row'>
              <div className='col-6'>
                <div className="mb-3"><label className="form-label">New Password</label><input type="password" className="form-control" {...register("password")} /></div>
                {errors.password?.type === "required" && (<p role="alert" className="errorText">New Password is required</p>)}
              </div>
              <div className='col-6'>
                <div className="mb-3"><label className="form-label">Conform Password</label><input type="password" className="form-control" {...register("conformPassword", { required: (watch('password')) })} /></div>
                {errors.conformPassword?.type === "required" && (<p role="alert" className="errorText">Conform Password is required</p>)}
              </div>
            </div>
            <input type="submit" className="btn btn-primary mb-3" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
