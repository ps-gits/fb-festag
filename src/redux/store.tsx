import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { createWrapper } from 'next-redux-wrapper';
import { configureStore, Reducer } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';

import { rootReducer } from './reducer/rootReducer';

const persistConfig = {
  key: 'root',
  storage: storage,
};
const persistedReducer = persistReducer(
  persistConfig,
  rootReducer as unknown as Reducer
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  devTools: true,
});

export default store;
const makeStore = () => store;
export const persistor = persistStore(store);
export const wrapper = createWrapper(makeStore);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
