import React from "react";

const TaskProgress: React.FC = () => {
  return (
    <div
      className="task-progress"
      style={{
        position: "absolute",
        top: 0,
        right: 0, 
        width: "300px",
        height: "100vh", 
        backgroundColor: "#f9f9f9",
        borderLeft: "1px solid #ddd",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2>Task Progress</h2>
      <div className="progress-bar">
        <p>Progress 1</p>
        <div style={{ background: "#ddd", height: "10px", borderRadius: "5px" }}>
          <div
            style={{
              width: "70%", 
              background: "#4caf50",
              height: "100%",
              borderRadius: "5px",
            }}
          ></div>
        </div>
      </div>
      <div className="progress-bar">
        <p>Progress 2</p>
        <div style={{ background: "#ddd", height: "10px", borderRadius: "5px" }}>
          <div
            style={{
              width: "50%",
              background: "#2196f3",
              height: "100%",
              borderRadius: "5px",
            }}
          ></div>
        </div>
      </div>
      <div className="progress-bar">
        <p>Progress 3</p>
        <div style={{ background: "#ddd", height: "10px", borderRadius: "5px" }}>
          <div
            style={{
              width: "30%", 
              background: "#ff9800",
              height: "100%",
              borderRadius: "5px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TaskProgress;
