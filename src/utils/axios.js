import Axios from "axios";
import store from "../store";
import { SIGN_OUT_SUCCESS } from "../store/Auth/actionTypes";

export const rocketAxios = Axios.create({
  baseURL: process.env.REACT_APP_ROCKET_API_URL,
});

const axios = Axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3002/api",
});

axios.interceptors.request.use((config) => {
  const isSimulatorActive = window.location.pathname.endsWith("simulator");
  if (!config.hideSpinner) {
    if (isSimulatorActive) {
      document.querySelector("#spinner-container .ant-spin-text").innerHTML =
        "Calculating...";
      document.getElementById("spinner-container").classList.add("show");
    } else {
      document.querySelector("#spinner-container .ant-spin-text").innerHTML =
        "Loading...";
      document.getElementById("spinner-container").classList.add("show");
    }
  }

  // TODO try to add PersistGates
  const token =
    store.getState().auth.access_token ||
    (localStorage["persist:root"]
      ? JSON.parse(JSON.parse(localStorage["persist:root"]).auth).access_token
      : "");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

axios.interceptors.response.use(
  (res) => {
    if (!res.config.hideSpinner) {
      document.getElementById("spinner-container")?.classList.remove("show");
    }
    return res;
  },
  (error) => {
    console.error(error);
    // if (!config.hideSpinner) {
    document.getElementById("spinner-container")?.classList.remove("show");
    // }
    if (!error.message.includes("422")) {
      if (error.message.includes("401")) {
        return store.dispatch({ type: SIGN_OUT_SUCCESS });
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
