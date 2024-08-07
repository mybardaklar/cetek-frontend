const app = require("express")();
const Redis = require("ioredis");
const AppService = require("./app.service");

const redis = new Redis();

class AppController {
	static async home(req, res, next) {
		const appService = new AppService(res.locals.language);

		try {
			let pageSettings = null;
			const cachedPageSettings = await redis.get("homePageSettings");
			if (cachedPageSettings) {
				pageSettings = JSON.parse(cachedPageSettings)[res.locals.language];
			} else {
				const enPageSettings = await appService.getHomePageSettings("en");
				const trPageSettings = await appService.getHomePageSettings("tr");

				pageSettings = {
					en: enPageSettings,
					tr: trPageSettings,
				};

				await redis.set("homePageSettings", JSON.stringify(pageSettings), "EX", 3600);
				pageSettings = await pageSettings[res.locals.language];
			}

			let sectoralNozzles = null;
			const cachedSectoralNozzles = await redis.get("sectoralNozzles");
			if (cachedSectoralNozzles) {
				sectoralNozzles = JSON.parse(cachedSectoralNozzles)[res.locals.language];
			} else {
				const enSectoralNozzles = await appService.getSectoralNozzles("en");
				const trSectoralNozzles = await appService.getSectoralNozzles("tr");

				sectoralNozzles = {
					en: enSectoralNozzles,
					tr: trSectoralNozzles,
				};

				await redis.set("sectoralNozzles", JSON.stringify(sectoralNozzles), "EX", 3600);
				sectoralNozzles = await sectoralNozzles[res.locals.language];
			}

			return res.render("pages/Index/Index.page.pug", {
				pageSettings,
				sectoralNozzles,
			});
			// return res.render("index.pug", { pageSettings });
		} catch (error) {
			console.log(error);
		}
	}

	static async contact(req, res, next) {
		if (req.path === "/iletisim" && res.locals.language === "en") {
			return res.redirect("/contact");
		} else if (req.path === "/contact" && res.locals.language === "tr") {
			return res.redirect("/iletisim");
		}

		const appService = new AppService(res.locals.language);

		try {
			let pageSettings = null;
			const cachedPageSettings = await redis.get("contactPageSettings");
			if (cachedPageSettings) {
				pageSettings = JSON.parse(cachedPageSettings)[res.locals.language];
			} else {
				const enPageSettings = await appService.getContactPageSettings("en");
				const trPageSettings = await appService.getContactPageSettings("tr");

				pageSettings = {
					en: enPageSettings,
					tr: trPageSettings,
				};

				await redis.set("contactPageSettings", JSON.stringify(pageSettings), "EX", 3600);
				pageSettings = await pageSettings[res.locals.language];
			}

			req.i18n.t("pageContact.sectionForm.description", {
				hrefFacebook: req.app.locals.siteSettings.website_settings.social_media["facebook"],
				hrefTwitter: req.app.locals.siteSettings.website_settings.social_media["twitter"],
				hrefInstagram:
					req.app.locals.siteSettings.website_settings.social_media["instagram"],
			});

			return res.render("pages/Contact/Contact.page.pug", {
				pageSettings,
			});
		} catch (error) {
			console.log(error);
		}
	}

	static async gallery(req, res, next) {
		if (req.path === "/galeri" && res.locals.language === "en") {
			return res.redirect("/gallery");
		} else if (req.path === "/gallery" && res.locals.language === "tr") {
			return res.redirect("/galeri");
		}

		const appService = new AppService(res.locals.language);

		try {
			let pageSettings = null;
			const cachedPageSettings = await redis.get("galleryPageSettings");
			if (cachedPageSettings) {
				pageSettings = JSON.parse(cachedPageSettings)[res.locals.language];
			} else {
				const enPageSettings = await appService.getGalleryPageSettings("en");
				const trPageSettings = await appService.getGalleryPageSettings("tr");

				pageSettings = {
					en: enPageSettings,
					tr: trPageSettings,
				};

				await redis.set("galleryPageSettings", JSON.stringify(pageSettings), "EX", 3600);
				pageSettings = await pageSettings[res.locals.language];
			}

			let galleryImages = null;
			const cachedGalleryImages = await redis.get("galleryImages");
			if (cachedGalleryImages) {
				galleryImages = JSON.parse(cachedGalleryImages)[res.locals.language];
			} else {
				const enGalleryImages = await appService.getGalleryImages("en");
				const trGalleryImages = await appService.getGalleryImages("tr");

				galleryImages = {
					en: enGalleryImages,
					tr: trGalleryImages,
				};

				await redis.set("galleryImages", JSON.stringify(galleryImages), "EX", 3600);
				galleryImages = await galleryImages[res.locals.language];
			}

			return res.render("pages/Gallery/Gallery.page.pug", {
				pageSettings,
				galleryImages,
			});
		} catch (error) {
			console.log(error);
		}
	}

	/* static async findAllProducts(req, res, next) {
		const appService = new AppService(res.locals.language);

		if (req.params.link === "urunler") {
			if (res.locals.language !== "tr") return res.redirect("/products");

			return res.render("pages/ProductCategory/ProductCategory.page.pug", {
				productCategories: await appService.findAllProductCategories(),
			});
		} else if (req.params.link === "products") {
			if (res.locals.language !== "en") return res.redirect("/urunler");

			return res.render("pages/ProductCategory/ProductCategory.page.pug", {
				productCategories: await appService.findAllProductCategories(),
			});
		} else if (req.params.link.includes("urunler")) {
		}
	} */
}

module.exports = AppController;
