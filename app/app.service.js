const axiosInstance = require("../lib/axios");
const { put, del, list } = require("@vercel/blob");

class AppService {
	async deleteAllBlobs() {
		let cursor;

		do {
			const listResult = await list({
				cursor,
				limit: 1000,
			});

			if (listResult.blobs.length > 0) {
				await del(listResult.blobs.map((blob) => blob.url));
			}

			cursor = listResult.cursor;
		} while (cursor);

		console.log("All blobs were deleted");
	}

	async getSiteSettings() {
		try {
			const { blobs } = await list();
			const cachedBlob = blobs.filter(
				(blobItem) => blobItem.pathname === "siteSettings.json",
			);

			if (cachedBlob && cachedBlob.length) {
				const request = await axiosInstance.get(cachedBlob[0].url);
				return request.data;
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

				await put("siteSettings.json", JSON.stringify(data), {
					access: "public",
					addRandomSuffix: false,
				});

				return data;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async getHomePageSettings() {
		try {
			const { blobs } = await list();
			const cachedBlob = blobs.filter(
				(blobItem) => blobItem.pathname === "homePageSettings.json",
			);

			if (cachedBlob && cachedBlob.length) {
				const request = await axiosInstance.get(cachedBlob[0].url);
				return request.data;
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

				await put("homePageSettings.json", JSON.stringify(data), {
					access: "public",
					addRandomSuffix: false,
				});

				return data;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async getSectoralNozzles() {
		try {
			const { blobs } = await list();
			const cachedBlob = blobs.filter(
				(blobItem) => blobItem.pathname === "sectoralNozzles.json",
			);

			if (cachedBlob && cachedBlob.length) {
				const request = await axiosInstance.get(cachedBlob[0].url);
				return request.data;
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

				await put("sectoralNozzles.json", JSON.stringify(data), {
					access: "public",
					addRandomSuffix: false,
				});

				return data;
			}
		} catch (error) {
			console.error(error);
		}
	}

	async getProductsPageSettings() {
		try {
			const { blobs } = await list();
			const cachedBlob = blobs.filter(
				(blobItem) => blobItem.pathname === "productsPageSettings.json",
			);

			if (cachedBlob && cachedBlob.length) {
				const request = await axiosInstance.get(cachedBlob[0].url);
				return request.data;
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

				await put("productsPageSettings.json", JSON.stringify(data), {
					access: "public",
					addRandomSuffix: false,
				});

				return data;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async getProductCategories() {
		try {
			const { blobs } = await list();
			const cachedBlob = blobs.filter(
				(blobItem) => blobItem.pathname === "productCategories.json",
			);

			if (cachedBlob && cachedBlob.length) {
				const request = await axiosInstance.get(cachedBlob[0].url);

				return request.data;
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

				await put("productCategories.json", JSON.stringify(data), {
					access: "public",
					addRandomSuffix: false,
				});

				return data;
			}
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

	async getGalleryPageSettings() {
		try {
			const { blobs } = await list();
			const cachedBlob = blobs.filter(
				(blobItem) => blobItem.pathname === "galleryPageSettings.json",
			);

			if (cachedBlob && cachedBlob.length) {
				const request = await axiosInstance.get(cachedBlob[0].url);
				return request.data;
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

				await put("galleryPageSettings.json", JSON.stringify(data), {
					access: "public",
					addRandomSuffix: false,
				});

				return data;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async getGalleryImages() {
		try {
			const { blobs } = await list();
			const cachedBlob = blobs.filter(
				(blobItem) => blobItem.pathname === "galleryImages.json",
			);

			if (cachedBlob && cachedBlob.length) {
				const request = await axiosInstance.get(cachedBlob[0].url);

				return request.data;
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

				await put("galleryImages.json", JSON.stringify(data), {
					access: "public",
					addRandomSuffix: false,
				});

				return data;
			}
		} catch (error) {
			console.error(error);
		}
	}

	async getContactPageSettings() {
		try {
			const { blobs } = await list();
			const cachedBlob = blobs.filter(
				(blobItem) => blobItem.pathname === "contactPageSettings.json",
			);

			if (cachedBlob && cachedBlob.length) {
				const request = await axiosInstance.get(cachedBlob[0].url);
				return request.data;
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

				await put("contactPageSettings.json", JSON.stringify(data), {
					access: "public",
					addRandomSuffix: false,
				});

				return data;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async getContactInformations() {
		try {
			const { blobs } = await list();
			const cachedBlob = blobs.filter(
				(blobItem) => blobItem.pathname === "contactInformations.json",
			);

			if (cachedBlob && cachedBlob.length) {
				const request = await axiosInstance.get(cachedBlob[0].url);

				return request.data;
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

				await put("contactInformations.json", JSON.stringify(data), {
					access: "public",
					addRandomSuffix: false,
				});

				return data;
			}
		} catch (error) {
			console.error(error);
		}
	}
}

module.exports = AppService;
