import React from "react";
import { TiTick } from "react-icons/ti";
import "../css/taskProgress.css";

const TaskProgress: React.FC = () => {

  const sampleTasks = [
    {
        title: "Self Study",
        tasks: [
            { name: "Accuracy more then 70%", progress: 100 },
            { name: "Play 10 minutes long music", progress: 20 },
            { name: "Get 3000 score", progress: 50 },
        ],
    },
    {
        title: "Learning",
        tasks: [
            { name: "Finish 1 lesson", progress: 100 },
            { name: "Finish 2 lesson", progress: 50 },
            { name: "Finish 3 lesson", progress: 33.3 },
        ],
    },
];

  return (
    <div className="task-progress">
      {sampleTasks.map((taskGroup, groupIdx) => {
          return <div key={groupIdx} className="progress-bar-group">
                    <h2 className="progress-title">{taskGroup.title}</h2>
                    {taskGroup.tasks.map((task, i) => {
                      return  <div key={i} className="progress-bar-item animate__animated animate__fadeIn" style={{"animationDelay": `${(groupIdx+i)*0.1}s`}}>
                                <p className="progress-bar-name">{task.name}</p>
                                <div style={{display: "flex", "alignItems": "center", height: "32px"}}>
                                  <div className="progress-bar-bg" style={{width: "calc(100% - 20px)"}}>
                                    <div className="progress-bar-stick" style={{
                                        width: `${task.progress}%`,
                                        backgroundColor:((task.progress >= 100)?"#4caf50":"var(--bs-warning)")
                                      }}></div>
                                  </div>
                                  <div style={{width: "20px"}}>
                                    {task.progress >= 100 && <TiTick style={{"fontSize": "32px", color:"#4caf50"}} />}
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
