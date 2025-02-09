import { FC } from 'react'
import { createRoot } from 'react-dom/client'

import "bootstrap/dist/css/bootstrap.min.css";
import './css/animate.min.css';
import './css/animate.fix.css';

import './css/form.css';
import './index.css'

import './css/App.css';
import './css/profile.css';
import "./css/login.css";
import './css/LessonMap.css';
import "./css/Sidebar.css";
import "./css/taskProgress.css";

// @ts-ignore
import store from './store/globalConfig.tsx'
import { Provider } from 'react-redux'

import App from './pages/App.tsx'
import LessonPage from './pages/LessonPage.tsx'
import LearningPage from './pages/LearningPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import SelfStudyPage from './pages/SelfStudyPage.tsx'
import AiGenerationPage from './pages/AiGenerationPage.tsx'
import MorePage from './pages/MorePage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import LogoutPage from './pages/LogoutPage.tsx'
import InitialPage from './pages/initialPage.tsx';
import PianoPlayingPage from './pages/PianoPlayingPage.tsx'
import TaskPage from './pages/TaskPage.tsx'
import LessonDetail from './pages/LessonDetail.tsx'

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { checkUserLogined } from "./access_control/user";
import { checkIsInitial } from "./access_control/webStatus";

interface Props {
  children: React.ReactNode;
}

const AuthRequired: FC<Props> = ({ children }) => {
  const isLoggedIn = checkUserLogined();
  return isLoggedIn ? children : <Navigate to="/login" replace={true} />;
};

const AnonymousRequired: FC<Props> = ({ children }) => {
  const isLoggedIn = checkUserLogined();
  return isLoggedIn ? <Navigate to="/" replace={true} /> : children;
};

const InitialRequired: FC<Props> = ({ children }) => {
  const isInitial = checkIsInitial();
  return isInitial ? <InitialPage /> : children;
};


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={ store }>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <InitialRequired><AuthRequired><App /></AuthRequired></InitialRequired> } >
            <Route path="/" element={ <InitialRequired><AuthRequired><LessonPage /></AuthRequired></InitialRequired> } />
            <Route path="/learning" element={ <InitialRequired><AuthRequired><LearningPage /></AuthRequired></InitialRequired> } />
            <Route path="/self-study" element={ <InitialRequired><AuthRequired><Navigate to="/playing" replace={true} /></AuthRequired></InitialRequired> } />
            <Route path="/task" element={ <InitialRequired><AuthRequired><TaskPage /></AuthRequired></InitialRequired> } />
            <Route path="/profile" element={ <InitialRequired><AuthRequired><ProfilePage /></AuthRequired></InitialRequired> } /> 
            <Route path="/ai-generation" element={ <InitialRequired><AuthRequired><AiGenerationPage /></AuthRequired></InitialRequired> } />
            <Route path="/more" element={ <InitialRequired><AuthRequired><MorePage /></AuthRequired></InitialRequired> } />
          </Route>
          <Route path="/music-player" element={ <InitialRequired><AuthRequired><SelfStudyPage /></AuthRequired></InitialRequired> } />
          <Route path="/playing" element={ <InitialRequired><AuthRequired><PianoPlayingPage /></AuthRequired></InitialRequired> } />
          <Route path="/login" element={ <InitialRequired><AnonymousRequired><LoginPage /></AnonymousRequired></InitialRequired> } />
          <Route path="/logout" element={ <InitialRequired><AuthRequired><LogoutPage /></AuthRequired></InitialRequired> } />
          <Route path="/lesson/:lessonId" element={<InitialRequired><AuthRequired><LessonDetail /></AuthRequired></InitialRequired>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  // </StrictMode>,
)