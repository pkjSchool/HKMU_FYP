import { useState, useRef, useImperativeHandle, forwardRef } from "react";

import "../../css/PianoCharacter.css";
import { CSSProperties } from "styled-components";

import { useTranslation } from 'react-i18next';

export type PianoCharacterRef = {
    changePositionHandler: (position: CSSProperties) => void;
    setMessageHandler: (message: string) => void;
    showCharacterHandler: () => void;
    hideCharacterHandler: () => void;
}

const PianoCharacter = ({}, ref: React.Ref<PianoCharacterRef>) => {
    const {i18n} = useTranslation();

    const [ position, setPosition ] = useState<CSSProperties>({} as CSSProperties);
    const [ message, setMessage ] = useState<string>("");
    const [ visible, setVisible ] = useState<boolean>(false);

    const characterImage = useRef<HTMLDivElement>(null);

    const messagesplit = useRef<any>("");
    const messageTyperInterval = useRef<any>(null);
    const messageSequence = useRef<any>(null);
    const messageTyper = useRef<string>("");

    useImperativeHandle(ref, () => ({
        changePositionHandler,
        setMessageHandler,
        showCharacterHandler,
        hideCharacterHandler
    }));

    const setAnimate = () => {
        setTimeout(()=> {
            if(characterImage.current){
                characterImage.current.classList.add("animate__bounce")

                setTimeout(()=> {
                    if(characterImage.current){
                        characterImage.current.classList.remove("animate__bounce")
                    }
                }, 1000)
            }
        }, 100)
    }

    const setMessageHandler = (message: string) => {
        setMessage("")
        if(messageTyperInterval.current){
            clearInterval(messageTyperInterval.current)
        }

        setAnimate()

        let split = " ";
        let typerSpeed = 200;
        if(i18n.language == "zh-HK") {
            split = "";
            typerSpeed = 130;
        }
        
        messagesplit.current = split
        messageTyper.current = ""
        messageSequence.current = message.split(messagesplit.current)
        messageTyperInterval.current = setInterval(() => {
            if(messageSequence.current.length > 0){
                const x = messageTyper.current + messagesplit.current + messageSequence.current.shift()
                messageTyper.current = x
                setMessage(x)
            } else {
                clearInterval(messageTyperInterval.current)
            }
        }, typerSpeed)
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
            <div className="piano-character-image animate__animated" ref={characterImage}>
                <img src="/src/assets/Character/Image/piano_character.gif" alt="Piano Character" />
            </div>
        </div>
    )
};

export default forwardRef(PianoCharacter);