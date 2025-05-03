import Redis from "ioredis";

import axiosInstance from "../lib/axios";
import config from "../lib/config";

const redis = new Redis({
	host: config.SERVER_IP,
	password: config.REDIS_PASSWORD,
});

class AppService {
	static async getSiteSettings() {
		try {
			const cachedData = await redis.get("siteSettings");

			if (cachedData) {
				return JSON.parse(cachedData);
			} else {
				console.log("request:getSiteSettings");

				const enRequest = await axiosInstance.get(
					`/pages/${407}?_fields=acf&acf_format=standard`,
				);
				const trRequest = await axiosInstance.get(
					`/pages/${276}?_fields=acf&acf_format=standard`,
				);
				const data = {
					en: enRequest.data.acf,
					tr: trRequest.data.acf,
				};

				await redis.set("siteSettings", JSON.stringify(data), "EX", 3600);

				return data;
			}
		} catch (error) {
			console.error(error);
		}
	}

	static async getHomePageSettings() {
		try {
			const cachedData = await redis.get("homePageSettings");

			if (cachedData) {
				return JSON.parse(cachedData);
			} else {
				console.log("request:getHomePageSettings");

				const enRequest = await axiosInstance.get(
					`/pages/${429}?_fields=acf&acf_format=standard`,
				);
				const trRequest = await axiosInstance.get(
					`/pages/${194}?_fields=acf&acf_format=standard`,
				);
				const data = {
					en: enRequest.data.acf,
					tr: trRequest.data.acf,
				};

				await redis.set("homePageSettings", JSON.stringify(data), "EX", 3600);

				return data;
			}
		} catch (error) {
			console.error(error);
		}
	}

	static async getSectoralNozzles() {
		try {
			const cachedData = await redis.get("sectoralNozzles");

			if (cachedData) {
				return JSON.parse(cachedData);
			} else {
				console.log("request:getSectoralNozzles");

				const enRequest = await axiosInstance.get(
					`/sectoral_nozzle?_fields=id,slug,title,acf,lang&acf_format=standard&lang=${"en"}`,
				);
				const trRequest = await axiosInstance.get(
					`/sectoral_nozzle?_fields=id,slug,title,acf,lang&acf_format=standard&lang=${"tr"}`,
				);
				const data = {
					en: enRequest.data,
					tr: trRequest.data,
				};

				await redis.set("sectoralNozzles", JSON.stringify(data), "EX", 3600);

				return data;
			}
		} catch (error) {
			console.error(error);
		}
	}

	static async getProductsPageSettings() {
		try {
			const cachedData = await redis.get("productsPageSettings");

			if (cachedData) {
				return JSON.parse(cachedData);
			} else {
				console.log("request:getProductsPageSettings");

				const enRequest = await axiosInstance.get(
					`/pages/${983}?_fields=acf&acf_format=standard`,
				);
				const trRequest = await axiosInstance.get(
					`/pages/${981}?_fields=acf&acf_format=standard`,
				);
				const data = {
					en: enRequest.data.acf,
					tr: trRequest.data.acf,
				};

				await redis.set("productsPageSettings", JSON.stringify(data), "EX", 3600);

				return data;
			}
		} catch (error) {
			console.error(error);
		}
	}

	static async getProductCategories() {
		try {
			const cachedData = await redis.get("productCategories");

			if (cachedData) {
				return JSON.parse(cachedData);
			} else {
				console.log("request:getProductCategories");

				const enRequest = await axiosInstance.get(
					`/product_category?_fields=id,slug,name,description,count,lang,translations,acf&acf_format=standard&per_page=100&lang=${"en"}`,
				);
				const trRequest = await axiosInstance.get(
					`/product_category?_fields=id,slug,name,description,count,lang,translations,acf&acf_format=standard&per_page=100&lang=${"tr"}`,
				);
				const data = {
					en: enRequest.data,
					tr: trRequest.data,
				};

				await redis.set("productCategories", JSON.stringify(data), "EX", 3600);

				return data;
			}
		} catch (error) {
			console.error(error);
		}
	}

	static async getProductsByCategory(lang: any, categoryId: any) {
		try {
			const request = await axiosInstance.get(
				`/product?_fields=id,status,slug,title,product_category,acf,lang,translations&acf_format=standard&per_page=100&lang=${lang}&product_category=${categoryId}`,
			);

			return request.data;
		} catch (error) {
			console.error(error);
		}
	}

	static async getProductBySlug(lang: any, slug: any) {
		try {
			const request = await axiosInstance.get(
				`/product?_fields=id,status,slug,title,product_category,acf,lang,translations&acf_format=standard&lang=${lang}&slug=${slug}`,
			);

			return request.data[0];
		} catch (error) {
			console.error(error);
		}
	}

	static async getProductByID(lang: any, id: any) {
		try {
			const request = await axiosInstance.get(
				`/product/${id}?_fields=id,status,slug,title,product_category,acf,lang,translations&acf_format=standard`,
			);

			return request.data;
		} catch (error) {
			console.error(error);
		}
	}

	static async getGalleryPageSettings() {
		try {
			const cachedData = await redis.get("galleryPageSettings");

			if (cachedData) {
				return JSON.parse(cachedData);
			} else {
				console.log("request:getGalleryPageSettings");

				const enRequest = await axiosInstance.get(
					`/pages/${979}?_fields=acf&acf_format=standard`,
				);
				const trRequest = await axiosInstance.get(
					`/pages/${977}?_fields=acf&acf_format=standard`,
				);
				const data = {
					en: enRequest.data.acf,
					tr: trRequest.data.acf,
				};

				await redis.set("galleryPageSettings", JSON.stringify(data), "EX", 3600);

				return data;
			}
		} catch (error) {
			console.error(error);
		}
	}

	static async getGalleryImages() {
		try {
			const cachedData = await redis.get("galleryImages");

			if (cachedData) {
				return JSON.parse(cachedData);
			} else {
				console.log("request:getGalleryImages");

				const enRequest = await axiosInstance.get(
					`/gallery?_fields=id,status,slug,title,acf,lang,translations&acf_format=standard&per_page=100&lang=${"en"}`,
				);
				const trRequest = await axiosInstance.get(
					`/gallery?_fields=id,status,slug,title,acf,lang,translations&acf_format=standard&per_page=100&lang=${"tr"}`,
				);
				const data = {
					en: enRequest.data,
					tr: trRequest.data,
				};

				await redis.set("galleryImages", JSON.stringify(data), "EX", 3600);

				return data;
			}
		} catch (error) {
			console.error(error);
		}
	}

	static async getContactPageSettings() {
		try {
			const cachedData = await redis.get("contactPageSettings");

			if (cachedData) {
				return JSON.parse(cachedData);
			} else {
				console.log("request:getContactPageSettings");

				const enRequest = await axiosInstance.get(
					`/pages/${975}?_fields=acf&acf_format=standard`,
				);
				const trRequest = await axiosInstance.get(
					`/pages/${973}?_fields=acf&acf_format=standard`,
				);
				const data = {
					en: enRequest.data.acf,
					tr: trRequest.data.acf,
				};

				await redis.set("contactPageSettings", JSON.stringify(data), "EX", 3600);

				return data;
			}
		} catch (error) {
			console.error(error);
		}
	}

	static async getContactInformations() {
		try {
			const cachedData = await redis.get("contactInformations");

			if (cachedData) {
				return JSON.parse(cachedData);
			} else {
				console.log("request:getContactInformations");

				const enRequest = await axiosInstance.get(
					`/contact?_fields=id,status,slug,title,acf,lang,translations&acf_format=standard&per_page=100&lang=${"en"}`,
				);
				const trRequest = await axiosInstance.get(
					`/contact?_fields=id,status,slug,title,acf,lang,translations&acf_format=standard&per_page=100&lang=${"tr"}`,
				);
				const data = {
					en: enRequest.data,
					tr: trRequest.data,
				};

				await redis.set("contactInformations", JSON.stringify(data), "EX", 3600);

				return data;
			}
		} catch (error) {
			console.error(error);
		}
	}
}

export default AppService;
