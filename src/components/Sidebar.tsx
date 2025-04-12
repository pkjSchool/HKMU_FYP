import { useRef, useState } from "react";
import { 
  FaHome, 
  FaBook, 
  FaGraduationCap, 
  FaUser, 
  FaRobot, 
  FaEllipsisH, 
  FaHistory
} from "react-icons/fa";
import { ImStatsDots } from "react-icons/im";
import { GrTasks } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { getLoginedUser } from "../access_control/user";
import { useTranslation } from 'react-i18next';

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  link: string;
}

const items: SidebarItem[] = [
  { name: "home", icon: <FaHome />, link: "/" },
  // { name: "learning", icon: <FaBook />, link: "/learning" },
  { name: "self study", icon: <FaGraduationCap />, link: "/self-study" },
  { name: "self study record", icon: <FaHistory />, link: "/playing-record" },
  { name: "task", icon: <GrTasks />, link: "/task" },
  { name: "profile", icon: <FaUser />, link: "/profile" },
  { name: "ai generation", icon: <FaRobot />, link: "/ai-generation" },
  { name: "statistics", icon: <ImStatsDots />, link: "/statistics" },
  { name: "logout", icon: <FaEllipsisH />, link: "/logout" }
];

interface SidebarProps {
  onResize: (width: number) => void; 
}

export const Sidebar: React.FC<SidebarProps> = ({ onResize }) => {
  const { t, i18n } = useTranslation();

  const [width, setWidth] = useState<number>(260);
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

  const userInfo = getLoginedUser();

  return (
    <aside ref={sidebarRef} style={{ width: `${width}px` }} className="sidebar">
      <div className="handle" onMouseDown={initResize} />
      <div className="inner">
        <nav className="menu">

          <div className="card">
            <div className="card-body">
              {/* login_id: {userInfo.login_id}<br/>
              user_id: {userInfo.user_id}<br/> */}
              {t('welcome')}, {userInfo.displayName}
            </div>
          </div>

          <br />

          {items.map(item => (
            <NavLink to={item.link} key={item.name} className={({ isActive }) => isActive ? 'router-link-active' : '' }>
              {item.icon}
              <p>{t(item.name)}</p>
            </NavLink>
          ))}

          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: "4px", "marginTop": "10px"}}>
            <button onClick={()=>{i18n.changeLanguage('en')}}>English</button>
            <button onClick={()=>{i18n.changeLanguage('zh-HK')}}>繁體中文</button>
          </div>
        </nav>
      </div>
    </aside>
  );
};
