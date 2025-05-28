// Funcionalidad para la página de inicio de sesión/registro

// Función para verificar si el token ha expirado
function isTokenExpired(token) {
  if (!token) return true

  try {
    // Dividir el token en sus partes
    const parts = token.split(".")
    if (parts.length !== 3) {
      console.error("Formato de token inválido")
      return true
    }

    // Decodificar la parte del payload (segunda parte)
    const payload = JSON.parse(atob(parts[1]))
    console.log("Payload del token:", payload)

    // Verificar si tiene una fecha de expiración
    if (!payload.exp) {
      console.error("Token no tiene fecha de expiración")
      return true
    }

    // Comparar con la fecha actual
    const now = Math.floor(Date.now() / 1000)
    const isExpired = now >= payload.exp

    console.log("Tiempo actual:", now)
    console.log("Tiempo de expiración:", payload.exp)
    console.log("¿Token expirado?:", isExpired)

    return isExpired
  } catch (e) {
    console.error("Error al verificar el token:", e)
    return true // Si hay algún error, consideramos que el token ha expirado
  }
}

// Función para mostrar mensajes de error o éxito
function mostrarMensaje(elemento, mensaje, tipo) {
  // Eliminar mensajes previos
  const mensajesAnteriores = elemento.querySelectorAll(".error-message, .success-message")
  mensajesAnteriores.forEach((msg) => msg.remove())

  // Crear y agregar el nuevo mensaje
  const mensajeElement = document.createElement("span")
  mensajeElement.className = tipo === "error" ? "error-message" : "success-message"
  mensajeElement.textContent = mensaje
  elemento.appendChild(mensajeElement)
}

// Modificar la función redirectBasedOnRole para incluir el panel de empleados
function redirectBasedOnRole(rol) {
  console.log("Redirigiendo según rol:", rol)
  try {
    if (rol === "admin") {
      window.location.href = "admin-panel.html"
    } else if (rol === "cliente" || rol === "usuario") {
      window.location.href = "cliente-panel.html"
    } else if (rol === "empleado") {
      window.location.href = "empleado-panel.html" // Redirigir al nuevo panel de empleados
    } else {
      // Si el rol no es reconocido, redirigir a la página principal
      window.location.href = "index.html"
    }
  } catch (error) {
    console.error("Error al redirigir:", error)
    // En caso de error, redirigir a la página principal
    window.location.href = "index.html"
  }
}

// Modificar la función para verificar el código de autorización
async function verificarCodigoAutorizacion(rol, codigo) {
  try {
    const API_URL =
      window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:3001/api"
        : "/api"

    // Códigos de autorización predefinidos (en un sistema real, esto estaría en el backend)
    const codigosValidos = {
      admin: "ADMIN2024",
      empleado: "EMP2024",
    }

    // Verificación simple para demostración
    if (codigosValidos[rol] === codigo) {
      return { valid: true, message: "Código válido" }
    } else {
      return { valid: false, message: "Código de autorización inválido" }
    }
  } catch (error) {
    console.error("Error al verificar código:", error)
    return { valid: false, message: "Error al verificar el código" }
  }
}

// Modificar la función para guardar los datos de inicio de sesión
function guardarDatosInicioSesion(email, password, recordar) {
  if (recordar) {
    localStorage.setItem("savedEmail", email)
    localStorage.setItem("savedPassword", password) // Nota: En producción, nunca guardar contraseñas en texto plano
    localStorage.setItem("rememberMe", "true")
  } else {
    localStorage.removeItem("savedEmail")
    localStorage.removeItem("savedPassword")
    localStorage.removeItem("rememberMe")
  }
}

// Modificar la función para cargar datos guardados
function cargarDatosGuardados() {
  const savedEmail = localStorage.getItem("savedEmail")
  const savedPassword = localStorage.getItem("savedPassword")
  const rememberMe = localStorage.getItem("rememberMe") === "true"

  if (savedEmail && savedPassword && rememberMe) {
    const emailInput = document.getElementById("login-email")
    const passwordInput = document.getElementById("login-password")
    const rememberCheckbox = document.getElementById("recordar")

    if (emailInput) emailInput.value = savedEmail
    if (passwordInput) passwordInput.value = savedPassword
    if (rememberCheckbox) rememberCheckbox.checked = true
  }
}

// Llamar a la función para cargar datos guardados cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  cargarDatosGuardados()

  console.log("Inicializando página de mi-cuenta...")

  // Verificar si estamos en la página de login y limpiar sesión si es necesario
  if (window.location.pathname.includes("mi-cuenta.html")) {
    // Si hay un parámetro logout en la URL, cerrar sesión
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("logout")) {
      console.log("Cerrando sesión por parámetro logout")
      localStorage.removeItem("token")
      localStorage.removeItem("usuario")
      localStorage.removeItem("cliente_id")
      // Limpiar la URL para evitar problemas al recargar
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }

  // Referencias a elementos del DOM
  const formLogin = document.getElementById("form-login")
  const formRegistro = document.getElementById("form-registro")
  const btnMostrarRegistro = document.getElementById("mostrar-registro")
  const btnMostrarLogin = document.getElementById("mostrar-login")
  const seccionLogin = document.getElementById("seccion-login")
  const seccionRegistro = document.getElementById("seccion-registro")
  const selectRol = document.getElementById("registro-rol")
  const codigoContainer = document.getElementById("codigo-autorizacion-container")

  // Mostrar/ocultar campo de código de autorización según el rol seleccionado
  if (selectRol) {
    selectRol.addEventListener("change", function () {
      const rolSeleccionado = this.value
      if (rolSeleccionado === "admin" || rolSeleccionado === "empleado") {
        codigoContainer.style.display = "block"
      } else {
        codigoContainer.style.display = "none"
      }
    })
  }

  // URL base de la API
  const API_URL =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3001/api"
      : "/api"

  // Verificar si el usuario ya está autenticado
  const token = localStorage.getItem("token")
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")

  console.log("Token almacenado:", token)
  console.log("Usuario almacenado:", usuario)

  if (token && !isTokenExpired(token)) {
    console.log("Token válido, redirigiendo según rol:", usuario.rol)
    // Redirigir según el rol del usuario
    redirectBasedOnRole(usuario.rol)
    return // Importante: detener la ejecución aquí
  }

  // Función para validar email
  function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Función para validar contraseña (mínimo 6 caracteres)
  function validarPassword(password) {
    return password.length >= 6
  }

  // Configurar botones para mostrar/ocultar contraseña
  const togglePasswordButtons = document.querySelectorAll(".toggle-password")
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling
      const type = input.getAttribute("type") === "password" ? "text" : "password"
      input.setAttribute("type", type)

      // Cambiar el ícono
      const icon = this.querySelector("i")
      icon.classList.toggle("fa-eye")
      icon.classList.toggle("fa-eye-slash")
    })
  })

  // Navegación entre formularios
  if (btnMostrarRegistro) {
    btnMostrarRegistro.addEventListener("click", (e) => {
      e.preventDefault()
      seccionLogin.style.display = "none"
      seccionRegistro.style.display = "block"
    })
  }

  if (btnMostrarLogin) {
    btnMostrarLogin.addEventListener("click", (e) => {
      e.preventDefault()
      seccionRegistro.style.display = "none"
      seccionLogin.style.display = "block"
    })
  }

  // Modificar el event listener del formulario de login para guardar los datos cuando se marca "recordar"
  // Buscar la sección donde se maneja el envío del formulario de login

  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Obtener datos del formulario
      const email = document.getElementById("login-email").value.trim()
      const password = document.getElementById("login-password").value
      const recordar = document.getElementById("recordar").checked

      // Validar campos
      let isValid = true

      if (!validarEmail(email)) {
        mostrarMensaje(document.getElementById("login-email").parentNode, "Email inválido", "error")
        document.getElementById("login-email").classList.add("is-invalid")
        isValid = false
      } else {
        document.getElementById("login-email").classList.remove("is-invalid")
        document.getElementById("login-email").classList.add("is-valid")
      }

      if (!validarPassword(password)) {
        mostrarMensaje(
          document.getElementById("login-password").parentNode,
          "La contraseña debe tener al menos 6 caracteres",
          "error",
        )
        document.getElementById("login-password").classList.add("is-invalid")
        isValid = false
      } else {
        document.getElementById("login-password").classList.remove("is-invalid")
        document.getElementById("login-password").classList.add("is-valid")
      }

      if (!isValid) return

      try {
        // Mostrar indicador de carga
        const submitBtn = formLogin.querySelector('button[type="submit"]')
        const originalText = submitBtn.textContent

        submitBtn.disabled = true
        submitBtn.textContent = "Iniciando sesión..."

        // Enviar solicitud al servidor
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_usuario: email,
            password: password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Error al iniciar sesión")
        }

        console.log("Respuesta del servidor:", data)

        // Guardar datos si se marcó "recordar"
        if (recordar) {
          guardarDatosInicioSesion(email, password, true)
        } else {
          guardarDatosInicioSesion("", "", false)
        }

        // Guardar token y datos del usuario
        localStorage.setItem("token", data.token)
        localStorage.setItem("usuario", JSON.stringify(data.usuario))

        // Redirigir según el rol
        redirectBasedOnRole(data.usuario.rol)
      } catch (error) {
        console.error("Error de inicio de sesión:", error)
        mostrarMensaje(formLogin, error.message || "Error al iniciar sesión. Verifica tus credenciales.", "error")
      } finally {
        // Restaurar botón
        if (formLogin.querySelector('button[type="submit"]')) {
          const submitBtn = formLogin.querySelector('button[type="submit"]')
          submitBtn.disabled = false
          submitBtn.textContent = originalText || "Iniciar Sesión"
        }
      }
    })
  }

  // Manejar envío del formulario de registro
  if (formRegistro) {
    formRegistro.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Obtener datos del formulario
      const nombre = document.getElementById("registro-nombre").value.trim()
      const apellido = document.getElementById("registro-apellido").value.trim()
      const email = document.getElementById("registro-email").value.trim()
      const telefono = document.getElementById("registro-telefono").value.trim()
      const password = document.getElementById("registro-password").value
      const confirmPassword = document.getElementById("registro-confirm-password").value
      const terminos = document.getElementById("terminos").checked
      const rol = document.getElementById("registro-rol").value
      const codigoAutorizacion = document.getElementById("codigo-autorizacion")?.value || ""
      const fotoInput = document.getElementById("registro-foto")

      // Validar campos
      let isValid = true

      if (nombre.length < 2) {
        mostrarMensaje(document.getElementById("registro-nombre").parentNode, "Nombre demasiado corto", "error")
        document.getElementById("registro-nombre").classList.add("is-invalid")
        isValid = false
      } else {
        document.getElementById("registro-nombre").classList.remove("is-invalid")
        document.getElementById("registro-nombre").classList.add("is-valid")
      }

      if (apellido.length < 2) {
        mostrarMensaje(document.getElementById("registro-apellido").parentNode, "Apellido demasiado corto", "error")
        document.getElementById("registro-apellido").classList.add("is-invalid")
        isValid = false
      } else {
        document.getElementById("registro-apellido").classList.remove("is-invalid")
        document.getElementById("registro-apellido").classList.add("is-valid")
      }

      if (!validarEmail(email)) {
        mostrarMensaje(document.getElementById("registro-email").parentNode, "Email inválido", "error")
        document.getElementById("registro-email").classList.add("is-invalid")
        isValid = false
      } else {
        document.getElementById("registro-email").classList.remove("is-invalid")
        document.getElementById("registro-email").classList.add("is-valid")
      }

      if (telefono.length < 8) {
        mostrarMensaje(document.getElementById("registro-telefono").parentNode, "Teléfono inválido", "error")
        document.getElementById("registro-telefono").classList.add("is-invalid")
        isValid = false
      } else {
        document.getElementById("registro-telefono").classList.remove("is-invalid")
        document.getElementById("registro-telefono").classList.add("is-valid")
      }

      if (!validarPassword(password)) {
        mostrarMensaje(
          document.getElementById("registro-password").parentNode,
          "La contraseña debe tener al menos 6 caracteres",
          "error",
        )
        document.getElementById("registro-password").classList.add("is-invalid")
        isValid = false
      } else {
        document.getElementById("registro-password").classList.remove("is-invalid")
        document.getElementById("registro-password").classList.add("is-valid")
      }

      if (password !== confirmPassword) {
        mostrarMensaje(
          document.getElementById("registro-confirm-password").parentNode,
          "Las contraseñas no coinciden",
          "error",
        )
        document.getElementById("registro-confirm-password").classList.add("is-invalid")
        isValid = false
      } else {
        document.getElementById("registro-confirm-password").classList.remove("is-invalid")
        document.getElementById("registro-confirm-password").classList.add("is-valid")
      }

      // Validar código de autorización si es necesario
      if ((rol === "admin" || rol === "empleado") && !codigoAutorizacion) {
        mostrarMensaje(
          document.getElementById("codigo-autorizacion").parentNode,
          "El código de autorización es obligatorio para este rol",
          "error",
        )
        document.getElementById("codigo-autorizacion").classList.add("is-invalid")
        isValid = false
      }

      if (!terminos) {
        mostrarMensaje(
          document.getElementById("terminos").parentNode,
          "Debes aceptar los términos y condiciones",
          "error",
        )
        isValid = false
      }

      if (!isValid) return

      try {
        // Mostrar indicador de carga
        const submitBtn = formRegistro.querySelector('button[type="submit"]')
        const originalText = submitBtn.textContent

        submitBtn.disabled = true
        submitBtn.textContent = "Registrando..."

        // Verificar código de autorización si es necesario
        if (rol === "admin" || rol === "empleado") {
          const verificacion = await verificarCodigoAutorizacion(rol, codigoAutorizacion)
          if (!verificacion.valid) {
            mostrarMensaje(
              document.getElementById("codigo-autorizacion").parentNode,
              verificacion.message || "Código de autorización inválido",
              "error",
            )
            submitBtn.disabled = false
            submitBtn.textContent = originalText || "Registrarse"
            return
          }
        }

        // Crear FormData para enviar datos incluyendo la imagen
        const formData = new FormData()
        formData.append("nombre_usuario", `${nombre} ${apellido}`)
        formData.append("email_usuario", email)
        formData.append("password", password)
        formData.append("rol", rol)

        if (rol === "admin" || rol === "empleado") {
          formData.append("codigo_autorizacion", codigoAutorizacion)
        }

        // Añadir foto si se seleccionó
        if (fotoInput && fotoInput.files.length > 0) {
          formData.append("foto_perfil", fotoInput.files[0])
        }

        // Registrar usuario
        const usuarioResponse = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          body: formData,
        })

        const usuarioData = await usuarioResponse.json()

        if (!usuarioResponse.ok) {
          throw new Error(usuarioData.message || "Error al registrar usuario")
        }

        console.log("Usuario registrado:", usuarioData)

        // Luego registrar el cliente si el rol es cliente
        if (rol === "cliente") {
          const clienteResponse = await fetch(`${API_URL}/clientes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${usuarioData.token}`,
            },
            body: JSON.stringify({
              nombre: nombre,
              apellido: apellido,
              email: email,
              telefono: telefono,
              id_usuario: usuarioData.usuario.id_usuario,
            }),
          })

          const clienteData = await clienteResponse.json()

          if (!clienteResponse.ok) {
            throw new Error(clienteData.message || "Error al registrar cliente")
          }

          console.log("Cliente registrado:", clienteData)
        }

        // Guardar token y datos del usuario
        localStorage.setItem("token", usuarioData.token)
        localStorage.setItem("usuario", JSON.stringify(usuarioData.usuario))

        // Mostrar mensaje de éxito
        mostrarMensaje(formRegistro, "Registro exitoso. Redirigiendo...", "success")

        // Redirigir según el rol después de un breve retraso
        setTimeout(() => {
          redirectBasedOnRole(rol)
        }, 1500)
      } catch (error) {
        console.error("Error de registro:", error)
        mostrarMensaje(formRegistro, error.message || "Error al registrar. Inténtalo de nuevo.", "error")
      } finally {
        // Restaurar botón
        if (formRegistro.querySelector('button[type="submit"]')) {
          const submitBtn = formRegistro.querySelector('button[type="submit"]')
          submitBtn.disabled = false
          submitBtn.textContent = originalText || "Registrarse"
        }
      }
    })
  }
})
