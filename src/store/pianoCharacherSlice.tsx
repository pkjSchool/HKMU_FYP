import { createSlice } from "@reduxjs/toolkit";

interface PianoCharacterState {
    isVisible: boolean;
    message: string;
    position: { right: number, bottom: number };
}

const initialStates: PianoCharacterState = {
    isVisible: false,
    message: '',
    position: { right: 50, bottom: 15 },
};

const pianoCharacter = createSlice({
    name: "pianoCharacter",
    initialState: initialStates,
    reducers: {
        showCharacter(state) {
            state.isVisible = true;
        },
        hideCharater(state) {
            state.isVisible = false;
        },
        setMessage(state, action) {
            state.message = action.payload;
        },
        changePosition(state, action) {
            state.position = action.payload;
        }
    },
});

export type { PianoCharacterState };
export const { showCharacter, hideCharater, setMessage, changePosition } = pianoCharacter.actions;
export default pianoCharacter.reducer;