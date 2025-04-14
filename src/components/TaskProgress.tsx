import React, { useState, useEffect } from "react";
import { TiTick } from "react-icons/ti";
import { Step } from "react-joyride";
import JoyrideWrapper from "./JoyrideWrapper";
import sampleTasks from "../data/task";
import { user_task_get } from "../api_request/request";
import { getLoginedUser } from "../access_control/user";
import { useTranslation } from 'react-i18next';

const TaskProgress: React.FC = () => {
    const { t, i18n } = useTranslation();
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

    // Define TaskProgress tour steps
    const steps: Step[] = [
      {
        target: ".task-progress",
        content: t("task-1"),
        placement: "left"
      },
      {
        target: ".progress-bar-group",
        content: t("task-2"),
        placement: "left"
      },
      {
        target: ".progress-title",
        content: t("task-3"),
        placement: "left"
      },
      {
        target: ".progress-bar-item",
        content: t("task-4"),
        placement: "left"
      },
      {
        target: ".progress-bar-name",
        content: t("task-5"),
        placement: "left"
      },
      {
        target: ".progress-bar-bg",
        content: t("task-6"),
        placement: "left"
      },
      {
        target: "div:has(> .progress-bar-stick)",
        content: t("task-7"),
        placement: "left"
      },
      {
        target: "div:has(> svg.TiTick)",
        content: t("task-8"),
        placement: "left"
      }
    ];

  return (
    <JoyrideWrapper steps={steps} tourName="TaskProgressTour">
      <div className="task-progress">
        {userTasks.map((taskGroup, groupIdx) => {
            return <div key={groupIdx} className="progress-bar-group">
                      <h2 className="progress-title">{taskGroup.title_trans[i18n.language]}</h2>
                      {taskGroup.tasks.map((task:any, i:number) => {
                        return  <div key={i} className="progress-bar-item animate__animated animate__fadeIn" style={{"animationDelay": `${(groupIdx+i)*0.1}s`}}>
                                  <p className="progress-bar-name">{task.name_trans[i18n.language]}</p>
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
