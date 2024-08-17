const app = require("express")();
const kv = require("@vercel/kv").kv;
const AppService = require("./app.service");

class AppController {
	static async cron(req, res, next) {
		const appService = new AppService();

		try {
			// set site settings to Vercel KV and res.locals
			const enSiteSettings = await appService.getSiteSettings("en");
			const trSiteSettings = await appService.getSiteSettings("tr");
			const siteSettings = {
				en: enSiteSettings,
				tr: trSiteSettings,
			};
			await kv.set("siteSettings", JSON.stringify(siteSettings));

			// set some product categories to Vercel KV and res.locals
			const enSomeProductCategories = await appService.getSomeProductCategories("en");
			const trSomeProductCategories = await appService.getSomeProductCategories("tr");
			const someProductCategories = {
				en: enSomeProductCategories,
				tr: trSomeProductCategories,
			};
			await kv.set("someProductCategories", JSON.stringify(someProductCategories));

			// set home page settings to Vercel KV
			const enHomePageSettings = await appService.getHomePageSettings("en");
			const trHomePageSettings = await appService.getHomePageSettings("tr");
			const homePageSettings = {
				en: enHomePageSettings,
				tr: trHomePageSettings,
			};
			await kv.set("homePageSettings", JSON.stringify(homePageSettings));

			// set sectoral nozzles to Vercel KV
			const enSectoralNozzles = await appService.getSectoralNozzles("en");
			const trSectoralNozzles = await appService.getSectoralNozzles("tr");
			const sectoralNozzles = {
				en: enSectoralNozzles,
				tr: trSectoralNozzles,
			};
			await kv.set("sectoralNozzles", JSON.stringify(sectoralNozzles));

			// set sectoral nozzles to Vercel KV
			const enHomeProductCategories = await appService.getProductCategories("en", 12);
			const trHomeProductCategories = await appService.getProductCategories("tr", 12);
			const homeProductCategories = {
				en: enHomeProductCategories,
				tr: trHomeProductCategories,
			};
			await kv.set("homeProductCategories", JSON.stringify(homeProductCategories));

			// set contact page settings to Vercel KV
			const enContactPageSettings = await appService.getContactPageSettings("en");
			const trContactPageSettings = await appService.getContactPageSettings("tr");
			const contactPSettings = {
				en: enContactPageSettings,
				tr: trContactPageSettings,
			};
			await kv.set("contactPageSettings", JSON.stringify(contactPSettings));

			// set contact informations to Vercel KV
			const enContactInformations = await appService.getContactInformations("en");
			const trContactInformations = await appService.getContactInformations("tr");
			const contactInformations = {
				en: enContactInformations,
				tr: trContactInformations,
			};
			await kv.set("contactInformations", JSON.stringify(contactInformations));

			// set gallery page settings to Vercel KV
			const enGalleryPageSettings = await appService.getGalleryPageSettings("en");
			const trGalleryPageSettings = await appService.getGalleryPageSettings("tr");
			const galleryPageSettings = {
				en: enGalleryPageSettings,
				tr: trGalleryPageSettings,
			};
			await kv.set("galleryPageSettings", JSON.stringify(galleryPageSettings));

			// set gallery images to Vercel KV
			const enGalleryImages = await appService.getGalleryImages("en");
			const trGalleryImages = await appService.getGalleryImages("tr");
			const galleryImages = {
				en: enGalleryImages,
				tr: trGalleryImages,
			};
			await kv.set("galleryImages", JSON.stringify(galleryImages));

			return res.redirect("/");
		} catch (error) {
			console.error(error);
		}
	}

	static async home(req, res, next) {
		const appService = new AppService();

		console.log(await appService.testHomePageSettings(res.locals.language));

		try {
			let pageSettings = null;
			const cachedPageSettings = await kv.get("homePageSettings");
			if (cachedPageSettings) {
				pageSettings = cachedPageSettings[res.locals.language];
			} else {
				const enPageSettings = await appService.getHomePageSettings("en");
				const trPageSettings = await appService.getHomePageSettings("tr");

				pageSettings = {
					en: enPageSettings,
					tr: trPageSettings,
				};

				await kv.set("homePageSettings", JSON.stringify(pageSettings));
				pageSettings = await pageSettings[res.locals.language];
			}

			let sectoralNozzles = null;
			const cachedSectoralNozzles = await kv.get("sectoralNozzles");
			if (cachedSectoralNozzles) {
				sectoralNozzles = cachedSectoralNozzles[res.locals.language];
			} else {
				const enSectoralNozzles = await appService.getSectoralNozzles("en");
				const trSectoralNozzles = await appService.getSectoralNozzles("tr");

				sectoralNozzles = {
					en: enSectoralNozzles,
					tr: trSectoralNozzles,
				};

				await kv.set("sectoralNozzles", JSON.stringify(sectoralNozzles));
				sectoralNozzles = await sectoralNozzles[res.locals.language];
			}

			let homeProductCategories = null;
			const cachedHomeProductCategories = await kv.get("homeProductCategories");
			if (cachedHomeProductCategories) {
				homeProductCategories = cachedHomeProductCategories[res.locals.language];
			} else {
				const enHomeProductCategories = await appService.getProductCategories("en", 12);
				const trHomeProductCategories = await appService.getProductCategories("tr", 12);

				homeProductCategories = {
					en: enHomeProductCategories,
					tr: trHomeProductCategories,
				};

				await kv.set("homeProductCategories", JSON.stringify(homeProductCategories));
				homeProductCategories = await homeProductCategories[res.locals.language];
			}

			return res.render("pages/Index/Index.page.pug", {
				pageSettings,
				homeProductCategories,
				sectoralNozzles,
			});
		} catch (error) {
			console.error(error);
		}
	}

	static async contact(req, res, next) {
		if (req.path === "/iletisim" && res.locals.language === "en") {
			return res.redirect("/contact");
		} else if (req.path === "/contact" && res.locals.language === "tr") {
			return res.redirect("/iletisim");
		}

		const appService = new AppService();

		try {
			let pageSettings = null;
			const cachedPageSettings = await kv.get("contactPageSettings");
			if (cachedPageSettings) {
				pageSettings = cachedPageSettings[res.locals.language];
			} else {
				const enPageSettings = await appService.getContactPageSettings("en");
				const trPageSettings = await appService.getContactPageSettings("tr");

				pageSettings = {
					en: enPageSettings,
					tr: trPageSettings,
				};

				await kv.set("contactPageSettings", JSON.stringify(pageSettings));
				pageSettings = await pageSettings[res.locals.language];
			}

			let contactInformations = null;
			const cachedContactInformations = await kv.get("contactInformations");
			if (cachedContactInformations) {
				contactInformations = cachedContactInformations[res.locals.language];
			} else {
				const enContactInformations = await appService.getContactInformations("en");
				const trContactInformations = await appService.getContactInformations("tr");

				contactInformations = {
					en: enContactInformations,
					tr: trContactInformations,
				};

				await kv.set("contactInformations", JSON.stringify(contactInformations));
				contactInformations = await contactInformations[res.locals.language];
			}

			req.i18n.t("pageContact.sectionForm.description", {
				hrefFacebook: req.app.locals.siteSettings.website_settings.social_media["facebook"],
				hrefTwitter: req.app.locals.siteSettings.website_settings.social_media["twitter"],
				hrefInstagram:
					req.app.locals.siteSettings.website_settings.social_media["instagram"],
			});

			return res.render("pages/Contact/Contact.page.pug", {
				pageSettings,
				contactInformations,
			});
		} catch (error) {
			console.error(error);
		}
	}

	static async gallery(req, res, next) {
		if (req.path === "/galeri" && res.locals.language === "en") {
			return res.redirect("/gallery");
		} else if (req.path === "/gallery" && res.locals.language === "tr") {
			return res.redirect("/galeri");
		}

		const appService = new AppService();

		try {
			let pageSettings = null;
			const cachedPageSettings = await kv.get("galleryPageSettings");
			if (cachedPageSettings) {
				pageSettings = cachedPageSettings[res.locals.language];
			} else {
				const enPageSettings = await appService.getGalleryPageSettings("en");
				const trPageSettings = await appService.getGalleryPageSettings("tr");

				pageSettings = {
					en: enPageSettings,
					tr: trPageSettings,
				};

				await kv.set("galleryPageSettings", JSON.stringify(pageSettings));
				pageSettings = await pageSettings[res.locals.language];
			}

			let galleryImages = null;
			const cachedGalleryImages = await kv.get("galleryImages");
			if (cachedGalleryImages) {
				galleryImages = cachedGalleryImages[res.locals.language];
			} else {
				const enGalleryImages = await appService.getGalleryImages("en");
				const trGalleryImages = await appService.getGalleryImages("tr");

				galleryImages = {
					en: enGalleryImages,
					tr: trGalleryImages,
				};

				await kv.set("galleryImages", JSON.stringify(galleryImages));
				galleryImages = await galleryImages[res.locals.language];
			}

			return res.render("pages/Gallery/Gallery.page.pug", {
				pageSettings,
				galleryImages,
			});
		} catch (error) {
			console.error(error);
		}
	}

	static async findAllProducts(req, res, next) {
		const appService = new AppService();

		// set products page settings to Vercel KV
		let pageSettings = null;
		const cachedPageSettings = await kv.get("productsPageSettings");
		if (cachedPageSettings) {
			pageSettings = cachedPageSettings[res.locals.language];
		} else {
			const enPageSettings = await appService.getProductsPageSettings("en");
			const trPageSettings = await appService.getProductsPageSettings("tr");

			pageSettings = {
				en: enPageSettings,
				tr: trPageSettings,
			};

			await kv.set("productsPageSettings", JSON.stringify(pageSettings));
			pageSettings = await pageSettings[res.locals.language];
		}

		// set product categories to Vercel KV
		let productCategories = null;
		const cachedProductCategories = await kv.get("productCategories");
		if (cachedProductCategories) {
			productCategories = cachedProductCategories;
		} else {
			const enProductCategories = await appService.getProductCategories("en");
			const trProductCategories = await appService.getProductCategories("tr");

			productCategories = {
				en: enProductCategories,
				tr: trProductCategories,
			};

			await kv.set("productCategories", JSON.stringify(productCategories));
		}

		if (req.params.link === "urunler") {
			if (res.locals.language !== "tr") return res.redirect("/products");

			return res.render("pages/Products/Products.page.pug", {
				pageSettings,
				productCategories: productCategories[res.locals.language],
			});
		} else if (req.params.link === "products") {
			if (res.locals.language !== "en") return res.redirect("/urunler");

			return res.render("pages/Products/Products.page.pug", {
				pageSettings,
				productCategories: productCategories[res.locals.language],
			});
		} else if (req.params.link.includes(req.t("-urunler"))) {
			const slug = req.params.link.replace("-urunler", "");

			if (res.locals.language !== "tr") {
				const productCategoryTranslations = productCategories.tr.filter(
					(item) => item.slug === slug,
				)[0];

				if (productCategoryTranslations) {
					const productCategory = productCategories.en.filter(
						(item) => item.id === productCategoryTranslations.translations.en,
					)[0];

					if (productCategory) {
						return res.redirect(`/${productCategory.slug}-products`);
					}

					return res.status(404).render("pages/Error/Error.page.pug");
				}

				return res.status(404).render("pages/Error/Error.page.pug");
			}

			let currentCategory = productCategories["tr"].filter((item) => item.slug === slug)[0];
			if (currentCategory) {
				const products = await appService.getProductsByCategory(
					res.locals.language,
					currentCategory.id,
				);

				return res.render("pages/ProductCategory/ProductCategory.page.pug", {
					pageSettings,
					currentCategory,
					products,
				});
			}

			return res.status(404).render("pages/Error/Error.page.pug");
		} else if (req.params.link.includes(req.t("-products"))) {
			const slug = req.params.link.replace("-products", "");

			if (res.locals.language !== "en") {
				const productCategoryTranslations = productCategories.en.filter(
					(item) => item.slug === slug,
				)[0];

				if (productCategoryTranslations) {
					const productCategory = productCategories.tr.filter(
						(item) => item.id === productCategoryTranslations.translations.tr,
					)[0];

					if (productCategory) {
						return res.redirect(`/${productCategory.slug}-urunler`);
					}

					return res.status(404).render("pages/Error/Error.page.pug");
				}

				return res.status(404).render("pages/Error/Error.page.pug");
			}

			let currentCategory = productCategories["en"].filter((item) => item.slug === slug)[0];
			if (currentCategory) {
				const products = await appService.getProductsByCategory(
					res.locals.language,
					currentCategory.id,
				);

				return res.render("pages/ProductCategory/ProductCategory.page.pug", {
					pageSettings,
					currentCategory,
					products,
				});
			}

			return res.status(404).render("pages/Error/Error.page.pug");
		} else {
			if (req.query.lng) {
				const product = await appService.getProductBySlug(
					res.locals.language === "en" ? "tr" : "en",
					req.params.link,
				);

				if (product) {
					const translatedProduct = await appService.getProductByID(
						req.query.lng,
						product.translations[req.query.lng],
					);

					if (translatedProduct) {
						return res.redirect(`/${translatedProduct.slug}`);
					}

					return res.status(404).render("pages/Error/Error.page.pug");
				}

				return res.status(404).render("pages/Error/Error.page.pug");
			} else {
				const product = await appService.getProductBySlug(
					res.locals.language,
					req.params.link,
				);

				if (product) {
					const currentCategory = productCategories[res.locals.language].filter(
						(item) => item.id === product.product_category[0],
					)[0];

					if (currentCategory) {
						return res.render("pages/ProductDetail/ProductDetail.page.pug", {
							product,
							category: currentCategory,
							productCategories: productCategories[res.locals.language].slice(0, 4),
						});
					}

					return res.status(404).render("pages/Error/Error.page.pug");
				}

				return res.status(404).render("pages/Error/Error.page.pug");
			}
		}

		return res.status(404).render("pages/Error/Error.page.pug");
	}
}

module.exports = AppController;
