/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();
const controller = require("../controllers/proveedores.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//// METODO GET  ///// (público)
router.get('/', controller.allSuppliers);
router.get('/:id', controller.showSupplier);

//// METODO POST  //// (protegido)
router.post('/', authMiddleware, controller.storeSupplier);

//// METODO PUT  //// (protegido)
router.put('/:id', authMiddleware, controller.updateSupplier);

//// METODO DELETE //// (protegido)
router.delete('/:id', authMiddleware, controller.destroySupplier);

// EXPORTAR ROUTERS
module.exports = router;