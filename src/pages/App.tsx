import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import JoyrideWrapper from "../components/JoyrideWrapper";
import { Step } from "react-joyride";

function App() {
  const [sidebarWidth, setSidebarWidth] = useState<number>(260);

  // Define sidebar tour steps
  const sidebarSteps: Step[] = [
    {
      target: ".sidebar",
      content: "This is the sidebar, you can use it to navigate to different pages",
      placement: "right"
    },
    {
      target: ".card",
      content: "This displays your user information",
      placement: "right"
    },
    {
      target: ".menu a:nth-child(3)", // home button
      content: "Click here to return to the home page",
      placement: "right"
    },
    {
      target: ".menu a:nth-child(4)", // self study button
      content: "Click here to enter self-study mode",
      placement: "right"
    },
    {
      target: ".handle",
      content: "Drag here to adjust the sidebar width",
      placement: "right"
    }
  ];
  return (
    <JoyrideWrapper steps={sidebarSteps} tourName="SidebarTour">
      <div className="app-container">
        <Sidebar onResize={setSidebarWidth} />
        <div 
          className="main-content" 
          style={{ marginLeft: `${sidebarWidth}px`, width: `calc(100% - ${sidebarWidth}px)` }} 
        >
          <Outlet />
        </div>
      </div>
    </JoyrideWrapper>
  );
}

export default App;
