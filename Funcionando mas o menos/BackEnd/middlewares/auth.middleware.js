const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  try {
    // Verificar si existe el header de autorización
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null

    if (!token) {
      // No hay token: continuar sin usuario
      req.user = null;
      return next();
    }

    // Verificar el token
    jwt.verify(token, process.env.SECRET_KEY || "tu_clave_secreta", (err, decoded) => {
      if (err) {
        console.log("Token inválido o expirado:", err.message);
        req.user = null;
        return next(); // Continuar como si fuera visitante
      }

      // Guardar el ID del usuario para uso en otras rutas
      req.userId = decoded.id_usuario
      req.user = {
        id_usuario: decoded.id_usuario,
        nombre_usuario: decoded.nombre_usuario,
        email_usuario: decoded.email_usuario,
        rol: decoded.rol,
      }

      next()
    })
  } catch (error) {
    console.error("Error en middleware de autenticación:", error)
    res.status(500).json({ auth: false, message: "Error al autenticar usuario" })
  }
}
