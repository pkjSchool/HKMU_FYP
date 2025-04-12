import { useState, useRef, useImperativeHandle, forwardRef } from "react";

import "../../css/PianoCharacter.css";
import { CSSProperties } from "styled-components";

export type PianoCharacterRef = {
    changePositionHandler: (position: CSSProperties) => void;
    setMessageHandler: (message: string) => void;
    showCharacterHandler: () => void;
    hideCharacterHandler: () => void;
}

const PianoCharacter = ({}, ref: React.Ref<PianoCharacterRef>) => {
    const [ position, setPosition ] = useState<CSSProperties>({} as CSSProperties);
    const [ message, setMessage ] = useState<string>("");
    const [ visible, setVisible ] = useState<boolean>(false);

    const messageTyperInterval = useRef<any>(null);
    const messageSequence = useRef<any>(null);
    const messageTyper = useRef<string>("");

    useImperativeHandle(ref, () => ({
        changePositionHandler,
        setMessageHandler,
        showCharacterHandler,
        hideCharacterHandler
    }));

    const setMessageHandler = (message: string) => {
        setMessage("")
        if(messageTyperInterval.current){
            clearInterval(messageTyperInterval.current)
        }
        messageTyper.current = ""
        messageSequence.current = message.split(" ")
        messageTyperInterval.current = setInterval(() => {
            if(messageSequence.current.length > 0){
                const x = messageTyper.current + " " + messageSequence.current.shift()
                messageTyper.current = x
                setMessage(x)
            } else {
                clearInterval(messageTyperInterval.current)
            }
        }, 150)
    }

    const changePositionHandler = (position: CSSProperties) => {
        setPosition(position);
    }

    const showCharacterHandler = () => {
        setVisible(true);
    }

    const hideCharacterHandler = () => {
        setVisible(false);
    }

    if (!visible) return null;

    return (
        <div className="piano-character" style={position} >
            {message && <div className="piano-character-message">{message}</div>}
            <div className="piano-character-image">
                <img src="/src/assets/Character/Image/piano_character.gif" alt="Piano Character" />
            </div>
        </div>
    )
};

export default forwardRef(PianoCharacter);