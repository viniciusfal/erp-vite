import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://uotlwaxreoekdulfqpyj.supabase.co',
  withCredentials: true,
})
