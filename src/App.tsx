import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import LessonMap from "./components/LessonMap";
import TaskProgress from "./components/TaskProgress";
import "./css/App.css";
import { Outlet } from "react-router-dom";

const sampleChapters = [
  {
    title: "Chapter 1",
    lessons: [
      { id: "ch1-1", completed: true, stars: 3 },
      { id: "ch1-2", completed: false, stars: 2 },
      { id: "ch1-3", completed: false },
      { id: "ch1-4", completed: false },
    ],
  },
  {
    title: "Chapter 2",
    lessons: [
      { id: "ch2-1", completed: false },
      { id: "ch2-2", completed: false },
    ],
  },
  {
    title: "Chapter 3",
    lessons: [
      { id: "ch3-1", completed: false },
      { id: "ch3-2", completed: false },
    ],
  },
];

function App() {
  const [sidebarWidth, setSidebarWidth] = useState<number>(60);

  const handleLessonClick = (lessonId: string) => {
    console.log(`Lesson ${lessonId} clicked`);
  };

  return (
    <div className="app-container">
      <Sidebar onResize={setSidebarWidth} />
      {<div 
        className="main-content" 
        style={{ marginLeft: `${sidebarWidth}px` }} 
      >
        <Outlet />
      </div>}
    </div>
  );
}

export default App;
