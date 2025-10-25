import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:2701", // backend NestJS URL mo
  withCredentials: true,
});

export default api;
