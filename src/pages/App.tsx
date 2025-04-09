import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import JoyrideWrapper from "../components/JoyrideWrapper";
import { Step } from "react-joyride";

function App() {
  const [sidebarWidth, setSidebarWidth] = useState<number>(260);

  // 定義sidebar的導覽步驟
  const sidebarSteps: Step[] = [
    {
      target: ".sidebar",
      content: "這是側邊欄，您可以透過它導航到不同頁面",
      placement: "right"
    },
    {
      target: ".card",
      content: "這裡顯示您的用戶信息",
      placement: "right"
    },
    {
      target: ".menu a:nth-child(3)", // home按鈕
      content: "點擊這裡返回首頁",
      placement: "right"
    },
    {
      target: ".menu a:nth-child(4)", // self study按鈕
      content: "點擊這裡進入自學模式",
      placement: "right"
    },
    {
      target: ".handle",
      content: "拖動這裡可以調整側邊欄寬度",
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
