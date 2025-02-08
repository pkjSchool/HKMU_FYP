import { createRoot } from 'react-dom/client'
import App from './pages/App.tsx'

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
import store from './store/globalConfig.js'
import { Provider } from 'react-redux'

import LessonPage from './pages/LessonPage.tsx'
import LearningPage from './pages/LearningPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import SelfStudyPage from './pages/SelfStudyPage.tsx'
import AiGenerationPage from './pages/AiGenerationPage.tsx'
import MorePage from './pages/MorePage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import PianoPlayingPage from './PianoPlayingPage.tsx'
import TaskPage from './pages/TaskPage.tsx'
import LessonDetail from './pages/LessonDetail.tsx'

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={ store }>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <App /> } >
            <Route path="/" element={ <LessonPage /> } />
            <Route path="/learning" element={ <LearningPage /> } />
            <Route path="/self-study" element={ <Navigate to="/playing" replace={true} /> } />
            <Route path="/task" element={ <TaskPage /> } />
            <Route path="/profile" element={ <ProfilePage /> } /> 
            <Route path="/ai-generation" element={ <AiGenerationPage /> } />
            <Route path="/more" element={ <MorePage /> } />
          </Route>
          <Route path="/music-player" element={ <SelfStudyPage /> } />
          <Route path="/playing" element={ <PianoPlayingPage /> } />
          <Route path="/login" element={ <LoginPage /> } />
          <Route path="/lesson/:lessonId" element={<LessonDetail />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  // </StrictMode>,
)