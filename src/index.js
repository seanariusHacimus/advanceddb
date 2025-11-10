import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import * as serviceWorker from "./serviceWorker";
import App from "./components/App";
import "./styles/index.css";
import GlobalStyle from "./styles/global";
import moment from "moment-timezone";
import Spinner from "./components/UI/Spinner";
import { ThemeProvider } from "./components/UI/ThemeProvider";
import { ToastProvider } from "./components/UI/shadcn/toast";

// To switch to different time zone, just edit this line
moment.tz.setDefault("EST");

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <PersistGate loading={<Spinner />} persistor={persistor}>
      <ThemeProvider>
        <ToastProvider>
          <App />
          <GlobalStyle />
        </ToastProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
