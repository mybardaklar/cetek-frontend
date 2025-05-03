import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import i18nextMiddleware from "i18next-http-middleware";
import logger from "morgan";
import path from "path";

import AppRouter from "./app/app.route";
import AppService from "./app/app.service";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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
			loadPath: function (lngs: any, namespaces: any) {
				return path.join(process.cwd(), `src/locales/${lngs}/${namespaces}.json`);
			},
		},
	});

// view engine setup
app.set("views", path.join(process.cwd(), "src/views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(i18nextMiddleware.handle(i18next));
app.use(express.static(path.join(process.cwd(), "public")));

app.use(async (req: Request, res: Response, next: NextFunction) => {
	try {
		const siteSettings = await AppService.getSiteSettings();
		app.locals.siteSettings = siteSettings[res.locals.language];

		const someProductCategories = await AppService.getProductCategories();
		app.locals.someProductCategories = someProductCategories[res.locals.language].slice(0, 4);

		app.locals.PageProps = {
			titlePrefix: app.locals.siteSettings.meta_title,
			title: "",
			metaDescription: "",
			metaKeywords: "",
		};

		return next();
	} catch (error) {
		console.error(error);
		return next(error);
	}
});

app.use("/", AppRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

app.listen(port, () => console.log(`[server]: Server is running at http://localhost:${port}`));

export default app;
