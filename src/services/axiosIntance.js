// src/axiosInstance.js
import axios from "axios";

// Axios instance yaratish
const axiosInstance = axios.create({
  baseURL: "https://back.ifly.com.uz/api/auth",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken"); // LocalStorage’dan access token olish
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`; // Access tokenni so‘rovga qo‘shish
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // Yangi access token bilan so‘rovni qayta yuborish
      } catch (refreshError) {
        console.error("Refresh token yangilashda xatolik:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  try {
    const response = await axiosInstance.post(
      "/refresh-token",
      {},
      { withCredentials: true }
    );
    const newAccessToken = response.data.accessToken;
    localStorage.setItem("accessToken", newAccessToken); // Yangi access tokenni saqlash
    return newAccessToken;
  } catch (error) {
    console.error("Refresh token yangilashda xatolik:", error);
    throw error;
  }
};

export default axiosInstance;
