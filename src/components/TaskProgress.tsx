import React, { useState, useEffect } from "react";
import { TiTick } from "react-icons/ti";
import sampleTasks from "../data/task";
import { user_task_get } from "../api_request/request";
import { getLoginedUser } from "../access_control/user";

const TaskProgress: React.FC = () => {
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
    <div className="task-progress">
      {userTasks.map((taskGroup, groupIdx) => {
          return <div key={groupIdx} className="progress-bar-group">
                    <h2 className="progress-title">{taskGroup.title}</h2>
                    {taskGroup.tasks.map((task, i) => {
                      return  <div key={i} className="progress-bar-item animate__animated animate__fadeIn" style={{"animationDelay": `${(groupIdx+i)*0.1}s`}}>
                                <p className="progress-bar-name">{task.name}</p>
                                <div style={{display: "flex", "alignItems": "center", height: "32px"}}>
                                  <div className="progress-bar-bg" style={{width: "calc(100% - 20px)"}}>
                                    <div className="progress-bar-stick" style={{
                                        width: `${task.test_progress}%`,
                                        backgroundColor:((task.test_progress >= 100)?"#4caf50":"var(--bs-warning)")
                                      }}></div>
                                  </div>
                                  <div style={{width: "20px"}}>
                                    {task.test_progress >= 100 && <TiTick style={{"fontSize": "32px", color:"#4caf50"}} />}
                                  </div>
                                </div>
                              </div>
                    })}
                  </div>
      })}

    </div>
  );
};

export default TaskProgress;
