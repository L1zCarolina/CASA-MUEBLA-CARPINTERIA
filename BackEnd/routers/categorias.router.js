/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/categorias.controller");

//// METODO GET  /////
router.get('/', controller.allCategories);
router.get('/:id', controller.showCategory);

//// METODO POST  ////
router.post('/', controller.storeCategory);

//// METODO PUT  ////
router.put('/:id', controller.updateCategory);

//// METODO DELETE ////
router.delete('/:id', controller.destroyCategory);

// EXPORTAR ROUTERS
module.exports = router;