import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import LessonMap from "../components/LessonMap";
import TaskProgress from "../components/TaskProgress";
import { Outlet } from "react-router-dom";



function App() {
  const [sidebarWidth, setSidebarWidth] = useState<number>(260);

  const handleLessonClick = (lessonId: string) => {
    console.log(`Lesson ${lessonId} clicked`);
  };

  return (
    <div className="app-container">
      <Sidebar onResize={setSidebarWidth} />
      {<div 
        className="main-content" 
        style={{ marginLeft: `${sidebarWidth}px`, width: `calc(100% - ${sidebarWidth}px)` }} 
      >
        <Outlet />
      </div>}
    </div>
  );
}

export default App;
