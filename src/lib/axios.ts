import axios from 'axios'

export const api = axios.create({
  baseURL: "https://erpnet.up.railway.app/api",
  withCredentials: true,
  timeout: 10000,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config

})