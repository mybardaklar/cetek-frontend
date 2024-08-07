const express = require("express");
const router = express.Router();
const fs = require("fs");
const Redis = require("ioredis");

const AppController = require("./app.controller");

const redis = new Redis();

router.get("/", AppController.home);

router.get("/contact", AppController.contact);
router.get("/iletisim", AppController.contact);

router.get("/gallery", AppController.gallery);
router.get("/galeri", AppController.gallery);

router.get("/cache", async (req, res) => {
	const cachedData = await redis.get("cachedData");

	if (cachedData) {
		// If data exists in the cache, return it
		res.send(JSON.parse(cachedData));
	} else {
		// If data is not in the cache, fetch it from the source
		const dataToCache = { message: "Data to be cached" };
		await redis.set("cachedData", JSON.stringify(dataToCache), "EX", 3600); // Cache for 1 hour
		res.send(dataToCache);
	}
});

// router.get("/:link", AppController.findAllProducts);

module.exports = router;
