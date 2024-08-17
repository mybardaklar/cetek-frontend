const app = require("express")();

const AppService = require("./app.service");

class AppController {
	static async cron(req, res, next) {
		const appService = new AppService();

		try {
			await appService.deleteAllBlobs();

			return res.redirect("/");
		} catch (error) {
			console.error(error);
		}
	}

	static async home(req, res, next) {
		const appService = new AppService();

		try {
			const pageSettings = await appService.getHomePageSettings();
			const sectoralNozzles = await appService.getSectoralNozzles();
			const homeProductCategories = await appService.getProductCategories();

			return res.render("pages/Index/Index.page.pug", {
				pageSettings: pageSettings[res.locals.language],
				sectoralNozzles: sectoralNozzles[res.locals.language],
				homeProductCategories: homeProductCategories[res.locals.language].slice(0, 12),
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
			const pageSettings = await appService.getGalleryPageSettings();
			const galleryImages = await appService.getGalleryImages();

			return res.render("pages/Gallery/Gallery.page.pug", {
				pageSettings: pageSettings[res.locals.language],
				galleryImages: galleryImages[res.locals.language],
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
			const pageSettings = await appService.getContactPageSettings();
			const contactInformations = await appService.getContactInformations();

			req.i18n.t("pageContact.sectionForm.description", {
				hrefFacebook: req.app.locals.siteSettings.website_settings.social_media["facebook"],
				hrefTwitter: req.app.locals.siteSettings.website_settings.social_media["twitter"],
				hrefInstagram:
					req.app.locals.siteSettings.website_settings.social_media["instagram"],
			});

			return res.render("pages/Contact/Contact.page.pug", {
				pageSettings: pageSettings[res.locals.language],
				contactInformations: contactInformations[res.locals.language],
			});
		} catch (error) {
			console.error(error);
		}
	}

	static async findAllProducts(req, res, next) {
		const appService = new AppService();

		// set products page settings to Vercel KV
		let pageSettings = await appService.getProductsPageSettings();

		// set product categories to Vercel KV
		let productCategories = await appService.getProductCategories();

		if (req.params.link === "urunler") {
			if (res.locals.language !== "tr") return res.redirect("/products");

			return res.render("pages/Products/Products.page.pug", {
				pageSettings: pageSettings[res.locals.language],
				productCategories: productCategories[res.locals.language],
			});
		} else if (req.params.link === "products") {
			if (res.locals.language !== "en") return res.redirect("/urunler");

			return res.render("pages/Products/Products.page.pug", {
				pageSettings: pageSettings[res.locals.language],
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
					pageSettings: pageSettings[res.locals.language],
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
					pageSettings: pageSettings[res.locals.language],
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
