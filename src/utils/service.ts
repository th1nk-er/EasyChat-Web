import { useUserStore } from '@/stores/user';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // api 的 base_url
  timeout: 10000, // 请求超时时间
  withCredentials: false, // 禁用 Cookie 等信息
});
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.getUserToken?.token)
      config.headers.Authorization = userStore.getUserToken?.token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    if (response.data && response.data.code != 200) {
      ElMessage.error(response.data.message);
      return Promise.reject(response);
    }
    return response;
  },
  (error) => {
    if (
      error.response != undefined &&
      (error.response.status == 401 || error.response.status == 403)
    ) {
      ElMessage.error('请先登录');
      const userStore = useUserStore();
      userStore.removeToken();
      window.location.href = `/login?redirect=${window.location.href}`;
      return Promise.reject(error);
    }
    ElMessage.error('请求出错');
    return Promise.reject(error);
  }
);

export default {
  get: async <T = any>(option: AxiosRequestConfig) => {
    const res = await service({ method: 'GET', ...option });
    return res.data as unknown as T;
  },
  post: async <T = any>(option: AxiosRequestConfig) => {
    const res = await service({ method: 'POST', ...option });
    return res.data as unknown as T;
  },
  delete: async <T = any>(option: AxiosRequestConfig) => {
    const res = await service({ method: 'DELETE', ...option });
    return res.data as unknown as T;
  },
  put: async <T = any>(option: AxiosRequestConfig) => {
    const res = await service({ method: 'PUT', ...option });
    return res.data as unknown as T;
  },
  download: async <T = any>(option: AxiosRequestConfig) => {
    const res = await service({
      method: 'GET',
      responseType: 'blob',
      ...option,
    });
    return res as unknown as Promise<T>;
  },
  upload: async <T = any>(option: AxiosRequestConfig) => {
    option.headers = {
      'Content-Type': 'multipart/form-data',
      ...option.headers,
    };
    const res = await service({ method: 'POST', ...option });
    return res.data as unknown as T;
  },
};
