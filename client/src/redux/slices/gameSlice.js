import { createSlice } from "@reduxjs/toolkit";

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    players: [],
    guessNumber: 0,
    isGameStarted: false,
    isGameFinished: false,
  },
  reducers: {
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    setGameStarted: (state, action) => {
      state.isGameStarted = action.payload;
    },
    setGuessNumber: (state, action) => {
      state.guessNumber = action.payload;
    },
    setGameFinished: (state, action) => {
      state.isGameFinished = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPlayers, setGameStarted, setGuessNumber, setGameFinished } =
  gameSlice.actions;

export default gameSlice.reducer;
