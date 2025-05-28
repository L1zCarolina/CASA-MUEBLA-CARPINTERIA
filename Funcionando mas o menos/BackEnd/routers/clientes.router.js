/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();
const controller = require("../controllers/clientes.controller");

//// METODO GET  ///// (público)
router.get('/', controller.allClients);
router.get('/:id', controller.showClient);

//// METODO POST  //// (público)
router.post('/', controller.storeClient);

//// METODO PUT  //// (público)
router.put('/:id', controller.updateClient);

//// METODO DELETE //// (público)
router.delete('/:id', controller.destroyClient);

// EXPORTAR ROUTERS
module.exports = router;
