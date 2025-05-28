
const express = require("express");
const router = express.Router();
const controller = require("../controllers/pagos.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//// GET (público)
router.get('/', controller.allPayments);
router.get('/:id', controller.showPayment);

//// POST (público)
router.post('/', controller.storePayment);

//// PUT/DELETE (protegido)
router.put('/:id', authMiddleware, controller.updatePayment);
router.delete('/:id', authMiddleware, controller.destroyPayment);

module.exports = router;
