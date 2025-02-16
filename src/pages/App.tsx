import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Outlet } from "react-router-dom";


function App() {
  const [sidebarWidth, setSidebarWidth] = useState<number>(260);

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
