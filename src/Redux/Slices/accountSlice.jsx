import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    displayName: "",
    password: "",
    profilePic: "",
    phone: "",
    email: "",
    chats: [],
    bio: "",
    id: "",
    blocked: [],
};

const accountSlice = createSlice({
    name: 'Account',
    initialState,
    reducers: {
        setAccount: (state, action) => {
            state.displayName = action.payload.displayName;
            state.password = action.payload.password;
            state.profilePic = action.payload.profilePic;
            state.phone = action.payload.phone;
            state.email = action.payload.email;
            state.chats = action.payload.chats;
            state.bio = action.payload.bio;
            state.id = action.payload.id;
            state.blocked = action.payload.blocked;
        },
        resetAccount: (state) => {
            state.displayName = "";
            state.password = "";
            state.profilePic = "";
            state.phone = "";
            state.email = "";
            state.chats = [];
            state.bio = "";
            state.id = "";
            state.blocked = [];
        },
        updateDisplayName: (state, action) => {
            state.displayName = action.payload;
        },
        updatePassword: (state, action) => {
            state.password = action.payload;
        },
        updateBio: (state, action) => {
            state.bio = action.payload;
        },
        addAccountChat: (state, action) => {
            state.chats.push(action.payload);
        },
        updateAccountChat: (state, action) => {
            state.chats = action.payload.chats;
        },
        updateBlocked: (state, action) => {
            state.blocked = action.payload.blocked;
        }
    },
});

export const { setAccount, resetAccount, updatePassword, updateBio, updateDisplayName, addAccountChat, updateAccountChat, updateBlocked} = accountSlice.actions;
export default accountSlice;
