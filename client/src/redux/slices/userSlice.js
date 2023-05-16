import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    points: 0,
    multiplyer: 1,
    score: 1000,
    speed: 1,
    isGamingMode: false,
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setPoints: (state, action) => {
      const points = action.payload;
      state.points = points < 0 ? 0 : points;
    },
    setMultiplyer: (state, action) => {
      const multiplyer = action.payload;
      state.multiplyer = multiplyer < 0 ? 0 : multiplyer;
    },
    setScore: (state, action) => {
      state.score = action.payload;
    },
    setSpeed: (state, action) => {
      state.speed = action.payload;
    },
    changeGameMode: (state, action) => {
      state.isGamingMode = !action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setName,
  setPoints,
  setMultiplyer,
  setScore,
  setSpeed,
  changeGameMode,
} = userSlice.actions;

export default userSlice.reducer;
