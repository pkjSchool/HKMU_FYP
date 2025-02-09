import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from "react-redux";
import { user_info_get, user_info_update } from "../api_request/request";
import { setLoginedUser, getLoginedUser } from "../access_control/user";
import { setCookie } from "../util/cookie";

interface IFormInput {
  user_id: number
  displayName: string
  password?: string
  conformPassword: string
}

function ProfilePage() {
  const userInfo = getLoginedUser();
  const dispatch = useDispatch();

  const {watch, register, handleSubmit, setValue, formState: {errors}} = useForm<IFormInput>();

  const onSubmit = (data:any) => {
    // alert(JSON.stringify(data))
    user_info_update(data.user_id, data.displayName, data.password, data.conformPassword).then((response) => {
      const result = response.data
      if(result.status) {
        const resultData = result.data
        updateUserInfo()
      } else {
        alert(JSON.stringify(result));
      }
    })
  }

  const updateUserInfo = () => {
    user_info_get(parseInt(userInfo.user_id)).then((response) => {
        const result = response.data
        if(result.status) {
            const resultData = result.data
            console.log(resultData);
            setLoginedUser(dispatch, resultData);
        } else {
            alert(JSON.stringify(result));
        }
    })
  }

  useEffect(() => {
    setValue("user_id", userInfo.user_id);
    setValue("displayName", userInfo.displayName);
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-page">
{/* 
        <div className="card mb-5">
          <h2 className="card-header">User Information</h2>
          <div className="card-body">
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
        </div> */}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card">
            <h2 className="card-header">Information</h2>
            <div className="card-body">
              <div className="mb-3"><b>Username</b>: user1</div>
              <div className="mb-3"><label className="form-label">Display Name</label><input type="text" className="form-control" {...register("displayName", { required: true })} /></div>
                {errors.displayName?.type === "required" && (<p role="alert" className="errorText">Display Name is required</p>)}
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
    </div>
  );
}

export default ProfilePage;
