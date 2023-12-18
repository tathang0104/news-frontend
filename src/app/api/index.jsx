import axios from "axios";
import qs from "qs";

const baseURL = process.env.REACT_APP_BE_URL_API

const apiService = axios.create({
  baseURL,
});

const api = {
  get: async (endpoint, params = {}) => {
    try {
      const response = await apiService.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  post: async (endpoint, params = {}, token = "") => {
    console.log(params)
    try {
      const response = await apiService.post(endpoint, { ...params }, {
        headers:
          token && token !== ''
            ? { Authorization: `Bearer ${token}` }
            : {},
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  put: async (endpoint, params = {}) => {
    try {
      const response = await apiService.put(endpoint, { ...params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (endpoint, params = {}) => {
    try {
      const response = await apiService.put(endpoint, { ...params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}

export default api;

export const createQuery = (queryObj = {}) => {
  return qs.stringify(queryObj, { encodeValuesOnly: true });
};