import axios from "axios";

export const request = axios.create({
  // @todo: baseURL to .env
  baseURL: "http://localhost:8000",
  withCredentials: true,
});
