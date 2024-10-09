import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import accountSlice from './Slices/accountSlice';
import chatsSlice from './Slices/chatsSlice';
import { combineReducers } from 'redux';

const accountPersistConfig = {
  key: 'Account',
  storage,
};

const persistedAccountReducer = persistReducer(accountPersistConfig, accountSlice.reducer);

const rootReducer = combineReducers({
  Account: persistedAccountReducer,
  Chats: chatsSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

const persistor = persistStore(store);

export { store, persistor };