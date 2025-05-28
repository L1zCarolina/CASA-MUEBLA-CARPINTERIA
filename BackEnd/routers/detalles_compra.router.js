
const express = require("express");
const router = express.Router();
const controller = require("../controllers/detalles_compra.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//// GET (público)
router.get('/', controller.allDetails);
router.get('/:id', controller.showDetail);

//// POST/PUT/DELETE (protegido)
router.post('/', authMiddleware, controller.storeDetail);
router.put('/:id', authMiddleware, controller.updateDetail);
router.delete('/:id', authMiddleware, controller.destroyDetail);

module.exports = router;
