import { Router } from "express";

import AppController from "./app.controller";

const router = Router();

router.get("/", AppController.index);

// router.get("/refreshCache", AppController.cron);

router.get("/contact", AppController.contact);
router.get("/iletisim", AppController.contact);

router.get("/gallery", AppController.gallery);
router.get("/galeri", AppController.gallery);

router.get("/:link", AppController.findAllProducts);

export default router;
