// src/common/AxiosInstance.js

import axios from "axios";
import SummaryApi, { baseURL } from "../common/summaryApi.js";

// Create an Axios instance with base URL and credentials support
const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Request interceptor: Attach access token to Authorization header if available
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accesstoken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 errors and try refreshing access token
Axios.interceptors.response.use(
  (response) => response, // Pass through successful responses unchanged
  async (error) => {
    const originRequest = error.config;

    // Check if error is 401 Unauthorized and request has not been retried yet
    if (error.response?.status === 401 && !originRequest.retry) {
      originRequest.retry = true; // Mark this request as retried

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {
          // Update the authorization header and retry original request
          originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Axios(originRequest);
        }
      }
    }

    // If token refresh fails or no refresh token, reject the error
    return Promise.reject(error);
  }
);

/**
 * Refresh the access token using the refresh token
 * @param {string} refreshToken
 * @returns {Promise<string|undefined>} new access token or undefined if failed
 */
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await Axios({
      ...SummaryApi.refreshToken, // Contains method, url, etc.
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const accessToken = response.data.data.accessToken;
    localStorage.setItem("accesstoken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
};

export default Axios;
