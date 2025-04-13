import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import JoyrideWrapper from "../components/JoyrideWrapper";
import { Step } from "react-joyride";

import { useTranslation } from 'react-i18next';

function App() {
    const { t } = useTranslation();
  const [sidebarWidth, setSidebarWidth] = useState<number>(260);

  // Define sidebar tour steps
  const sidebarSteps: Step[] = [
    {
      target: ".sidebar",
      content: t("sidebar-1"),
      placement: "right"
    },
    {
      target: ".card",
      content: t("sidebar-2"),
      placement: "right"
    },
    {
      target: ".menu a:nth-child(3)", // home button
      content: t("sidebar-3"),
      placement: "right"
    },
    {
      target: ".menu a:nth-child(4)", // self study button
      content: t("sidebar-4"),
      placement: "right"
    },
    {
      target: ".handle",
      content: t("sidebar-5"),
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
