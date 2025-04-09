import React, { useState, useEffect } from "react";
import { TiTick } from "react-icons/ti";
import { Step } from "react-joyride";
import JoyrideWrapper from "./JoyrideWrapper";
import sampleTasks from "../data/task";
import { user_task_get } from "../api_request/request";
import { getLoginedUser } from "../access_control/user";
import "../css/taskProgress.css";

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
        }).catch(()=>{
          setUserTasks(sampleTasks)
      })
    }, []);

    // 定義TaskProgress的導覽步驟
    const steps: Step[] = [
      {
        target: ".task-progress",
        content: "這是您的任務進度區域，顯示您需要完成的各種學習任務。",
        placement: "left"
      },
      {
        target: ".progress-bar-group",
        content: "任務分為不同的組別，每組包含相關的學習目標。",
        placement: "left"
      },
      {
        target: ".progress-title",
        content: "每組任務都有一個標題，說明該組的主題。",
        placement: "left"
      },
      {
        target: ".progress-bar-item",
        content: "這裡顯示每個具體的學習任務。",
        placement: "left"
      },
      {
        target: ".progress-bar-name",
        content: "這是任務的名稱，說明您需要完成什麼。",
        placement: "left"
      },
      {
        target: ".progress-bar-bg",
        content: "任務進度條顯示您完成任務的百分比。",
        placement: "left"
      },
      {
        target: "div:has(> .progress-bar-stick)",
        content: "綠色表示任務已完成，黃色表示任務進行中。",
        placement: "left"
      },
      {
        target: "div:has(> svg.TiTick)",
        content: "這個綠色勾號表示任務已經完成！",
        placement: "left"
      }
    ];

  return (
    <JoyrideWrapper steps={steps} tourName="TaskProgressTour">
      <div className="task-progress">
        {userTasks.map((taskGroup, groupIdx) => {
            return <div key={groupIdx} className="progress-bar-group">
                      <h2 className="progress-title">{taskGroup.title}</h2>
                      {taskGroup.tasks.map((task:any, i:number) => {
                        return  <div key={i} className="progress-bar-item animate__animated animate__fadeIn" style={{"animationDelay": `${(groupIdx+i)*0.1}s`}}>
                                  <p className="progress-bar-name">{task.name}</p>
                                  <div style={{display: "flex", "alignItems": "center", height: "32px"}}>
                                    <div className="progress-bar-bg" style={{width: "calc(100% - 20px)"}}>
                                      <div className="progress-bar-stick" style={{
                                          width: `${task.progressPerc}%`,
                                          backgroundColor:((task.is_finished)?"#4caf50":"var(--bs-warning)")
                                        }}></div>
                                    </div>
                                    <div style={{width: "20px"}}>
                                      {task.is_finished && <TiTick style={{"fontSize": "32px", color:"#4caf50"}} />}
                                    </div>
                                  </div>
                                </div>
                      })}
                    </div>
        })}
      </div>
    </JoyrideWrapper>
  );
};

export default TaskProgress;
