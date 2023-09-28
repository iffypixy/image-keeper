import axios from "axios";

export const request = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});
