/// RUTAS DEL MODULO ///
const express = require("express")
const router = express.Router()
const controller = require("../controllers/productos.controller")
const upload = require("../middlewares/upload.middleware")

//// METODO GET  /////
// Para todos los productos (acceso público)
router.get("/", controller.allProducts)

// Para un producto (acceso público)
router.get("/:id", controller.showProduct)

//// METODO POST  //// (público)
router.post("/", upload.single("imagen_producto"), controller.storeProduct)

//// METODO PUT  //// (público)
router.put("/:id", upload.single("imagen_producto"), controller.updateProduct)

//// METODO DELETE //// (público)
router.delete("/:id", controller.destroyProduct)

// EXPORTAR ROUTERS
module.exports = router
