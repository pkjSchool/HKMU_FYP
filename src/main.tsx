import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './css/bootstrap-modified.css';
import './css/form.css';
import './css/animate.min.css';
import './css/animate.fix.css';

import store from './store/globalConfig.js'
import { Provider } from 'react-redux'

import LessonPage from './LessonPage.tsx'
import LearningPage from './LearningPage.tsx'
import ProfilePage from './ProfilePage.tsx'
import SelfStudyPage from './SelfStudyPage.tsx'
import AiGenerationPage from './AiGenerationPage.tsx'
import MorePage from './MorePage.tsx'
import LoginPage from './LoginPage.tsx'
import TaskPage from './TaskPage.tsx'

import { BrowserRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={ store }>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <App /> } >
            <Route path="/" element={ <LessonPage /> } />
            <Route path="/learning" element={ <LearningPage /> } />
            <Route path="/self-study" element={ <SelfStudyPage /> } />
            <Route path="/task" element={ <TaskPage /> } />
            <Route path="/profile" element={ <ProfilePage /> } />
            <Route path="/ai-generation" element={ <AiGenerationPage /> } />
            <Route path="/more" element={ <MorePage /> } />
          </Route>
          <Route path="/login" element={ <LoginPage /> } />
        </Routes>
      </BrowserRouter>
    </Provider>
  // </StrictMode>,
)
