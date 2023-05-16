import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
const socket = io.connect("http://localhost:5002", {
  query: {
    username: localStorage.getItem("username") || "User",
  },
});

export const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket,
    messages: [],
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    close: (state, action) => {
      state.socket.close();
    },
    sendMessage: (state, action) => {
      state.socket.emit("message", action.payload);
    },
    recieveMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSocket, close, sendMessage, recieveMessage } =
  socketSlice.actions;

export default socketSlice.reducer;
