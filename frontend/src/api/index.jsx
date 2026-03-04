import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
const PREFIX = import.meta.env.VITE_API_PREFIX || "/api";

export const api = axios.create({
  baseURL: `${BASE}${PREFIX}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

function fullUrlFromConfig(config) {
  try {
    return `${config.baseURL?.replace(/\/$/, "") || ""}${config.url || ""}`;
  } catch {
    return config.url || "";
  }
}

api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    try {
      const full = fullUrlFromConfig(config);
      console.debug(`[api request] ${String(config.method).toUpperCase()} ${full}`);
    } catch (e) {}

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => {
    try {
      const full = fullUrlFromConfig(res.config);
      console.debug(`[api response] ${res.status} ${full}`);
    } catch (e) {}
    return res;
  },
  (error) => {
    const resp = error.response;
    const cfg = error.config || {};
    const attempted = fullUrlFromConfig(cfg);

    // normalize message
    const respData = resp?.data;
    const message =
      respData?.message ||
      respData?.error ||
      (typeof respData === "string" ? respData : undefined) ||
      error.message ||
      "Unknown error";

    if (resp?.status === 401) {
      // auto-clear stored auth on 401
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // optional: you can redirect to login here if desired:
      // window.location.href = '/login';
    }

    console.error(`[api error] ${message} on ${attempted}`, respData || "");

    // attach a friendly message for callers
    error.userMessage = message;
    return Promise.reject(error);
  }
);
