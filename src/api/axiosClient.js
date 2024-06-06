import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
});

axiosClient.interceptors.response.use((response) => {
  if (response.status === 401) {
      console.log('Unauthorized');
   window.location.href = '/login';
  }
  return response;
});

export default axiosClient;
