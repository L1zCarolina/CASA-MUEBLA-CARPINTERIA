/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/producto_material.controller");

//// METODO GET  /////
router.get('/', controller.allProductMaterials);
router.get('/:id', controller.showProductMaterial);

//// METODO POST  ////
router.post('/', controller.storeProductMaterial);

//// METODO PUT  ////
router.put('/:id', controller.updateProductMaterial);

//// METODO DELETE ////
router.delete('/:id', controller.destroyProductMaterial);

//EXPORTAR ROUTERS
module.exports = router;