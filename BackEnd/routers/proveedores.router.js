/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/proveedores.controller");

//// METODO GET  /////
router.get('/', controller.allSuppliers);
router.get('/:id', controller.showSupplier);

//// METODO POST  ////
router.post('/', controller.storeSupplier);

//// METODO PUT  ////
router.put('/:id', controller.updateSupplier);

//// METODO DELETE ////
router.delete('/:id', controller.destroySupplier);

// EXPORTAR ROUTERS
module.exports = router;