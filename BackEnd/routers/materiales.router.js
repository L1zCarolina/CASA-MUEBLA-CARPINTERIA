/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/materiales.controller");

//// METODO GET  /////
router.get('/', controller.allMaterials);
router.get('/:id', controller.showMaterial);

//// METODO POST  ////
router.post('/', controller.storeMaterial);

//// METODO PUT  ////
router.put('/:id', controller.updateMaterial);

//// METODO DELETE ////
router.delete('/:id', controller.destroyMaterial);

// EXPORTAR ROUTERS
module.exports = router;