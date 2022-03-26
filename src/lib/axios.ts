import axios from 'axios';

const baseURL = '/api';

const plataApi = axios.create({
  baseURL,
});

export default plataApi;
