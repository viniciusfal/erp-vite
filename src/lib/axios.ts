import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://erp-1xqz.onrender.com',
  withCredentials: true,
})
