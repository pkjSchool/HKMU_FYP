import { useRef, useState } from "react";
import { 
  FaHome, 
  FaBook, 
  FaGraduationCap, 
  FaUser, 
  FaRobot, 
  FaEllipsisH 
} from "react-icons/fa";
import "../css/Sidebar.css";

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
}

const items: SidebarItem[] = [
  { name: "home", icon: <FaHome /> },
  { name: "learning", icon: <FaBook /> },
  { name: "self study", icon: <FaGraduationCap /> },
  { name: "profile", icon: <FaUser /> },
  { name: "ai generation", icon: <FaRobot /> },
  { name: "more", icon: <FaEllipsisH /> }
];

interface SidebarProps {
  onResize: (width: number) => void; 
}

export const Sidebar: React.FC<SidebarProps> = ({ onResize }) => {
  const [width, setWidth] = useState<number>(60);
  const sidebarRef = useRef<HTMLElement | null>(null);

  const resize = (e: MouseEvent): void => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    
    let newWidth = e.clientX - sidebar.offsetLeft;
    if (newWidth < 60) newWidth = 60;
    if (newWidth > 259) newWidth = 260;
    
    setWidth(newWidth);
    onResize(newWidth); 
  };

  const initResize = (): void => {
    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
  };

  const stopResize = (): void => {
    document.body.style.cursor = "default";
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
  };

  return (
    <aside ref={sidebarRef} style={{ width: `${width}px` }} className="sidebar">
      <div className="handle" onMouseDown={initResize} />
      <div className="inner">
        <nav className="menu">
          {items.map(item => (
            <button key={item.name}>
              {item.icon}
              <p>{item.name}</p>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
