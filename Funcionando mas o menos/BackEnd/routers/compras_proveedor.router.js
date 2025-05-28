
const express = require("express");
const router = express.Router();
const controller = require("../controllers/compras_proveedor.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//// GET (público)
router.get('/', controller.allPurchases);
router.get('/:id', controller.showPurchase);

//// POST/PUT/DELETE (protegido)
router.post('/', authMiddleware, controller.storePurchase);
router.put('/:id', authMiddleware, controller.updatePurchase);
router.delete('/:id', authMiddleware, controller.destroyPurchase);

module.exports = router;
