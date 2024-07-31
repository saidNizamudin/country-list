import AxiosInstances from "axios";

const axios = AxiosInstances.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export default axios;
