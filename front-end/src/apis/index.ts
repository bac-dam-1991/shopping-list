import axios from 'axios';

export const Client = axios.create({
	baseURL: 'http://localhost:3001/api/v1/',
});
