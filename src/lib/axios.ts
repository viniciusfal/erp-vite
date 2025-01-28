import axios from 'axios'

export const api = axios.create({
  baseURL: "https://erpnet.tech/api",
  withCredentials: true,
  timeout: 10000,
})
