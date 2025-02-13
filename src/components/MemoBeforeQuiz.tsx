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

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      style={{
        backgroundImage: `url(${quizBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card w-50 shadow"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
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
  );
};

export default MemoBeforeQuiz;
