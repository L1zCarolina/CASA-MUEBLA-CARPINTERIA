document.addEventListener("DOMContentLoaded", () => {
  // Obtener referencias a elementos del DOM
  const formCambiarPassword = document.getElementById("form-cambiar-password")
  const passwordActual = document.getElementById("password-actual")
  const passwordNueva = document.getElementById("password-nueva")
  const passwordConfirmar = document.getElementById("password-confirmar")
  const mensajeEstado = document.getElementById("mensaje-estado")
  const toggleButtons = document.querySelectorAll(".toggle-password")

  // Declarar la variable API_URL
  const API_URL = "https://tu-api.com" // Reemplaza con la URL real de tu API

  // Configurar botones para mostrar/ocultar contraseña
  toggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target")
      const inputField = document.getElementById(targetId)

      // Cambiar el tipo de input entre password y text
      if (inputField.type === "password") {
        inputField.type = "text"
        this.innerHTML = '<i class="fas fa-eye-slash"></i>'
      } else {
        inputField.type = "password"
        this.innerHTML = '<i class="fas fa-eye"></i>'
      }
    })
  })

  // Manejar envío del formulario
  formCambiarPassword.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Validar que las contraseñas coincidan
    if (passwordNueva.value !== passwordConfirmar.value) {
      mostrarMensaje("Las contraseñas nuevas no coinciden", "error")
      return
    }

    // Validar longitud mínima
    if (passwordNueva.value.length < 6) {
      mostrarMensaje("La contraseña debe tener al menos 6 caracteres", "error")
      return
    }

    // Mostrar mensaje de carga
    mostrarMensaje("Procesando solicitud...", "info")

    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        mostrarMensaje("No has iniciado sesión. Por favor, inicia sesión para cambiar tu contraseña.", "error")
        setTimeout(() => {
          window.location.href = "mi-cuenta.html"
        }, 2000)
        return
      }

      // Preparar datos para enviar
      const datos = {
        password_actual: passwordActual.value,
        password_nueva: passwordNueva.value,
      }

      // Enviar solicitud al servidor
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al cambiar la contraseña")
      }

      // Mostrar mensaje de éxito
      mostrarMensaje("Contraseña actualizada correctamente", "success")

      // Limpiar formulario
      formCambiarPassword.reset()

      // Redirigir después de un tiempo
      setTimeout(() => {
        window.location.href = "mi-cuenta.html"
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      mostrarMensaje(error.message || "Error al cambiar la contraseña", "error")
    }
  })

  // Función para mostrar mensajes
  function mostrarMensaje(texto, tipo) {
    mensajeEstado.textContent = texto
    mensajeEstado.className = "mensaje-estado"

    switch (tipo) {
      case "success":
        mensajeEstado.classList.add("mensaje-exito")
        break
      case "error":
        mensajeEstado.classList.add("mensaje-error")
        break
      case "info":
        mensajeEstado.classList.add("mensaje-info")
        break
    }

    // Hacer scroll al mensaje
    mensajeEstado.scrollIntoView({ behavior: "smooth" })
  }
})
