/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();
const controller = require("../controllers/pedidos.controller");

//// METODO GET  ///// (público)
router.get('/', controller.allOrders);
router.get('/:id', controller.showOrder);

//// METODO POST  //// (público)
router.post('/', controller.storeOrder);

//// METODO PUT  //// (público)
router.put('/:id', controller.updateOrder);

//// METODO DELETE //// (público)
router.delete('/:id', controller.destroyOrder);

// EXPORTAR ROUTERS
module.exports = router;