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
  },

  uploadImage: async (image, cancelToken) => {
    const localToken =
      localStorage.getItem('authToken')
    const formData = new FormData()
    formData.append('files', image)

    return await axios.request({
      url: process.env.REACT_APP_BE_URL_API + 'upload',
      method: 'POST',
      headers:
        localToken && localToken !== ''
          ? { Authorization: `Bearer ${localToken}` }
          : {},
      data: formData,
      ...(cancelToken ? { cancelToken } : {}),
    })
  },
  uploadMultiImage: async (images) => {
    const localToken =
      localStorage.getItem('authToken')
    const formData = new FormData()
    for (let i = 0; i < images.length; i++) {
      formData.append('files', images[i])
    }

    return await axios.request({
      url: process.env.REACT_APP_BE_URL_API + 'upload',
      method: 'POST',
      headers:
        localToken && localToken !== ''
          ? { Authorization: `Bearer ${localToken}` }
          : {},
      data: formData,
    })
  },
}

export default api;

export const createQuery = (queryObj = {}) => {
  return qs.stringify(queryObj, { encodeValuesOnly: true });
};

export const generateSlug = (name) => {
  return name
    .toLowerCase() // Chuyển đổi tất cả thành chữ thường
    .normalize('NFD') // Chuẩn hóa chuỗi Unicode
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các ký tự có dấu
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
    .replace(/đ/g, 'd') // Thay thế ký tự đặc biệt dạng "đ" thành "d"
    .replace(/[^\w\\-]+/, '') // Loại bỏ các ký tự không phải chữ cái, số hoặc gạch ngang
    .replace(/\\-\\-+/, '-') // Loại bỏ nhiều hơn một dấu gạch ngang liên tiếp
    .replace(/^-+/, '') // Loại bỏ các dấu gạch ngang ở đầu chuỗi
    .replace(/-+$/, '') // Loại bỏ các dấu gạch ngang ở cuối chuỗi
}