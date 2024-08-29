import axios from "axios";

const axiosInstance = axios.create({
	baseURL: process.env.API_URL,
	headers: {
		Authorization: process.env.API_KEY,
	},
});

export default axiosInstance;
