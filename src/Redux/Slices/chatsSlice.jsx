import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats: [],
};

const chatsSlice = createSlice({
    name: 'Chats',
    initialState,
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload.chats;
        },
        addChat: (state, action) => {
            if(action.payload.chatId === state.chats.length) {
                state.chats.push(action.payload);
                return;
            }
            const existingChat = state.chats.find(c => c.chatId === action.payload.chatId);
            if (!existingChat) {
                state.chats.splice(action.payload.chatId, 0, action.payload);
            };
        },
        resetChats: (state) => {
            state.chats = [];
        },
    },
});

export const { setChats, resetChats, addChat } = chatsSlice.actions;
export default chatsSlice;
