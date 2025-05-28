
const express = require("express");
const router = express.Router();
const controller = require("../controllers/configuracion.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//// GET (público)
router.get('/', controller.showConfig);

//// PUT (protegido, admin)
router.put('/', authMiddleware, controller.updateConfig);

module.exports = router;
