import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://erp.up.railway.app',
  withCredentials: true,
})
