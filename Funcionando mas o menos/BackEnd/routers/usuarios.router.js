const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");
const authMiddleware = require("../middlewares/auth.middleware"); // Middleware de autenticación
const upload = require("../middlewares/upload.middleware"); // Middleware de subida de imágenes


// Rutas para los usuarios

// Ruta para obtener todos los usuarios (Protegida)
router.get("/", authMiddleware, usuariosController.allUsers);

// Ruta para obtener un usuario específico por su ID (Protegida)
router.get("/:id_usuario", authMiddleware, usuariosController.showUser);

// Ruta para crear un nuevo usuario (Sube una foto de perfil opcional, No protegida)
router.post("/", upload.single("foto_perfil"), usuariosController.storeUser);

// Ruta para actualizar completamente un usuario (Protegida)
router.put("/:id_usuario", authMiddleware, upload.single("foto_perfil"), usuariosController.updateUser);

// Ruta para actualizar parcialmente un usuario (Protegida)
router.patch("/:id_usuario", authMiddleware, upload.single("foto_perfil"), usuariosController.updatePartialUser);

// Ruta para eliminar un usuario por su ID (Protegida)
router.delete("/:id_usuario", authMiddleware, usuariosController.destroyUser);

module.exports = router;