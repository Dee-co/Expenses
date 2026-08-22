import api from "@/lib/axios";

export const apiService = {
  get: <T>(url: string, params?: object): Promise<T> => {
    return api
      .get<T>(url, { params })
      .then((response) => response.data);
  },

  post: <T>(url: string, data?: object): Promise<T> => {
    return api
      .post<T>(url, data)
      .then((response) => response.data);
  },

  put: <T>(url: string, data?: object): Promise<T> => {
    return api
      .put<T>(url, data)
      .then((response) => response.data);
  },

  patch: <T>(url: string, data?: object): Promise<T> => {
    return api
      .patch<T>(url, data)
      .then((response) => response.data);
  },

  delete: <T>(url: string): Promise<T> => {
    return api
      .delete<T>(url)
      .then((response) => response.data);
  },
};