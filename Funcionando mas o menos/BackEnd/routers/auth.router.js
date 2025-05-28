/// RUTAS DEL MODULO ///
const express = require("express")
const router = express.Router()
const db = require("../db/db")
const bcrypt = require("bcryptjs")
const upload = require("../middlewares/upload.middleware")

//// AUTH ////
const controller = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

//// METODO POST  ////
router.post("/register", upload.single("foto_perfil"), controller.register)
router.post("/login", controller.login)
router.post("/verify-code", controller.verifyAuthorizationCode)

// Se añade un endpoint para cambiar la contraseña
router.post("/change-password", authMiddleware, controller.changePassword)

//// METODO GET  ////
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).send(`Hola Usuario ${req.userId}`)
})

router.get("/me", authMiddleware, controller.getMe)

router.get("/verify", authMiddleware, controller.verifyToken)

// EXPORTAR ROUTERS
module.exports = router
