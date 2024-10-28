/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/clientes.controller");

//// METODO GET  /////
router.get('/', controller.allClients);
router.get('/:id', controller.showClient);

//// METODO POST  ////
router.post('/', controller.storeClient);

//// METODO PUT  ////
router.put('/:id', controller.updateClient);

//// METODO DELETE ////
router.delete('/:id', controller.destroyClient);

// EXPORTAR ROUTERS
module.exports = router;