import { useParams } from "react-router-dom";
import Ch1_1 from "./lesson_component/ch1-1";
import Ch1_2 from "./lesson_component/ch1-2";

type LessonComponent = () => JSX.Element;

interface LessonMap {
  [key: string]: LessonComponent;
}

const lessonPageMap: LessonMap = {
  "ch1-1": Ch1_1,
  "ch1-2": Ch1_2,
};

const LessonDetail = () => {
  const { lessonId } = useParams<{ lessonId: string }>();

  const LessonComponent = lessonPageMap[lessonId || ""];

  if (!LessonComponent) {
    return <div>level not fine</div>;
  }

  return <LessonComponent />;
};

export default LessonDetail;
