import React from 'react';
import {Sidebar} from './components/Sidebar.tsx';
import LessonMap from './components/LessonMap';

const sampleChapters = [
  {
    title: 'Chapter 1',
    lessons: [
      { id: 1, completed: true, stars: 3 },
      { id: 2, completed: false, stars: 2 },
      { id: 3, completed: false },
      { id: 4, completed: false }
    ]
  },
  {
    title: 'Chapter 2',
    lessons: [
      { id: 5, completed: false },
      { id: 6, completed: false }
    ]
  }
];

function App() {
  const handleLessonClick = (lessonId: number) => {
    console.log(`Lesson ${lessonId} clicked`);
  };

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <LessonMap 
          chapters={sampleChapters.map(chapter => ({
            ...chapter,
            lessons: chapter.lessons.map(lesson => ({
              ...lesson,
              onClick: () => handleLessonClick(lesson.id)
            }))
          }))}
        />
      </main>
    </div>
  );
}

export default App;