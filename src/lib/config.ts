import dotenv from "dotenv";

dotenv.config();

export default {
	PORT: process.env.PORT || 3000,
	API_URL: process.env.API_URL,
	API_KEY: process.env.API_KEY || "",
	SERVER_IP: process.env.SERVER_IP,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
};
