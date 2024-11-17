import axios from 'axios';
import { MODEL_HOST } from './config';

const api_model = axios.create({
  baseURL: `http://${MODEL_HOST}`,
});

export default api_model;
