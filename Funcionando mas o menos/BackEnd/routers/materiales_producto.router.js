// routers/materiales_producto.router.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/materiales_producto.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//// METODO GET  ///// (público)
router.get('/', controller.allProductMaterials);
router.get('/:id', controller.showProductMaterial);

//// METODO POST  //// (protegido)
router.post('/', authMiddleware, controller.storeProductMaterial);

//// METODO PUT  //// (protegido)
router.put('/:id', authMiddleware, controller.updateProductMaterial);

//// METODO DELETE //// (protegido)
router.delete('/:id', authMiddleware, controller.destroyProductMaterial);

module.exports = router;
