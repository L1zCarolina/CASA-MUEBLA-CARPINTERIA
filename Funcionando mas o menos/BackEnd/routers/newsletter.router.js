
const express = require("express");
const router = express.Router();
const controller = require("../controllers/newsletter.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//// GET (protegido, admin)
router.get('/', authMiddleware, controller.allSubs);

//// POST (público)
router.post('/', controller.subscribe);

//// DELETE (protegido)
router.delete('/:id', authMiddleware, controller.unsubscribe);

module.exports = router;
