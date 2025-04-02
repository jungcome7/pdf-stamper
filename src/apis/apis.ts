import axios from "axios";

const apis = axios.create({
  baseURL: "",
});

apis.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

apis.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);

export default apis;
