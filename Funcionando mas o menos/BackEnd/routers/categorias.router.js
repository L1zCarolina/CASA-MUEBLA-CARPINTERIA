/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();
const controller = require("../controllers/categorias.controller");

//// METODO GET  ///// (acceso público)
router.get('/', controller.allCategories);
router.get('/:id', controller.showCategory);

//// METODO POST  //// (público)
router.post('/', controller.storeCategory);

//// METODO PUT  //// (público)
router.put('/:id', controller.updateCategory);

//// METODO DELETE //// (público)
router.delete('/:id', controller.destroyCategory);

// EXPORTAR ROUTERS
module.exports = router;
