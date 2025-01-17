import './css/App.css';
import { TiTick } from "react-icons/ti";

function TaskPage() {

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
    <div>
        <div className="card">
            
            <div className="card-body">

                {sampleTasks.map((taskGroup, groupIdx) => {
                    return  <div key={groupIdx}>
                                <h3>{taskGroup.title}</h3>
                                <ul className="list-group">
                                    {taskGroup.tasks.map((task, i) => {
                                        return <li key={i} className="list-group-item animate__animated animate__fadeInRight" style={{"animationDelay": `${i*0.1}s`}}>
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
