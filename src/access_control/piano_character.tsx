import { AppDispatch } from '../store/globalConfig';
import { showCharacter, hideCharater, setMessage, changePosition } from '../store/pianoCharacherSlice';

const handleShowCharacter = (dispatch: AppDispatch) => {
dispatch(showCharacter());
};

const handleHideCharacter = (dispatch: AppDispatch) => {
dispatch(hideCharater());
};

const handleSetMessage = (dispatch: AppDispatch, message: string) => {
dispatch(setMessage(message));
};

const changeCharacterPosition = (dispatch: AppDispatch) => {
dispatch(changePosition({ right: Math.floor(Math.random() * (100 - 1) + 1), bottom: Math.floor(Math.random() * (100 - 1) + 1) }));
};

export { handleShowCharacter, handleHideCharacter, handleSetMessage, changeCharacterPosition };