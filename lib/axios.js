const axios = require("axios");

const axiosInstance = axios.create({
	baseURL: process.env.API_URL,
	headers: {
		Authorization: process.env.API_KEY,
	},
});

module.exports = axiosInstance;
