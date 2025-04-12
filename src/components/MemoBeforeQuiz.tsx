import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import quizBackground from "../assets/quiz_background.jpg";
import placeholderImage from "../assets/ERRORIMG.png"; 
interface TutorialCard {
  title: string;
  content: string;
  imageSrc?: string;
}

interface TutorialProps {
  cards: TutorialCard[];
  onComplete?: () => void;
}

const MemoBeforeQuiz: React.FC<TutorialProps> = ({ cards, onComplete }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholderImage;
  };

  let steps: JSX.Element[] = [];
  for (let i = 0; i < cards.length; i++) {
    const classStr = "step-item" + (currentCardIndex == i ? " active":(currentCardIndex > i?" prev":""))
    steps.push(<div key={i} className={classStr}>{i + 1}</div>);
  }

  return (
    <div
      className="vh-100"
      style={{
        backgroundImage: `url(${quizBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="d-flex flex-column justify-content-center align-items-center">

        <div style={{width: "80%", padding: "40px 0"}}><div className="step-list">{ steps }</div></div>

        <div
          className="card w-50 shadow"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)", 
            minHeight: "70vh",
            margin:"0 auto"
          }}
        >
          <div className="card-header text-center">
            <h5 className="fw-bold">{cards[currentCardIndex].title}</h5>
          </div>
          <div className="card-body text-center">
            {cards[currentCardIndex].imageSrc && (
              <img
                src={cards[currentCardIndex].imageSrc}
                alt="Tutorial"
                className="img-fluid mb-3"
                style={{ maxHeight: "300px", objectFit: "contain" }}
                onError={handleImageError} 
              />
            )}
            <p className="card-text fs-5">{cards[currentCardIndex].content}</p>
          </div>
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="text-muted">
              {currentCardIndex + 1} / {cards.length}
            </span>
            <button
              className={`btn ${
                currentCardIndex === cards.length - 1
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={handleNextCard}
            >
              {currentCardIndex === cards.length - 1 ? "Complete" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoBeforeQuiz;
