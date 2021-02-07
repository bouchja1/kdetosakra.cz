import { applyMiddleware, createStore } from 'redux';
import { persistCombineReducers, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducers } from './reducers/rootReducers';

const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
    version: 0,
    whitelist: ['battle', 'result'], // only those will be persisted
};

const persistedCombinedReducers = persistCombineReducers(persistConfig, reducers);

const store = createStore(persistedCombinedReducers, composeWithDevTools(applyMiddleware()));

const persistor = persistStore(store);

export default store;
export { persistor };
