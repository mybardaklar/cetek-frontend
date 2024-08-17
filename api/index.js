require("dotenv").config();

const path = require("path");
const createError = require("http-errors");
const app = require("express")();
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");

const AppService = require("../app/app.service");
const AppRoute = require("../app/app.route");

i18next
	.use(Backend)
	.use(i18nextMiddleware.LanguageDetector)
	.init({
		// debug: true,
		initImmediate: false,
		detection: {
			order: ["querystring", "cookie"],
			caches: ["cookie"],
		},
		fallbackLng: "tr",
		lng: "tr",
		preload: ["tr", "en"],
		backend: {
			loadPath: function (lngs, namespaces) {
				return path.join(process.cwd(), `locales/${lngs}/${namespaces}.json`);
			},
		},
	});

// view engine setup
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "pug");

app.use(logger(process.env.NODE_ENV));
app.use(cookieParser());
app.use(i18nextMiddleware.handle(i18next));

app.use(async (req, res, next) => {
	const appService = new AppService();

	try {
		// set site settings to Vercel KV and res.locals
		const siteSettings = await appService.getSiteSettings();
		app.locals.siteSettings = siteSettings[res.locals.language];

		// set some product categories to Vercel KV and res.locals
		const someProductCategories = await appService.getProductCategories();
		app.locals.someProductCategories = someProductCategories[res.locals.language].slice(0, 4);

		app.locals.PageProps = {
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
