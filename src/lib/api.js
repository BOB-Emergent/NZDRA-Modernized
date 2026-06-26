import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("nzdra_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Prevent crash if API returns HTML (e.g. on 404/redirect) instead of JSON
api.interceptors.response.use(
    (response) => {
        // If we expect JSON but get HTML, return an empty array/object to prevent .map crashes
        if (typeof response.data === "string" && response.data.trim().startsWith("<!DOCTYPE")) {
            console.warn("API returned HTML instead of JSON for:", response.config.url);
            return { ...response, data: [] };
        }
        return response;
    },
    (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);
