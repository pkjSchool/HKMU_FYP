import LessonMap from './components/LessonMap';
import './css/App.css';

const sampleChapters = [
  {
    title: 'Chapter 1',
    lessons: [
      { id: 'ch1-1', completed: true, stars: 3 },
      { id: 'ch1-2', completed: false, stars: 2 },
      { id: 'ch1-3', completed: false },
      { id: 'ch1-4', completed: false }
    ]
  },
  {
    title: 'Chapter 2',
    lessons: [
      { id: 'ch2-1', completed: false },
      { id: 'ch2-2', completed: false }
    ]
  }
];

function App() {
  const handleLessonClick = (lessonId: string) => {
    console.log(`Lesson ${lessonId} clicked`);
  };

  return (
        <LessonMap 
          chapters={sampleChapters.map(chapter => ({
            ...chapter,
            lessons: chapter.lessons.map(lesson => ({
              ...lesson,
              onClick: () => handleLessonClick(lesson.id)
            }))
          }))}
        />
  );
}

export default App;
