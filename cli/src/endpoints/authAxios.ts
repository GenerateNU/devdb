import axios from "axios";
import { GetCredentials } from "../utils/getCredentials";

export const axiosInstance = axios.create({
  withCredentials: true, // Ensure credentials are sent with every request
});

export const config = {
  baseUrl: process.env.DEVDB_URL ?? "https://routes-orcin.vercel.app",
};

export function SetCookie(credentials: string) {
  axiosInstance.interceptors.request.clear();

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

if (process.env.DEVDB_TOKEN && process.env.DEVDB_URL) {
  config.baseUrl = process.env.DEVDB_URL;
  SetCookie(GetCredentials(process.env.DEVDB_TOKEN));
}
