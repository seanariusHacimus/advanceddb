import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./Auth/reducer";
import actionsReducer from "./Actions/reducer";
import notificationsReducer from "./Notifications/reducer";
import localeReducer from "./Locale/reducer";
import workingGroupsReducer from "./WorkingGroups/reducer";
import selectedWorkingGroupReducer from "./SelectedIndicator/reducer";
import rocketAuth from "./RocketAuth/reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import firebase from "firebase/app";
import "firebase/messaging";

// TODO move to json file
const firebaseConfig = {
  apiKey: "AIzaSyCcb9xDE2h2RL8EdNBZeoRFVr_UpIGkX3k",
  authDomain: "advance-db.firebaseapp.com",
  databaseURL: "https://advance-db.firebaseio.com",
  projectId: "advance-db",
  storageBucket: "advance-db.appspot.com",
  messagingSenderId: "999381263393",
  appId: "1:999381263393:web:41bdfd53b4ce9c5179ef60",
  measurementId: "G-05J0E83MNF",
};

firebase.initializeApp(firebaseConfig);

let messaging = "";
if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
} else {
  messaging = {
    apiKey: "AIzaSyCcb9xDE2h2RL8EdNBZeoRFVr_UpIGkX3k",
    authDomain: "advance-db.firebaseapp.com",
    databaseURL: "https://advance-db.firebaseio.com",
    projectId: "advance-db",
    storageBucket: "advance-db.appspot.com",
    appId: "1:999381263393:web:41bdfd53b4ce9c5179ef60",
    measurementId: "G-05J0E83MNF",
  };
}

const rootReducer = combineReducers({
  auth: authReducer,
  actions: actionsReducer,
  selectedWorkingGroup: selectedWorkingGroupReducer,
  workingGroups: workingGroupsReducer,
  notifications: notificationsReducer,
  locales: localeReducer,
  rocketAuth,
});

const persistConfig = {
  key: "root",
  whitelist: ["auth", "workingGroups", "locales"],
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  {},
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);
const persistor = persistStore(store);

export { store as default, persistor, messaging, firebase };
