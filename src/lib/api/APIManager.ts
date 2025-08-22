// api/APIManager.ts
import axios from 'axios';

const APIManager = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  responseType: 'json',
  withCredentials: false,
});

export default APIManager;
