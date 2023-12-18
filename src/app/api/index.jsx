import axios from "axios";
import qs from "qs";

const baseURL = process.env.REACT_APP_BE_URL_API

const apiService = axios.create({
  baseURL,
});

const api = {
  get: async (endpoint, params = {}, token = "") => {
    try {
      const response = await apiService.get(endpoint, {
        params: params, headers:
          token && token !== ''
            ? { Authorization: `Bearer ${token}` }
            : {},
      });
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
  postComment: async (apiName = '', articleId, dataSend, token = "") => {
    const url = process.env.REACT_APP_BE_URL_API + `comments/${apiName}:${articleId}`
    const data = {
      content: dataSend.content,
      threadOf: dataSend.threadOf
    }
    return await axios.request({
      method: 'POST',
      url,
      headers:
        token && token !== ''
          ? { Authorization: `Bearer ${token}` }
          : {},
      data: {
        ...data,
        ...(!token || token === '')
          ? {
            author: {
              id: dataSend.authorId,
              name: dataSend.username,
              email: dataSend.email,
              avatar: dataSend.avatar || '/logo512.png',
            },
          }
          : {}
      }
    })
  }

}

export default api;

export const createQuery = (queryObj = {}) => {
  return qs.stringify(queryObj, { encodeValuesOnly: true });
};