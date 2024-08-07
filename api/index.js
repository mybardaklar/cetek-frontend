require("dotenv").config();

const createError = require("http-errors");
const app = require("express")();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");
const Redis = require("ioredis");

const AppService = require("../app/app.service");
const AppRoute = require("../app/app.route");

const redis = new Redis();

i18next
	.use(Backend)
	.use(i18nextMiddleware.LanguageDetector)
	.init({
		backend: {
			loadPath: function (lngs, namespaces) {
				return path.join(process.cwd(), `/locales/${lngs}/${namespaces}.json`);
			},
		},
		detection: {
			order: ["querystring", "cookie"],
			caches: ["cookie"],
		},
		fallbackLng: "tr",
		preload: ["tr", "en"],
	});

// view engine setup
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "pug");

app.use(logger(process.env.NODE_ENV));
app.use(cookieParser());
app.use(i18nextMiddleware.handle(i18next));

/* (async () => {
	const appService = new AppService("tr");

	// await redis.del("siteSettings");
	// await redis.del("someProductCategories");

	// set site settings to redis and res.locals
	const cachedSiteSettings = await redis.get("siteSettings");
	if (cachedSiteSettings) {
		console.log("siteSettings var");
		app.locals.siteSettings = await JSON.parse(cachedSiteSettings);
	} else {
		console.log("siteSettings yok, cachleniyor");

		const enSiteSettings = await appService.getSiteSettings("en");
		const trSiteSettings = await appService.getSiteSettings("tr");

		const siteSettings = {
			en: enSiteSettings,
			tr: trSiteSettings,
		};

		await redis.set("siteSettings", JSON.stringify(siteSettings), "EX", 3600);
		app.locals.siteSettings = await siteSettings;
	}

	// set some product categories to redis and res.locals
	const cachedSomeProductCategories = await redis.get("someProductCategories");

	if (cachedSomeProductCategories) {
		console.log("someProductCategories var");
		app.locals.someProductCategories = await JSON.parse(cachedSomeProductCategories);
	} else {
		console.log("someProductCategories yok, cachleniyor");

		const enSomeProductCategories = await appService.getSomeProductCategories("en");
		const trSomeProductCategories = await appService.getSomeProductCategories("tr");

		const someProductCategories = {
			en: enSomeProductCategories,
			tr: trSomeProductCategories,
		};

		await redis.set("someProductCategories", JSON.stringify(someProductCategories), "EX", 3600);
		app.locals.someProductCategories = await someProductCategories;
	}
})(); */

app.use(async (req, res, next) => {
	const appService = new AppService("tr");

	try {
		// set site settings to redis and res.locals
		const cachedSiteSettings = await redis.get("siteSettings");
		if (cachedSiteSettings) {
			app.locals.siteSettings = await JSON.parse(cachedSiteSettings)[res.locals.language];
		} else {
			const enSiteSettings = await appService.getSiteSettings("en");
			const trSiteSettings = await appService.getSiteSettings("tr");

			const siteSettings = {
				en: enSiteSettings,
				tr: trSiteSettings,
			};

			await redis.set("siteSettings", JSON.stringify(siteSettings), "EX", 3600);
			app.locals.siteSettings = await siteSettings[res.locals.language];
		}

		// set some product categories to redis and res.locals
		const cachedSomeProductCategories = await redis.get("someProductCategories");

		if (cachedSomeProductCategories) {
			app.locals.someProductCategories = await JSON.parse(cachedSomeProductCategories)[
				res.locals.language
			];
		} else {
			const enSomeProductCategories = await appService.getSomeProductCategories("en");
			const trSomeProductCategories = await appService.getSomeProductCategories("tr");

			const someProductCategories = {
				en: enSomeProductCategories,
				tr: trSomeProductCategories,
			};

			await redis.set(
				"someProductCategories",
				JSON.stringify(someProductCategories),
				"EX",
				3600,
			);
			app.locals.someProductCategories = await someProductCategories[res.locals.language];
		}

		app.locals.PageProps = await {
			titlePrefix: app.locals.siteSettings.meta_title,
			title: "",
			metaDescription: "",
			metaKeywords: "",
		};
	} catch (error) {
		console.log(error);
	}

	return next();
});

/* app.get("/", async (req, res) => {
	try {
		const request = await axiosInstance.get(
			`/product_category?_fields=id,slug,name,description,count,lang,translations,acf&acf_format=standard&per_page=4&lang=${res.locals.language}`,
		);

		console.log(res.locals.language);

		const paths = `/item/${v4()}`;
		res.setHeader("Content-Type", "text/html");
		res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
		res.render("pages/Index/Index.page.pug", { path: paths, categories: request.data });
	} catch (error) {
		console.error(error);
	}
});

app.get("/item/:slug", (req, res) => {
	const { slug } = req.params;
	res.end(`<p>Item: ${slug}</p><a href="/">Go back</a>`);
}); */

app.use("/", AppRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
