
const express = require("express");
const router = express.Router();
const controller = require("../controllers/imagenes_producto.controller");
const upload = require("../middlewares/upload.middleware"); // reutiliza multer

//// GET (público)
router.get('/:id_producto', controller.allImages);

//// POST (público)
router.post('/', upload.array('imagenes', 5), controller.storeImages);

//// DELETE (público)
router.delete('/:id', controller.destroyImage);

module.exports = router;
