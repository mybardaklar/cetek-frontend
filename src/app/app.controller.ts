import { Request, Response, NextFunction } from "express";

import AppService from "./app.service";

class AppController {
	static async index(req: Request, res: Response, next: NextFunction) {
		try {
			const pageSettings = await AppService.getHomePageSettings();
			const sectoralNozzles = await AppService.getSectoralNozzles();
			const homeProductCategories = await AppService.getProductCategories();

			return res.render("pages/Index/Index.page.pug", {
				pageSettings: pageSettings[res.locals.language],
				sectoralNozzles: sectoralNozzles[res.locals.language],
				homeProductCategories: homeProductCategories[res.locals.language].slice(0, 12),
			});
		} catch (error) {
			console.error(error);
		}
	}

	static async gallery(req: Request, res: Response, next: NextFunction) {
		if (req.path === "/galeri" && res.locals.language === "en") {
			return res.redirect("/gallery");
		} else if (req.path === "/gallery" && res.locals.language === "tr") {
			return res.redirect("/galeri");
		}

		try {
			const pageSettings = await AppService.getGalleryPageSettings();
			const galleryImages = await AppService.getGalleryImages();

			return res.render("pages/Gallery/Gallery.page.pug", {
				pageSettings: pageSettings[res.locals.language],
				galleryImages: galleryImages[res.locals.language],
			});
		} catch (error) {
			console.error(error);
		}
	}

	static async contact(req: Request, res: Response, next: NextFunction) {
		if (req.path === "/iletisim" && res.locals.language === "en") {
			return res.redirect("/contact");
		} else if (req.path === "/contact" && res.locals.language === "tr") {
			return res.redirect("/iletisim");
		}

		try {
			const pageSettings = await AppService.getContactPageSettings();
			const contactInformations = await AppService.getContactInformations();

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

	static async findAllProducts(req: any, res: Response, next: NextFunction) {
		let pageSettings = await AppService.getProductsPageSettings();
		let productCategories = await AppService.getProductCategories();

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
					(item: any) => item.slug === slug,
				)[0];

				if (productCategoryTranslations) {
					const productCategory = productCategories.en.filter(
						(item: any) => item.id === productCategoryTranslations.translations.en,
					)[0];

					if (productCategory) {
						return res.redirect(`/${productCategory.slug}-products`);
					}

					return res.status(404).render("pages/Error/Error.page.pug");
				}

				return res.status(404).render("pages/Error/Error.page.pug");
			}

			let currentCategory = productCategories["tr"].filter(
				(item: any) => item.slug === slug,
			)[0];
			if (currentCategory) {
				const products = await AppService.getProductsByCategory(
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
					(item: any) => item.slug === slug,
				)[0];

				if (productCategoryTranslations) {
					const productCategory = productCategories.tr.filter(
						(item: any) => item.id === productCategoryTranslations.translations.tr,
					)[0];

					if (productCategory) {
						return res.redirect(`/${productCategory.slug}-urunler`);
					}

					return res.status(404).render("pages/Error/Error.page.pug");
				}

				return res.status(404).render("pages/Error/Error.page.pug");
			}

			let currentCategory = productCategories["en"].filter(
				(item: any) => item.slug === slug,
			)[0];
			if (currentCategory) {
				const products = await AppService.getProductsByCategory(
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
				const product = await AppService.getProductBySlug(
					res.locals.language === "en" ? "tr" : "en",
					req.params.link,
				);

				if (product) {
					const translatedProduct = await AppService.getProductByID(
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
				const product = await AppService.getProductBySlug(
					res.locals.language,
					req.params.link,
				);

				if (product) {
					const currentCategory = productCategories[res.locals.language].filter(
						(item: any) => item.id === product.product_category[0],
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

export default AppController;
