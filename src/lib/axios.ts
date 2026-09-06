import axios from "axios";
import { error } from "console";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const isAuthRequest =
      config.url?.includes("/api/auth/");
    if (isAuthRequest) {
      return config;
    }
    if (!accessToken && !refreshToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/auth/signin";
      return Promise.reject(new Error("Authentication required"));
    }
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response)=>{
    return response;
  },
  async (error)=>{
    const originalRequest = error.config;
    if(error.response.status !== 401){
      return Promise.reject(error)
    }
    const refreshToken = localStorage.getItem("refreshToken");
    if(!refreshToken){
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      window.location.href = "/auth/signin";
      return Promise.reject(error);
    }
    if(originalRequest._retry){
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      window.location.href = "/auth/signin";
      return Promise.reject(error);
    }
    originalRequest._retry = true;
    try {
      const response = await axios.post("/api/auth/refresh", {
        refreshToken,
      });
      console.log("getting refresh token",response)
      const newAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/auth/signin";
      return Promise.reject(refreshError);
    }

  }
)
export default api;