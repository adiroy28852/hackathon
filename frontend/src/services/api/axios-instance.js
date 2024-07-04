// src/services/api/axios-instance.js
import axios from "axios";
import AuthCookies from "../cookie/authToken.cookie";
const BASE_URL = import.meta.env.VITE_BASE_API_URL;

// Create an Axios instance
const axiosInstance = axios.create();

// Set up a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    config.url = BASE_URL + config.url;

    const token = AuthCookies.GetAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

export default axiosInstance;
