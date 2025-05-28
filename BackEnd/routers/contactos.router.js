
const express = require("express");
const router = express.Router();
const controller = require("../controllers/contactos.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//// GET (protegido, admin)
router.get('/', authMiddleware, controller.allContacts);

//// POST (público)
router.post('/', controller.storeContact);

//// PUT/DELETE (protegido, admin)
router.put('/:id', authMiddleware, controller.updateContact);
router.delete('/:id', authMiddleware, controller.destroyContact);

module.exports = router;
