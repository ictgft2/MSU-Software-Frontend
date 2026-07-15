import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

if (!baseURL) {
  console.warn(
    "NEXT_PUBLIC_BACKEND_BASE_URL is not set. Requests will use a relative URL."
  );
}

const http = axios.create({
  baseURL: baseURL ?? "",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auth is not available yet — do not force redirect on 401.
    // Keep token cleanup only when a session was present.
    if (error.response?.status === 401 && typeof window !== "undefined") {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("authUser");
    }
    return Promise.reject(error);
  }
);

export default http;
