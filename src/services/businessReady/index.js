import axios from "axios";

const BUSINESS_READY_API_URL =
  "https://extdataportal.worldbank.org/api/BReady/api";

const businessReadyClient = axios.create({
  baseURL: BUSINESS_READY_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default businessReadyClient;
