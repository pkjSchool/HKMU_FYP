import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from "react-redux";
import { user_info_get, user_info_update } from "../api_request/request";
import { setLoginedUser, getLoginedUser } from "../access_control/user";
import { useTranslation } from 'react-i18next';

interface IFormInput {
  user_id: number
  displayName: string
  password?: string
  conformPassword: string
}

function ProfilePage() {
  const { t } = useTranslation();
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
            <h2 className="card-header">{t("information")}</h2>
            <div className="card-body">
              <div className="mb-3"><b>{t("username")}</b>: {userInfo.login_id}</div>
              <div className="mb-3"><label className="form-label">{t("displayName")}</label><input type="text" className="form-control" {...register("displayName", { required: true })} /></div>
                {errors.displayName?.type === "required" && (<p role="alert" className="errorText">{t("displayName_required")}</p>)}
              <div className='row'>
                <div className='col-6'>
                  <div className="mb-3"><label className="form-label">{t("newPassword")}</label><input type="password" className="form-control" {...register("password")} /></div>
                  {errors.password?.type === "required" && (<p role="alert" className="errorText">{t("newPassword_required")}</p>)}
                </div>
                <div className='col-6'>
                  <div className="mb-3"><label className="form-label">{t("conformPassword")}</label><input type="password" className="form-control" {...register("conformPassword", { required: (watch('password')) })} /></div>
                  {errors.conformPassword?.type === "required" && (<p role="alert" className="errorText">{t("conformPassword_required")}</p>)}
                </div>
              </div>
              <input type="submit" className="btn btn-primary mb-3" value={t("submit")}/>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
