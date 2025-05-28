/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();
const controller = require("../controllers/detalles_pedidos.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//// METODO GET  ///// (protegido)
router.get('/', controller.allOrderDetails);
router.get('/:id', controller.showOrderDetail);

//// METODO POST  //// (protegido)
router.post('/', authMiddleware, controller.storeOrderDetail);

//// METODO PUT  //// (protegido)
router.put('/:id', authMiddleware, controller.updateOrderDetail);

//// METODO DELETE //// (protegido)
router.delete('/:id', authMiddleware, controller.destroyOrderDetail);

// EXPORTAR ROUTERS
module.exports = router;
