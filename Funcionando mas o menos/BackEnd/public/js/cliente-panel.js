// cliente-panel.js - Funcionalidad para el panel de cliente

// Función para verificar si el token ha expirado
function isTokenExpired(token) {
  try {
    // Dividir el token en sus partes
    const parts = token.split(".")
    if (parts.length !== 3) {
      console.error("Formato de token inválido")
      return true
    }

    // Decodificar la parte del payload (segunda parte)
    const payload = JSON.parse(atob(parts[1]))

    // Verificar si tiene una fecha de expiración
    if (!payload.exp) {
      console.error("Token no tiene fecha de expiración")
      return true
    }

    // Comparar con la fecha actual
    const now = Math.floor(Date.now() / 1000)
    return now >= payload.exp
  } catch (e) {
    console.error("Error al verificar el token:", e)
    return true // Si hay algún error, consideramos que el token ha expirado
  }
}

// Función para mostrar mensajes de error
function mostrarMensajeError(mensaje) {
  const mensajeContainer = document.getElementById("mensaje-container")
  if (mensajeContainer) {
    mensajeContainer.textContent = mensaje
    mensajeContainer.style.display = "block"

    // Ocultar después de 3 segundos
    setTimeout(() => {
      mensajeContainer.style.display = "none"
    }, 3000)
  } else {
    alert(mensaje)
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  console.log("Cerrando sesión...")
  localStorage.removeItem("token")
  localStorage.removeItem("usuario")
  localStorage.removeItem("cliente_id")
  window.location.href = "mi-cuenta.html?logout=true"
}

// Función para obtener el encabezado de autorización
function getAuthHeader() {
  const token = localStorage.getItem("token")
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

// Función para cargar datos del cliente
function cargarDatosCliente() {
  const token = localStorage.getItem("token")
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")

  if (!token || !usuario.id_usuario) {
    mostrarMensajeError("No se pudo identificar al usuario")
    return
  }

  const API_URL =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3001/api"
      : "/api"

  // Mostrar el nombre del usuario
  const nombreUsuarioElement = document.getElementById("nombre-usuario")
  if (nombreUsuarioElement && usuario.nombre_usuario) {
    nombreUsuarioElement.textContent = usuario.nombre_usuario
  }

  // Buscar el cliente por el email del usuario
  fetch(`${API_URL}/clientes`, {
    headers: getAuthHeader(),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error al cargar datos del cliente")
      return response.json()
    })
    .then((clientes) => {
      // Buscar el cliente que coincida con el email del usuario
      const cliente = clientes.find((c) => c.email === usuario.email_usuario)

      if (cliente) {
        // Actualizar información del perfil
        document.getElementById("nombre-cliente").textContent = `${cliente.nombre} ${cliente.apellido}`
        document.getElementById("email-cliente").textContent = cliente.email
        document.getElementById("telefono-cliente").textContent = cliente.telefono || "No disponible"

        // Actualizar formulario de edición
        document.getElementById("editar-nombre").value = cliente.nombre || ""
        document.getElementById("editar-apellido").value = cliente.apellido || ""
        document.getElementById("editar-email").value = cliente.email || ""
        document.getElementById("editar-telefono").value = cliente.telefono || ""
        document.getElementById("editar-direccion").value = cliente.direccion || ""

        // Guardar ID del cliente para otras operaciones
        localStorage.setItem("cliente_id", cliente.id)

        // Cargar pedidos del cliente
        cargarPedidosCliente(cliente.id)
      } else {
        console.error("No se encontró el cliente con el email:", usuario.email_usuario)
        mostrarMensajeError("No se encontraron tus datos de cliente")
      }
    })
    .catch((error) => {
      console.error("Error al cargar datos del cliente:", error)
      mostrarMensajeError("Error al cargar tus datos. Por favor, intenta nuevamente más tarde.")
    })
}

// Función para cargar pedidos del cliente
function cargarPedidosCliente(clienteId) {
  if (!clienteId) return

  const API_URL =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3001/api"
      : "/api"

  fetch(`${API_URL}/pedidos`, {
    headers: getAuthHeader(),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error al cargar pedidos")
      return response.json()
    })
    .then((pedidos) => {
      // Filtrar pedidos del cliente
      const pedidosCliente = pedidos.filter((p) => p.cliente_id == clienteId)

      // Contenedor de pedidos
      const pedidosLista = document.querySelector(".pedidos-lista")
      if (!pedidosLista) return

      if (pedidosCliente.length === 0) {
        pedidosLista.innerHTML = '<p class="no-pedidos">No tienes pedidos registrados.</p>'
        return
      }

      pedidosLista.innerHTML = ""

      // Mostrar cada pedido
      pedidosCliente.forEach((pedido) => {
        const pedidoItem = document.createElement("div")
        pedidoItem.className = "pedido-item"
        pedidoItem.innerHTML = `
          <div class="pedido-header">
            <div class="pedido-info">
              <span class="pedido-id">#${pedido.id}</span>
              <span class="pedido-fecha">${new Date(pedido.fecha_creacion || Date.now()).toLocaleDateString()}</span>
            </div>
            <div class="pedido-estado ${pedido.estado.toLowerCase()}">${pedido.estado}</div>
          </div>
          <div class="pedido-footer">
            <div class="pedido-total">
              <span>Total:</span>
              <span class="precio">$${pedido.total ? pedido.total.toFixed(2) : "0.00"}</span>
            </div>
            <div class="pedido-acciones">
              <button class="btn-ver-detalles">Ver Detalles</button>
              ${
                pedido.estado.toLowerCase() === "pendiente"
                  ? '<button class="btn-cancelar">Cancelar Pedido</button>'
                  : ""
              }
              ${
                pedido.estado.toLowerCase() === "completado"
                  ? '<button class="btn-valorar">Valorar Productos</button>'
                  : ""
              }
            </div>
          </div>
        `

        // Agregar evento para ver detalles
        const btnVerDetalles = pedidoItem.querySelector(".btn-ver-detalles")
        if (btnVerDetalles) {
          btnVerDetalles.addEventListener("click", () => {
            verDetallesPedido(pedido.id)
          })
        }

        // Agregar evento para cancelar pedido
        const btnCancelar = pedidoItem.querySelector(".btn-cancelar")
        if (btnCancelar) {
          btnCancelar.addEventListener("click", () => {
            cancelarPedido(pedido.id)
          })
        }

        pedidosLista.appendChild(pedidoItem)
      })
    })
    .catch((error) => {
      console.error("Error al cargar pedidos:", error)
      const pedidosLista = document.querySelector(".pedidos-lista")
      if (pedidosLista) {
        pedidosLista.innerHTML =
          '<p class="error-message">Error al cargar tus pedidos. Por favor, intenta nuevamente más tarde.</p>'
      }
    })
}

// Función para ver detalles de un pedido
function verDetallesPedido(pedidoId) {
  alert(`Ver detalles del pedido #${pedidoId}`)
  // Aquí implementarías la lógica para mostrar los detalles del pedido
}

// Función para cancelar un pedido
function cancelarPedido(pedidoId) {
  if (!confirm(`¿Estás seguro de cancelar el pedido #${pedidoId}?`)) return

  const API_URL =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3001/api"
      : "/api"

  fetch(`${API_URL}/pedidos/${pedidoId}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify({ estado: "cancelado" }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error al cancelar el pedido")
      return response.json()
    })
    .then(() => {
      alert("Pedido cancelado correctamente")
      // Recargar pedidos
      const clienteId = localStorage.getItem("cliente_id")
      if (clienteId) {
        cargarPedidosCliente(clienteId)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      mostrarMensajeError("Error al cancelar el pedido: " + error.message)
    })
}

// Añadir código para cargar y actualizar la foto de perfil
function cargarFotoPerfil() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")
  const fotoPerfil = document.getElementById("foto-perfil")

  if (fotoPerfil) {
    if (usuario.foto_perfil) {
      fotoPerfil.src = `/uploads/${usuario.foto_perfil}`
      fotoPerfil.onerror = function () {
        // Si hay error al cargar la imagen, mostrar una imagen por defecto
        this.src = "/placeholder.svg?height=150&width=150"
      }
    } else {
      fotoPerfil.src = "/placeholder.svg?height=150&width=150"
    }
  }
}

// Inicializar la página cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicializando panel de cliente...")

  // Verificar autenticación de forma menos estricta
  const token = localStorage.getItem("token")
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")

  console.log("Token:", token ? "Presente" : "Ausente")
  console.log("Usuario:", usuario)

  // Si no hay token, redirigir al login
  if (!token) {
    console.warn("No hay token")
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    window.location.href = "mi-cuenta.html"
    return
  }

  // Permitir acceso a usuarios con cualquier rol, pero mostrar advertencia si no es cliente
  if (usuario.rol !== "cliente" && usuario.rol !== "usuario") {
    console.warn("Usuario no tiene rol de cliente:", usuario.rol)
    // Mostrar advertencia pero permitir acceso
    const mensajeContainer = document.createElement("div")
    mensajeContainer.className = "mensaje-advertencia"
    mensajeContainer.textContent =
      "Estás accediendo al panel de cliente con un rol diferente. Algunas funciones podrían estar limitadas."
    document.body.insertBefore(mensajeContainer, document.body.firstChild)

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      mensajeContainer.style.display = "none"
    }, 5000)
  }

  // Configurar el botón de cerrar sesión
  const btnLogout = document.getElementById("btn-logout")
  if (btnLogout) {
    btnLogout.addEventListener("click", cerrarSesion)
  }

  // Configurar navegación entre secciones
  const panelNavButtons = document.querySelectorAll(".panel-nav-btn")
  const panelSections = document.querySelectorAll(".panel-section")

  panelNavButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remover clase active de todos los botones
      panelNavButtons.forEach((btn) => btn.classList.remove("active"))
      // Añadir clase active al botón clickeado
      this.classList.add("active")

      // Ocultar todas las secciones
      panelSections.forEach((section) => section.classList.remove("active"))

      // Mostrar la sección correspondiente
      const sectionId = this.getAttribute("data-section")
      document.getElementById(sectionId).classList.add("active")
    })
  })

  // Cargar datos del cliente
  cargarDatosCliente()

  // Cargar foto de perfil
  cargarFotoPerfil()

  // Configurar formulario de edición de perfil
  const formEditarPerfil = document.getElementById("form-editar-perfil")
  if (formEditarPerfil) {
    formEditarPerfil.addEventListener("submit", (e) => {
      e.preventDefault()

      const clienteId = localStorage.getItem("cliente_id")
      if (!clienteId) {
        mostrarMensajeError("Error: No se pudo identificar tu cuenta de cliente")
        return
      }

      const nombre = document.getElementById("editar-nombre").value
      const apellido = document.getElementById("editar-apellido").value
      const email = document.getElementById("editar-email").value
      const telefono = document.getElementById("editar-telefono").value
      const direccion = document.getElementById("editar-direccion").value

      const API_URL =
        window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
          ? "http://localhost:3001/api"
          : "/api"

      fetch(`${API_URL}/clientes/${clienteId}`, {
        method: "PUT",
        headers: getAuthHeader(),
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          telefono,
          direccion,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error al actualizar el perfil")
          return response.json()
        })
        .then(() => {
          alert("Perfil actualizado correctamente")

          // Actualizar información visible
          document.getElementById("nombre-cliente").textContent = `${nombre} ${apellido}`
          document.getElementById("email-cliente").textContent = email
          document.getElementById("telefono-cliente").textContent = telefono
        })
        .catch((error) => {
          console.error("Error:", error)
          mostrarMensajeError("Error al actualizar el perfil: " + error.message)
        })
    })
  }

  // Configurar formulario de cambio de contraseña
  const formCambiarPassword = document.getElementById("form-cambiar-password")
  if (formCambiarPassword) {
    formCambiarPassword.addEventListener("submit", (e) => {
      e.preventDefault()

      const passwordActual = document.getElementById("password-actual").value
      const passwordNueva = document.getElementById("password-nueva").value
      const passwordConfirmar = document.getElementById("password-confirmar").value

      // Validación básica
      if (!passwordActual || !passwordNueva || !passwordConfirmar) {
        mostrarMensajeError("Por favor, completa todos los campos.")
        return
      }

      if (passwordNueva !== passwordConfirmar) {
        mostrarMensajeError("Las contraseñas no coinciden.")
        return
      }

      const API_URL =
        window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
          ? "http://localhost:3001/api"
          : "/api"

      fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({
          password_actual: passwordActual,
          password_nueva: passwordNueva,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error al cambiar la contraseña")
          return response.json()
        })
        .then(() => {
          alert("Contraseña cambiada correctamente")
          formCambiarPassword.reset()
        })
        .catch((error) => {
          console.error("Error:", error)
          mostrarMensajeError("Error al cambiar la contraseña: " + error.message)
        })
    })
  }

  // Configurar formulario de cotización
  const formCotizacion = document.getElementById("form-cotizacion")
  if (formCotizacion) {
    formCotizacion.addEventListener("submit", function (e) {
      e.preventDefault()

      const clienteId = localStorage.getItem("cliente_id")
      if (!clienteId) {
        mostrarMensajeError("Error: No se pudo identificar tu cuenta de cliente")
        return
      }

      const tipoMueble = document.getElementById("tipo-mueble").value
      const descripcion = document.getElementById("descripcion-cotizacion").value

      // Validación básica
      if (!tipoMueble || !descripcion) {
        mostrarMensajeError("Por favor, completa todos los campos obligatorios.")
        return
      }

      // Aquí se enviaría la solicitud de cotización a la API
      // Como es una funcionalidad que no está implementada en el backend,
      // mostramos un mensaje de éxito simulado
      alert("Cotización enviada correctamente. Te contactaremos pronto.")
      this.reset()
    })
  }

  // Manejar cambio de foto de perfil
  const inputNuevaFoto = document.getElementById("nueva-foto")
  if (inputNuevaFoto) {
    inputNuevaFoto.addEventListener("change", async function (e) {
      if (this.files && this.files[0]) {
        const formData = new FormData()
        formData.append("foto_perfil", this.files[0])

        try {
          const API_URL =
            window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
              ? "http://localhost:3001/api"
              : "/api"

          const response = await fetch(
            `${API_URL}/usuarios/${JSON.parse(localStorage.getItem("usuario")).id_usuario}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: formData,
            },
          )

          if (!response.ok) throw new Error("Error al actualizar la foto")

          const data = await response.json()

          // Actualizar la foto en el localStorage
          const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")
          usuario.foto_perfil = data.foto_perfil
          localStorage.setItem("usuario", JSON.stringify(usuario))

          // Actualizar la imagen mostrada
          cargarFotoPerfil()

          alert("Foto de perfil actualizada correctamente")
        } catch (error) {
          console.error("Error:", error)
          alert("Error al actualizar la foto de perfil")
        }
      }
    })
  }
})
