/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/detalles_pedidos.controller");

//// METODO GET  /////
router.get('/', controller.allOrderDetails);
router.get('/:id', controller.showOrderDetail);

//// METODO POST  ////
router.post('/', controller.storeOrderDetail);

//// METODO PUT  ////
router.put('/:id', controller.updateOrderDetail);

//// METODO DELETE ////
router.delete('/:id', controller.destroyOrderDetail);

// EXPORTAR ROUTERS
module.exports = router;