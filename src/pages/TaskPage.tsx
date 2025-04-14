import { useState, useEffect } from "react";
import { TiTick } from "react-icons/ti";
import sampleTasks from "../data/task";
import { user_task_get } from "../api_request/request";
import { getLoginedUser } from "../access_control/user";
import { useTranslation } from 'react-i18next';

function TaskPage() {
    const { i18n } = useTranslation();
    const userInfo = getLoginedUser();
    const [userTasks, setUserTasks] = useState<any[]>([]);
    const [lang, setLang] = useState<any[]>([]);

    const divisionFormat = (number1:number) => {
        if (number1 == parseInt(number1+"")) {
            return number1
        } else {
            return (number1).toFixed(2)
        }
    }
    
    useEffect(() => {
        user_task_get(parseInt(userInfo.user_id)).then((response) => {
            const result = response.data
            if(result.status) {
              const resultData = result.data
              setUserTasks(resultData)
            } else {
              alert(JSON.stringify(result));
            }
        }).catch(()=>{
            setUserTasks(sampleTasks)
        })
    }, []);

    return (
        <>
            <div className="card">
                <div className="card-body">

                    {userTasks.map((taskGroup, groupIdx) => {
                        return  <div key={groupIdx}>
                                    <h3>{taskGroup.title_trans[i18n.language]}</h3>
                                    <ul className="list-group">
                                        {taskGroup.tasks.map((task:any, i:number) => {
                                            // animate__animated animate__fadeInRight
                                            return <li key={i} className="list-group-item animate__animated animate__fadeIn" style={{"animationDelay": `${i*0.05}s`}}>
                                                        <div className="d-flex justify-content-between">
                                                            <h5>{task.name_trans[i18n.language]}</h5>
                                                            <h5>{divisionFormat(task.progressPerc)} %</h5>
                                                        </div>
                                                        <div style={{display: "flex", "alignItems": "center"}}>
                                                            <div className="progress" role="progressbar" style={{width: "calc(100% - 20px)"}}>
                                                                <div className="progress-bar" style={{width: `${task.progressPerc}%`, backgroundColor:((task.is_finished)?"var(--bs-success)":"var(--bs-warning)")}}></div>
                                                            </div>
                                                            <div style={{width: "20px"}}>
                                                                {task.is_finished && <TiTick style={{"fontSize": "32px", color:"var(--bs-success)"}} />}
                                                            </div>
                                                        </div>
                                                    </li>
                                        })}
                                    </ul>
                                    <br/>
                                </div>
                    })}

                </div>
            </div>

        </>
    );
}

export default TaskPage;
