import { useSelector } from "react-redux";
import { RootState } from "../../store/globalConfig";

import "../../css/PianoCharacter.css";
import { CSSProperties } from "styled-components";

const PianoCharacter = () => {
    const { isVisible, message, position } = useSelector((state: RootState) => state.pianoCharacterSlice);

    if (!isVisible) return null;

    return (
        <div className="piano-character" style={position as CSSProperties}>
            {message && <div className="piano-character-message">{message}</div>}
            <div className="piano-character-image">
                <img src="src/assets/Character/Image/piano_character.png" alt="Piano Character" />
            </div>
        </div>
    );
};

export default PianoCharacter;