import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice';
import socketReducer from './slices/socketSlice';
import gameReducer from './slices/gameSlice';

export default configureStore({
	reducer: {
        user: userReducer,
        socket: socketReducer,
        game: gameReducer,
    }
})
