/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();
const controller = require("../controllers/materiales.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//// METODO GET  ///// (protegido)
router.get('/', controller.allMaterials);
router.get('/:id', controller.showMaterial);

//// METODO POST  //// (protegido)
router.post('/', authMiddleware, controller.storeMaterial);

//// METODO PUT  //// (protegido)
router.put('/:id', authMiddleware, controller.updateMaterial);

//// METODO DELETE //// (protegido)
router.delete('/:id', authMiddleware, controller.destroyMaterial);

// EXPORTAR ROUTERS
module.exports = router;