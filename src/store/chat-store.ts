import { applyMiddleware, combineReducers, createStore } from "redux";
import { chatReducer } from "../reducers/chat-reducer";
import thunk from 'redux-thunk';

// Создаем корневой редьюсер
const rootReducer = combineReducers({
  chat: chatReducer,
});

// Создаем store с применением middleware
export const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppDispatch = typeof store.dispatch

export type AppRootStateType = ReturnType<typeof store.getState>

