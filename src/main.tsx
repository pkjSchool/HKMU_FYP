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
import "./css/PianoPageTopNavBar.css";
import "./css/statistics.css";

// @ts-ignore
import store from './store/globalConfig.tsx'
import { Provider } from 'react-redux'

import App from './pages/App.tsx'
import LessonPage from './pages/LessonPage.tsx'
import LearningPage from './pages/LearningPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import SelfStudyPage from './pages/SelfStudyPage.tsx'
import AiGenerationPage from './pages/AiGenerationPage.tsx'
import StatisticsPage from './pages/StatisticsPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import LogoutPage from './pages/LogoutPage.tsx'
import InitialPage from './pages/InitialPage.tsx';
import PianoPlayingPage from './pages/PianoPlayingPage.tsx'
import TaskPage from './pages/TaskPage.tsx'
import LessonDetail from './pages/LessonDetail.tsx'
import PlayingRecordPage from './pages/PlayingRecordPage.tsx'

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
      <InitialRequired>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <AuthRequired><App /></AuthRequired> } >
              <Route path="/" element={ <AuthRequired><LessonPage /></AuthRequired> } />
              <Route path="/learning" element={ <AuthRequired><LearningPage /></AuthRequired> } />
              <Route path="/self-study" element={ <AuthRequired><Navigate to="/playing" replace={true} /></AuthRequired> } />
              <Route path="/playing-record" element={ <AuthRequired><PlayingRecordPage /></AuthRequired> } />
              <Route path="/task" element={ <AuthRequired><TaskPage /></AuthRequired> } />
              <Route path="/profile" element={ <AuthRequired><ProfilePage /></AuthRequired> } /> 
              <Route path="/ai-generation" element={ <AuthRequired><AiGenerationPage /></AuthRequired> } />
              <Route path="/statistics" element={ <AuthRequired><StatisticsPage /></AuthRequired> } />
            </Route>
            <Route path="/music-player" element={ <AuthRequired><SelfStudyPage /></AuthRequired> } />
            <Route path="/playing" element={ <AuthRequired><PianoPlayingPage /></AuthRequired> } />
            <Route path="/login" element={ <AnonymousRequired><LoginPage /></AnonymousRequired> } />
            <Route path="/logout" element={ <AuthRequired><LogoutPage /></AuthRequired> } />
            <Route path="/lesson/:lessonId" element={<AuthRequired><LessonDetail /></AuthRequired>} />
          </Routes>
        </BrowserRouter>
      </InitialRequired>
    </Provider>
  // </StrictMode>,
)