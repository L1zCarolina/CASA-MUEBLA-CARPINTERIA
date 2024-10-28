const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");
const authMiddleware = require('../middlewares/auth.middleware');


router.post("/register", usuariosController.register);
router.post("/login", usuariosController.login);
router.get("/", authMiddleware, usuariosController.getAllUsers); // Esto es para obtener todos los usuarios, protegido por authMiddleware
router.get("/:id", authMiddleware, usuariosController.getUserById);
router.put("/:id", authMiddleware, usuariosController.updateUser);
router.delete("/:id", authMiddleware, usuariosController.deleteUser);

module.exports = router;