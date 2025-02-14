import { useState, useEffect } from "react";
import { TiTick } from "react-icons/ti";
import sampleTasks from "../data/task";
import { user_task_get } from "../api_request/request";
import { getLoginedUser } from "../access_control/user";

function TaskPage() {
    const userInfo = getLoginedUser();
    const [userTasks, setUserTasks] = useState<any[]>([]);

    useEffect(() => {
        user_task_get(parseInt(userInfo.user_id)).then((response) => {
            const result = response.data
            if(result.status) {
              const resultData = result.data
              setUserTasks(resultData)
            } else {
              alert(JSON.stringify(result));
            }
        })
    }, []);

    return (
        <div>
            <div className="card">
                
                <div className="card-body">

                    {userTasks.map((taskGroup, groupIdx) => {
                        return  <div key={groupIdx}>
                                    <h3>{taskGroup.title}</h3>
                                    <ul className="list-group">
                                        {taskGroup.tasks.map((task, i) => {
                                            return <li key={i} className="list-group-item animate__animated animate__fadeInRight" style={{"animationDelay": `${i*0.1}s`}}>
                                                        <h5>{task.name}</h5>
                                                        <div style={{display: "flex", "alignItems": "center"}}>
                                                            <div className="progress" role="progressbar" style={{width: "calc(100% - 20px)"}}>
                                                                <div className="progress-bar" style={{width: `${task.test_progress}%`, backgroundColor:((task.test_progress >= 100)?"var(--bs-success)":"var(--bs-warning)")}}></div>
                                                            </div>
                                                            <div style={{width: "20px"}}>
                                                                {task.test_progress >= 100 && <TiTick style={{"fontSize": "32px", color:"var(--bs-success)"}} />}
                                                            </div>
                                                        </div>
                                                    </li>
                                        })}
                                    </ul>
                                </div>
                    })}

                </div>
            </div>

        </div>
    );
}

export default TaskPage;
