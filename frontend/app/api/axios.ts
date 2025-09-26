import axios from "axios";

const apiClient = (auth: boolean = false) => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(auth && { "Authorization": "Bearer " + localStorage.getItem("token") })
    }
  });
};

export default apiClient;