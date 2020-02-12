import { createStore } from 'redux';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

import rootReducer from './reducers';

/*
const persistConfig = {
    key: 'root',
    storage: storage
};
*/

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
    let store = createStore(/* persistedReducer */rootReducer);
    // let persistor = persistStore(store);
    return /*{ */store/*, persistor }*/;
};