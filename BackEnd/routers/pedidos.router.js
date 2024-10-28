/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/pedidos.controller");

//// METODO GET  /////
router.get('/', controller.allOrders);
router.get('/:id', controller.showOrder);

//// METODO POST  ////
router.post('/', controller.storeOrder);

//// METODO PUT  ////
router.put('/:id', controller.updateOrder);

//// METODO DELETE ////
router.delete('/:id', controller.destroyOrder);

// EXPORTAR ROUTERS
module.exports = router;