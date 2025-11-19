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
    try {
      const spinnerContainer = document.getElementById("spinner-container");
      const spinnerText = document.querySelector("#spinner-container .ant-spin-text");
      
      if (spinnerText) {
        spinnerText.innerHTML = isSimulatorActive ? "Calculating..." : "Loading...";
      }
      
      if (spinnerContainer) {
        spinnerContainer.classList.add("show");
      }
    } catch (err) {
      console.warn("Spinner not found:", err);
    }
  }

  // TODO try to add PersistGates
  try {
    const token =
      store.getState().auth.access_token ||
      (localStorage["persist:root"]
        ? JSON.parse(JSON.parse(localStorage["persist:root"]).auth).access_token
        : "");
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  } catch (err) {
    console.warn("Failed to get auth token:", err);
  }
  
  return config;
});

axios.interceptors.response.use(
  (res) => {
    if (!res.config.hideSpinner) {
      try {
        document.getElementById("spinner-container")?.classList.remove("show");
      } catch (err) {
        console.warn("Failed to hide spinner:", err);
      }
    }
    return res;
  },
  (error) => {
    console.error("Axios error:", error);
    
    // Hide spinner on error
    try {
      document.getElementById("spinner-container")?.classList.remove("show");
    } catch (err) {
      console.warn("Failed to hide spinner:", err);
    }
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      console.log("Unauthorized - signing out");
      store.dispatch({ type: SIGN_OUT_SUCCESS });
    }
    
    return Promise.reject(error);
  }
);

export default axios;
