const axiosInstance = require("../lib/axios");

class AppService {
	async getSiteSettings(lang) {
		try {
			console.log("service:getSiteSettings");

			const request = await axiosInstance.get(
				`/pages/${lang === "en" ? 407 : 276}?_fields=acf&acf_format=standard`,
			);

			return request.data.acf;
		} catch (error) {
			console.log(error);
		}
	}

	async getSomeProductCategories(lang) {
		try {
			console.log("service:getSomeProductCategories");

			const request = await axiosInstance.get(
				`/product_category?_fields=id,slug,name,description,count,lang,translations,acf&acf_format=standard&per_page=4&lang=${lang}`,
			);

			return request.data;
		} catch (error) {
			console.error(error);
		}
	}

	async getHomePageSettings(lang) {
		try {
			console.log("service:getHomePageSettings");

			const request = await axiosInstance.get(
				`/pages/${lang === "en" ? 429 : 194}?_fields=acf&acf_format=standard`,
			);

			return request.data.acf;
		} catch (error) {
			console.log(error);
		}
	}

	async getSectoralNozzles(lang) {
		try {
			console.log("service:getSectoralNozzles");

			const request = await axiosInstance.get(
				`/sectoral_nozzle?_fields=id,slug,title,acf,lang&acf_format=standard&lang=${lang}`,
			);

			return request.data;
		} catch (error) {
			console.error(error);
		}
	}

	async getProductsPageSettings(lang) {
		try {
			console.log("service:getProductsPageSettings");

			const request = await axiosInstance.get(
				`/pages/${lang === "en" ? 983 : 981}?_fields=acf&acf_format=standard`,
			);

			return request.data.acf;
		} catch (error) {
			console.log(error);
		}
	}

	async getProductCategories(lang, count) {
		try {
			const perPage = count ? `&per_page=${count}` : `&per_page=100`;
			const request = await axiosInstance.get(
				`/product_category?_fields=id,slug,name,description,count,lang,translations,acf&acf_format=standard${perPage}&lang=${lang}`,
			);

			return request.data;
		} catch (error) {
			console.error(error);
		}
	}

	async getProductsByCategory(lang, categoryId) {
		try {
			const request = await axiosInstance.get(
				`/product?_fields=id,status,slug,title,product_category,acf,lang,translations&acf_format=standard&per_page=100&lang=${lang}&product_category=${categoryId}`,
			);

			return request.data;
		} catch (error) {
			console.error(error);
		}
	}

	async getProductBySlug(lang, slug) {
		try {
			const request = await axiosInstance.get(
				`/product?_fields=id,status,slug,title,product_category,acf,lang,translations&acf_format=standard&lang=${lang}&slug=${slug}`,
			);

			return request.data[0];
		} catch (error) {
			console.error(error);
		}
	}

	async getProductByID(lang, id) {
		try {
			const request = await axiosInstance.get(
				`/product/${id}?_fields=id,status,slug,title,product_category,acf,lang,translations&acf_format=standard`,
			);

			return request.data;
		} catch (error) {
			console.error(error);
		}
	}

	async getGalleryPageSettings(lang) {
		try {
			console.log("service:getGalleryPageSettings");

			const request = await axiosInstance.get(
				`/pages/${lang === "en" ? 979 : 977}?_fields=acf&acf_format=standard`,
			);

			return request.data.acf;
		} catch (error) {
			console.log(error);
		}
	}

	async getGalleryImages(lang) {
		try {
			console.log("service:getGalleryImages");

			const request = await axiosInstance.get(
				`/gallery?_fields=id,status,slug,title,acf,lang,translations&acf_format=standard&per_page=100&lang=${lang}`,
			);

			return request.data;
		} catch (error) {
			console.error(error);
		}
	}

	async getContactPageSettings(lang) {
		try {
			console.log("service:getContactPageSettings");

			const request = await axiosInstance.get(
				`/pages/${lang === "en" ? 975 : 973}?_fields=acf&acf_format=standard`,
			);

			return request.data.acf;
		} catch (error) {
			console.log(error);
		}
	}

	async getContactInformations(lang) {
		try {
			console.log("service:getContactInformation");

			const request = await axiosInstance.get(
				`/contact?_fields=id,status,slug,title,acf,lang,translations&acf_format=standard&per_page=100&lang=${lang}`,
			);

			return request.data;
		} catch (error) {
			console.error(error);
		}
	}
}

module.exports = AppService;
