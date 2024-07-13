import axios, { type AxiosInstance } from "axios";

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // api 的 base_url
  timeout: 3000, // 请求超时时间
  withCredentials: false, // 禁用 Cookie 等信息
});
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  get: async <T = any>(option: any) => {
    const res = await service({ method: "GET", ...option });
    return res.data as unknown as T;
  },
  post: async <T = any>(option: any) => {
    const res = await service({ method: "POST", ...option });
    return res.data as unknown as T;
  },
  delete: async <T = any>(option: any) => {
    const res = await service({ method: "DELETE", ...option });
    return res.data as unknown as T;
  },
  put: async <T = any>(option: any) => {
    const res = await service({ method: "PUT", ...option });
    return res.data as unknown as T;
  },
  download: async <T = any>(option: any) => {
    const res = await service({
      method: "GET",
      responseType: "blob",
      ...option,
    });
    return res as unknown as Promise<T>;
  },
  upload: async <T = any>(option: any) => {
    option.headersType = "multipart/form-data";
    const res = await service({ method: "POST", ...option });
    return res as unknown as Promise<T>;
  },
};
