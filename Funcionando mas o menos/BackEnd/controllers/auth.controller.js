const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const db = require("../db/db")
const fs = require("fs")
const path = require("path")

// Códigos de autorización para roles especiales (en producción, esto debería estar en una base de datos)
const AUTHORIZATION_CODES = {
  empleado: "EMP2024",
  admin: "ADM2024",
}

// Obtener información del usuario autenticado
exports.getMe = (req, res) => {
  try {
    // El usuario ya está disponible en req.user gracias al middleware de autenticación
    const sql = "SELECT id_usuario, nombre_usuario, email_usuario, rol, foto_perfil FROM usuarios WHERE id_usuario = ?"
    db.query(sql, [req.userId], (error, results) => {
      if (error) {
        console.error("Error al obtener datos del usuario:", error)
        return res.status(500).json({ message: "Error al obtener datos del usuario", error: error.message })
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado." })
      }

      res.json(results[0])
    })
  } catch (error) {
    console.error("Error inesperado en getMe:", error)
    res.status(500).json({ message: "Error interno del servidor", error: error.message })
  }
}

// Agregar función para verificar códigos de autorización
// Códigos de autorización predefinidos (en un sistema real, estarían en una base de datos)
const codigosAutorizacion = {
  admin: "ADMIN2024",
  empleado: "EMP2024",
}

// Función para verificar código de autorización
exports.verificarCodigo = (req, res) => {
  const { rol, codigo } = req.body

  if (!rol || !codigo) {
    return res.status(400).json({
      valid: false,
      message: "Rol y código son requeridos",
    })
  }

  // Verificar si el código es válido para el rol
  if (codigosAutorizacion[rol] === codigo) {
    return res.json({
      valid: true,
      message: "Código válido",
    })
  } else {
    return res.json({
      valid: false,
      message: "Código de autorización inválido",
    })
  }
}

// Verificar código de autorización
exports.verifyAuthorizationCode = (req, res) => {
  try {
    const { rol, codigo } = req.body

    if (!rol || !codigo) {
      return res.status(400).json({ message: "Rol y código son requeridos" })
    }

    // Verificar si el código coincide con el rol solicitado
    if (AUTHORIZATION_CODES[rol] === codigo) {
      return res.json({ valid: true, message: "Código válido" })
    } else {
      return res.status(401).json({ valid: false, message: "Código de autorización inválido" })
    }
  } catch (error) {
    console.error("Error al verificar código:", error)
    res.status(500).json({ message: "Error interno del servidor", error: error.message })
  }
}

// Registro de usuario
exports.register = (req, res) => {
  try {
    const { nombre_usuario, email_usuario, password, rol } = req.body
    const foto_perfil = req.file ? req.file.filename : null

    // Validación de datos
    if (!nombre_usuario || !email_usuario || !password) {
      // Si se subió una imagen pero hay error, eliminarla
      if (foto_perfil) {
        const filePath = path.join(__dirname, "..", "uploads", foto_perfil)
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error al eliminar archivo temporal:", err)
        })
      }
      return res.status(400).json({ message: "Todos los campos son obligatorios" })
    }

    if (password.length < 6) {
      // Si se subió una imagen pero hay error, eliminarla
      if (foto_perfil) {
        const filePath = path.join(__dirname, "..", "uploads", foto_perfil)
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error al eliminar archivo temporal:", err)
        })
      }
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" })
    }

    // Verificar si el usuario ya existe
    db.query("SELECT id_usuario FROM usuarios WHERE email_usuario = ?", [email_usuario], (checkError, checkResults) => {
      if (checkError) {
        console.error("Error al verificar usuario existente:", checkError)
        return res.status(500).json({ message: "Error al verificar usuario existente", error: checkError.message })
      }

      if (checkResults.length > 0) {
        // Si se subió una imagen pero hay error, eliminarla
        if (foto_perfil) {
          const filePath = path.join(__dirname, "..", "uploads", foto_perfil)
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error al eliminar archivo temporal:", err)
          })
        }
        return res.status(409).json({ message: "El correo electrónico ya está registrado" })
      }

      // Encriptar contraseña
      const hash = bcrypt.hashSync(password, 8)

      // Verificar si el rol requiere autorización
      const rolFinal = rol || "cliente"
      const requiereAutorizacion = rolFinal === "admin" || rolFinal === "empleado"

      // Si requiere autorización, verificar el código (esto debería hacerse antes, pero por simplicidad lo dejamos aquí)
      if (requiereAutorizacion) {
        const codigo = req.body.codigo_autorizacion
        if (!codigo || AUTHORIZATION_CODES[rolFinal] !== codigo) {
          // Si se subió una imagen pero hay error, eliminarla
          if (foto_perfil) {
            const filePath = path.join(__dirname, "..", "uploads", foto_perfil)
            fs.unlink(filePath, (err) => {
              if (err) console.error("Error al eliminar archivo temporal:", err)
            })
          }
          return res.status(401).json({ message: "Código de autorización inválido para el rol solicitado" })
        }
      }

      // Insertar nuevo usuario
      const sql = "INSERT INTO usuarios (nombre_usuario, email_usuario, password, rol, foto_perfil) VALUES (?,?,?,?,?)"
      db.query(sql, [nombre_usuario, email_usuario, hash, rolFinal, foto_perfil], (error, result) => {
        if (error) {
          console.error("Error en el registro:", error)
          return res.status(500).json({ message: "No se pudo registrar el usuario", error: error.message })
        }

        // Generar token JWT
        const token = jwt.sign(
          {
            id_usuario: result.insertId,
            nombre_usuario,
            email_usuario,
            rol: rolFinal,
            foto_perfil,
          },
          process.env.SECRET_KEY || "tu_clave_secreta",
          {
            expiresIn: "24h",
          },
        )

        console.log(`Usuario registrado exitosamente: ${email_usuario}`)

        res.status(201).json({
          auth: true,
          token,
          usuario: {
            id_usuario: result.insertId,
            nombre_usuario,
            email_usuario,
            rol: rolFinal,
            foto_perfil,
          },
        })
      })
    })
  } catch (error) {
    console.error("Error inesperado en register:", error)
    res.status(500).json({ message: "Error interno del servidor", error: error.message })
  }
}

// Inicio de sesión
exports.login = (req, res) => {
  try {
    const { email_usuario, password } = req.body

    // Validación de datos
    if (!email_usuario || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" })
    }

    console.log(`Intento de inicio de sesión: ${email_usuario}`)

    const sql = "SELECT * FROM usuarios WHERE email_usuario = ?"
    db.query(sql, [email_usuario], (error, results) => {
      if (error) {
        console.error("Error en la consulta de login:", error)
        return res.status(500).json({ message: "Error al intentar iniciar sesión", error: error.message })
      }

      if (results.length === 0) {
        console.log(`Usuario no encontrado: ${email_usuario}`)
        return res.status(404).json({ message: "Usuario no encontrado" })
      }

      const user = results[0]
      const passwordIsValid = bcrypt.compareSync(password, user.password)

      if (!passwordIsValid) {
        console.log(`Contraseña incorrecta para: ${email_usuario}`)
        return res.status(401).json({ auth: false, token: null, message: "Contraseña incorrecta" })
      }

      const token = jwt.sign(
        {
          id_usuario: user.id_usuario,
          nombre_usuario: user.nombre_usuario,
          email_usuario: user.email_usuario,
          rol: user.rol,
          foto_perfil: user.foto_perfil,
        },
        process.env.SECRET_KEY || "tu_clave_secreta",
        {
          expiresIn: "24h",
        },
      )

      console.log(`Inicio de sesión exitoso: ${email_usuario}`)

      res.json({
        auth: true,
        token,
        usuario: {
          id_usuario: user.id_usuario,
          nombre_usuario: user.nombre_usuario,
          email_usuario: user.email_usuario,
          rol: user.rol,
          foto_perfil: user.foto_perfil,
        },
      })
    })
  } catch (error) {
    console.error("Error inesperado en login:", error)
    res.status(500).json({ message: "Error interno del servidor", error: error.message })
  }
}

// Verificar token
exports.verifyToken = (req, res) => {
  try {
    res.status(200).json({ auth: true, message: "Token válido", user: req.user })
  } catch (error) {
    console.error("Error en verificación de token:", error)
    res.status(500).json({ message: "Error al verificar token", error: error.message })
  }
}

// Agregar función para cambiar contraseña
exports.cambiarPassword = (req, res) => {
  const { password_actual, password_nueva } = req.body
  const userId = req.userId // Obtenido del middleware de autenticación

  if (!password_actual || !password_nueva) {
    return res.status(400).json({
      message: "Contraseña actual y nueva son requeridas",
    })
  }

  // Buscar usuario en la base de datos
  const sql = "SELECT * FROM usuarios WHERE id_usuario = ?"
  db.query(sql, [userId], (error, results) => {
    if (error) {
      console.error("Error al buscar usuario:", error)
      return res.status(500).json({ message: "Error interno del servidor" })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    const usuario = results[0]

    // Verificar contraseña actual
    bcrypt.compare(password_actual, usuario.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Error al verificar contraseña" })
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Contraseña actual incorrecta" })
      }

      // Encriptar nueva contraseña
      bcrypt.hash(password_nueva, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: "Error al encriptar la nueva contraseña" })
        }

        // Actualizar contraseña en la base de datos
        const updateSql = "UPDATE usuarios SET password = ? WHERE id_usuario = ?"
        db.query(updateSql, [hashedPassword, userId], (error, result) => {
          if (error) {
            console.error("Error al actualizar contraseña:", error)
            return res.status(500).json({ message: "Error al actualizar contraseña" })
          }

          return res.json({ message: "Contraseña actualizada correctamente" })
        })
      })
    })
  })
}

// Cambiar contraseña
exports.changePassword = (req, res) => {
  try {
    const { password_actual, password_nueva } = req.body

    // Validación de datos
    if (!password_actual || !password_nueva) {
      return res.status(400).json({ message: "Ambas contraseñas son obligatorias" })
    }

    if (password_nueva.length < 6) {
      return res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres" })
    }

    // Obtener el usuario actual
    const sql = "SELECT * FROM usuarios WHERE id_usuario = ?"
    db.query(sql, [req.userId], (error, results) => {
      if (error) {
        console.error("Error al obtener usuario para cambio de contraseña:", error)
        return res.status(500).json({ message: "Error al cambiar contraseña", error: error.message })
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" })
      }

      const user = results[0]

      // Verificar la contraseña actual
      const passwordIsValid = bcrypt.compareSync(password_actual, user.password)
      if (!passwordIsValid) {
        return res.status(401).json({ message: "Contraseña actual incorrecta" })
      }

      // Encriptar la nueva contraseña
      const hash = bcrypt.hashSync(password_nueva, 8)

      // Actualizar la contraseña
      const updateSql = "UPDATE usuarios SET password = ? WHERE id_usuario = ?"
      db.query(updateSql, [hash, req.userId], (updateError, updateResult) => {
        if (updateError) {
          console.error("Error al actualizar contraseña:", updateError)
          return res.status(500).json({ message: "Error al actualizar la contraseña", error: updateError.message })
        }

        console.log(`Contraseña actualizada para usuario ID: ${req.userId}`)
        res.json({ message: "Contraseña actualizada correctamente" })
      })
    })
  } catch (error) {
    console.error("Error inesperado en changePassword:", error)
    res.status(500).json({ message: "Error interno del servidor", error: error.message })
  }
}
