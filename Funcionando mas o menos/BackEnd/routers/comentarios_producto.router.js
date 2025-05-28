
const express = require("express");
const router = express.Router();
const controller = require("../controllers/comentarios_producto.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//// GET (público)
router.get('/', controller.allComments);
router.get('/:id', controller.showComment);

//// POST (público)
router.post('/', controller.storeComment);

//// PUT (protegido, admin)
router.put('/:id/aprobar', authMiddleware, controller.approveComment);

//// DELETE (protegido, admin)
router.delete('/:id', authMiddleware, controller.destroyComment);

module.exports = router;
