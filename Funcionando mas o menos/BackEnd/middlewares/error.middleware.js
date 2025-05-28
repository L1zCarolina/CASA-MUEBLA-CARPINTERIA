// Middleware para manejo centralizado de errores
module.exports = (err, req, res, next) => {
  console.error(`Error en ruta ${req.method} ${req.url}:`, err)

  // Determinar el tipo de error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Error de validación",
      message: err.message,
      details: err.errors,
    })
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "Error de autenticación",
      message: "No autorizado para acceder a este recurso",
    })
  }

  if (err.name === "ForbiddenError") {
    return res.status(403).json({
      error: "Error de permisos",
      message: "No tiene permisos para realizar esta acción",
    })
  }

  // Error por defecto
  res.status(500).json({
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === "production" ? "Ocurrió un error inesperado" : err.message,
  })
}
