import './css/App.css';
import { TiTick } from "react-icons/ti";

function TaskPage() {

    const sampleTasks = [
        {
            title: "Group 1",
            tasks: [
                { name: "Task-1", progress: 100 },
                { name: "Task-2", progress: 23 },
                { name: "Task-3", progress: 0 },
                { name: "Task-4", progress: 55 },
            ],
        },
        {
            title: "Group 2",
            tasks: [
                { name: "Task-1", progress: 100 },

            ],
        },
        {
            title: "Group 3",
            tasks: [
                { name: "Task-3", progress: 46 },
                { name: "Task-4", progress: 65 },
            ],
        },
    ];

  return (
    <div>
        <div className="card">
            
            <div className="card-body">

                {sampleTasks.map((taskGroup, groupIdx) => {
                    return  <div key={groupIdx}>
                                <h3>{taskGroup.title}</h3>
                                <ul className="list-group">
                                    {taskGroup.tasks.map((task, i) => {
                                        return <li className="list-group-item" key={i}>
                                                    <h5>{task.name}</h5>
                                                    <div style={{display: "flex", "alignItems": "center"}}>
                                                        <div className="progress" role="progressbar" style={{width: "calc(100% - 20px)"}}>
                                                            <div className="progress-bar" style={{width: `${task.progress}%`, backgroundColor:((task.progress >= 100)?"var(--bs-success)":"var(--bs-warning)")}}></div>
                                                        </div>
                                                        <div style={{width: "20px"}}>
                                                            {task.progress >= 100 && <TiTick style={{"fontSize": "32px", color:"var(--bs-success)"}} />}
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
