import axios from "axios";

export const axiosInstance = axios.create({
  withCredentials: true, // Ensure credentials are sent with every request
});

export const config = {
  baseUrl: "https://routes-orcin.vercel.app",
};

export function SetCookie(credentials: string) {
  // Add a request interceptor to include the cookie in the headers
  axiosInstance.interceptors.request.use(
    (config) => {
      // Set the cookie in the header
      config.headers.Cookie = credentials;

      return config;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    },
  );
}
