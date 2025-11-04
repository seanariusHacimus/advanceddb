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
import approvalsReducer from "./Approvals/reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import firebase from "firebase/app";
import "firebase/messaging";

// TODO move to json file
const firebaseConfig = {
  apiKey: "AIzaSyCyppsoRuJm1jgYFcVYyIpmkvghtYTf50o",
  authDomain: "alpha-advance-db.firebaseapp.com",
  databaseURL:
    "https://alpha-advance-db-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "alpha-advance-db",
  storageBucket: "alpha-advance-db.firebasestorage.app",
  messagingSenderId: "514045603907",
  appId: "1:514045603907:web:faa67df1fca7b32419e4f6",
  measurementId: "G-ERG7449VRG",
};

firebase.initializeApp(firebaseConfig);

let messaging = "";
if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
} else {
  messaging = firebaseConfig;
}

const rootReducer = combineReducers({
  auth: authReducer,
  actions: actionsReducer,
  approvals: approvalsReducer,
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
