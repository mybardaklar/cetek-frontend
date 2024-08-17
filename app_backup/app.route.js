const express = require("express");
const router = express.Router();

const AppController = require("./app.controller");

router.get("/", AppController.home);

router.get("/refreshCache", AppController.cron);

router.get("/contact", AppController.contact);
router.get("/iletisim", AppController.contact);

router.get("/gallery", AppController.gallery);
router.get("/galeri", AppController.gallery);

router.get("/:link", AppController.findAllProducts);

module.exports = router;
