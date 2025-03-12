import { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import LessonMap from '../components/LessonMap';
import TaskProgress from '../components/TaskProgress';
import PianoCharacter from '../components/Character/PianoCharacter';

// import { showCharacter, hideCharater, setMessage, changePosition } from '../store/pianoCharacherSlice';
// import { AppDispatch, RootState } from '../store/globalConfig';
import { handleShowCharacter, handleHideCharacter, handleSetMessage, changeCharacterPosition } from '../access_control/piano_character.tsx';
import { getLoginedUser } from '../access_control/user.tsx';

export const sampleChapters = [
  {
    ref_id: 1,
    title: "Chapter 1",
    lessons: [
      { id: "ch1-1", ref_id: 1, completed: true, stars: 3 },
      { id: "ch1-2", ref_id: 2, completed: false, stars: 2 },
      { id: "ch1-3", ref_id: 3, completed: false },
      { id: "ch1-4", ref_id: 4, completed: false },
    ],
  },
  {
    ref_id: 2,
    title: "Chapter 2",
    lessons: [
      { id: "ch2-1", ref_id: 1, completed: false },
      { id: "ch2-2", ref_id: 2, completed: false },
    ],
  },
  {
    ref_id: 3,
    title: "Chapter 3",
    lessons: [
      { id: "ch3-1", ref_id: 1, completed: false },
      { id: "ch3-2", ref_id: 2, completed: false },
    ],
  },
];

function App() {
  const handleLessonClick = (lessonId: string) => {
    console.log(`Lesson ${lessonId} clicked`);
  };

  const dispatch = useDispatch();

  const userInfo = getLoginedUser();

  useEffect(() => {
    handleShowCharacter(dispatch);
    handleSetMessage(dispatch, `Hello, ${userInfo.displayName}! Welcome back!`);
  }, [])

  return (
    <div className="lesson-index-container">
        <button onClick={() => handleShowCharacter(dispatch)}>Show Character</button>
        <button onClick={() => handleHideCharacter(dispatch)}>Hide Character</button>
        <button onClick={() => handleSetMessage(dispatch,`Hello, ${Math.random().toFixed(3)}! Welcome back!`)}>Set Message</button>
        <button onClick={() => changeCharacterPosition(dispatch)}>Change Position</button>
        <LessonMap 
          chapters={sampleChapters.map(chapter => ({
            ...chapter,
            lessons: chapter.lessons.map(lesson => ({
              ...lesson,
              onClick: () => handleLessonClick(lesson.id)
            }))
          }))}
        />
        <TaskProgress />
        <PianoCharacter /> 
    </div>
  );
}

export default App;
