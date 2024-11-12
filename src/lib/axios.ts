import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api-erp-amazonia.up.railway.app/',
  withCredentials: true,
})
