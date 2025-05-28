// empleado-panel.js - Funcionalidad para el panel de empleado

document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const btnLogout = document.getElementById("btn-logout")
  const panelNavButtons = document.querySelectorAll(".panel-nav-btn")
  const panelSections = document.querySelectorAll(".panel-section")
  const nombreUsuarioElement = document.getElementById("nombre-usuario")
  const nombreEmpleadoElement = document.getElementById("nombre-empleado")
  const emailEmpleadoElement = document.getElementById("email-empleado")
  const rolEmpleadoElement = document.getElementById("rol-empleado")
  const fechaRegistroElement = document.getElementById("fecha-registro")
  const fotoPerfil = document.getElementById("foto-perfil")

  // URL base de la API
  const API_URL =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3001/api"
      : "/api"

  // Verificar si el usuario está autenticado
  const token = localStorage.getItem("token")
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")

  if (!token || usuario.rol !== "empleado") {
    // Redireccionar a la página de inicio de sesión si no hay token o no es empleado
    window.location.href = "mi-cuenta.html"
    return
  }

  // Función para crear el encabezado de autorización
  function getAuthHeader() {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  // Verificar que el token sigue siendo válido
  fetch(`${API_URL}/auth/protected`, {
    headers: getAuthHeader(),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Token inválido")
      }

      // Si el token es válido, continuar con la carga de la página
      inicializarPanel()
    })
    .catch((error) => {
      console.error("Error de autenticación:", error)
      // Redireccionar a la página de inicio de sesión
      localStorage.removeItem("token")
      localStorage.removeItem("usuario")
      window.location.href = "mi-cuenta.html"
    })

  // Función para inicializar el panel
  function inicializarPanel() {
    // Mostrar información del usuario
    if (nombreUsuarioElement && usuario.nombre_usuario) {
      nombreUsuarioElement.textContent = usuario.nombre_usuario
    }

    if (nombreEmpleadoElement && usuario.nombre_usuario) {
      nombreEmpleadoElement.textContent = usuario.nombre_usuario
    }

    if (emailEmpleadoElement && usuario.email_usuario) {
      emailEmpleadoElement.textContent = usuario.email_usuario
    }

    if (rolEmpleadoElement) {
      rolEmpleadoElement.textContent = `Rol: ${usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}`
    }

    if (fechaRegistroElement && usuario.fecha_registro) {
      const fecha = new Date(usuario.fecha_registro)
      fechaRegistroElement.textContent = `Empleado desde: ${fecha.toLocaleDateString()}`
    }

    // Cargar foto de perfil
    if (fotoPerfil) {
      if (usuario.foto_perfil) {
        fotoPerfil.src = `/uploads/${usuario.foto_perfil}`
        fotoPerfil.onerror = function () {
          this.src = "/placeholder.svg?height=150&width=150"
        }
      } else {
        fotoPerfil.src = "/placeholder.svg?height=150&width=150"
      }
    }

    // Evento de cierre de sesión
    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        // Eliminar token y datos de usuario
        localStorage.removeItem("token")
        localStorage.removeItem("usuario")
        // Redireccionar a la página de inicio de sesión
        window.location.href = "mi-cuenta.html"
      })
    }

    // Navegación entre secciones del panel
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

    // Cargar datos desde la API
    cargarDatosAPI()

    // Configurar formularios
    configurarFormularios()

    // Configurar cambio de foto de perfil
    configurarCambioFotoPerfil()
  }

  // Función para cargar datos desde la API
  function cargarDatosAPI() {
    // Cargar datos de productos
    fetch(`${API_URL}/productos`, {
      headers: getAuthHeader(),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar productos")
        return response.json()
      })
      .then((data) => {
        cargarTablaProductos(data)
        document.querySelector(".dashboard-card:nth-child(1) .count").textContent = data.length
      })
      .catch((error) => {
        console.error("Error al cargar productos:", error)
        // Cargar datos de prueba si hay error
        cargarDatosDePrueba("productos")
      })

    // Cargar datos de pedidos
    fetch(`${API_URL}/pedidos`, {
      headers: getAuthHeader(),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar pedidos")
        return response.json()
      })
      .then((data) => {
        cargarTablaPedidos(data)
        document.querySelector(".dashboard-card:nth-child(2) .count").textContent = data.length
      })
      .catch((error) => {
        console.error("Error al cargar pedidos:", error)
        cargarDatosDePrueba("pedidos")
      })

    // Cargar datos de cotizaciones
    fetch(`${API_URL}/cotizaciones`, {
      headers: getAuthHeader(),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar cotizaciones")
        return response.json()
      })
      .then((data) => {
        cargarTablaCotizaciones(data)
        document.querySelector(".dashboard-card:nth-child(3) .count").textContent = data.length
      })
      .catch((error) => {
        console.error("Error al cargar cotizaciones:", error)
        cargarDatosDePrueba("cotizaciones")
      })

    // Cargar categorías para el select de productos
    fetch(`${API_URL}/categorias`, {
      headers: getAuthHeader(),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar categorías")
        return response.json()
      })
      .then((data) => {
        const selectCategoria = document.getElementById("categoria")
        if (selectCategoria) {
          selectCategoria.innerHTML = '<option value="">Seleccionar categoría</option>'
          data.forEach((categoria) => {
            const option = document.createElement("option")
            option.value = categoria.id
            option.textContent = categoria.nombre
            selectCategoria.appendChild(option)
          })
        }
      })
      .catch((error) => {
        console.error("Error al cargar categorías:", error)
      })
  }

  // Función para cargar datos de prueba
  function cargarDatosDePrueba(tipo) {
    switch (tipo) {
      case "productos":
        const productos = [
          { id: 1, nombre: "Mesa de Roble", descripcion: "Mesa de comedor de roble macizo", precio: 1200, stock: 5 },
          { id: 2, nombre: "Silla Moderna", descripcion: "Silla de diseño contemporáneo", precio: 350, stock: 12 },
          {
            id: 3,
            nombre: "Armario Empotrado",
            descripcion: "Armario a medida para dormitorio",
            precio: 2500,
            stock: 3,
          },
        ]
        cargarTablaProductos(productos)
        document.querySelector(".dashboard-card:nth-child(1) .count").textContent = productos.length
        break

      case "pedidos":
        const pedidos = [
          { id: 1, cliente: "Carlos Rodríguez", fecha: "2024-03-15", estado: "pendiente", total: 1550 },
          { id: 2, cliente: "Ana Martínez", fecha: "2024-03-10", estado: "en_proceso", total: 2850 },
          { id: 3, cliente: "Luis Sánchez", fecha: "2024-03-05", estado: "completado", total: 3500 },
        ]
        cargarTablaPedidos(pedidos)
        document.querySelector(".dashboard-card:nth-child(2) .count").textContent = pedidos.length
        break

      case "cotizaciones":
        const cotizaciones = [
          {
            id: 1,
            cliente: "Carlos Rodríguez",
            tipo_mueble: "Mueble de Cocina",
            fecha: "2024-03-12",
            estado: "pendiente",
          },
          {
            id: 2,
            cliente: "Ana Martínez",
            tipo_mueble: "Mueble de Oficina",
            fecha: "2024-03-05",
            estado: "procesada",
          },
          {
            id: 3,
            cliente: "Luis Sánchez",
            tipo_mueble: "Mueble de Dormitorio",
            fecha: "2024-03-01",
            estado: "rechazada",
          },
        ]
        cargarTablaCotizaciones(cotizaciones)
        document.querySelector(".dashboard-card:nth-child(3) .count").textContent = cotizaciones.length
        break
    }
  }

  // Función para cargar tabla de productos
  function cargarTablaProductos(productos) {
    const tabla = document.getElementById("lista-productos")
    if (!tabla) return

    const tbody = tabla.querySelector("tbody")
    tbody.innerHTML = ""

    productos.forEach((producto) => {
      const tr = document.createElement("tr")

      // Crear celdas para cada campo
      const campos = ["id", "nombre", "descripcion", "precio", "stock"]
      campos.forEach((campo) => {
        const td = document.createElement("td")
        if (campo === "precio") {
          td.textContent = `$${Number.parseFloat(producto[campo]).toFixed(2)}`
        } else {
          td.textContent = producto[campo] !== undefined ? producto[campo] : ""
        }
        tr.appendChild(td)
      })

      // Crear celda para acciones
      const tdAcciones = document.createElement("td")
      tdAcciones.className = "acciones"

      const btnEditar = document.createElement("button")
      btnEditar.className = "btn-accion btn-editar"
      btnEditar.innerHTML = '<i class="fas fa-edit"></i>'
      btnEditar.title = "Editar"
      btnEditar.addEventListener("click", () => {
        editarProducto(producto)
      })

      const btnEliminar = document.createElement("button")
      btnEliminar.className = "btn-accion btn-eliminar"
      btnEliminar.innerHTML = '<i class="fas fa-trash-alt"></i>'
      btnEliminar.title = "Eliminar"
      btnEliminar.addEventListener("click", () => {
        eliminarProducto(producto.id)
      })

      tdAcciones.appendChild(btnEditar)
      tdAcciones.appendChild(btnEliminar)
      tr.appendChild(tdAcciones)

      tbody.appendChild(tr)
    })
  }

  // Función para cargar tabla de pedidos
  function cargarTablaPedidos(pedidos) {
    const tabla = document.getElementById("lista-pedidos")
    if (!tabla) return

    const tbody = tabla.querySelector("tbody")
    tbody.innerHTML = ""

    pedidos.forEach((pedido) => {
      const tr = document.createElement("tr")

      // Crear celdas para cada campo
      const campos = ["id", "cliente", "fecha", "estado", "total"]
      campos.forEach((campo) => {
        const td = document.createElement("td")
        if (campo === "fecha") {
          td.textContent = new Date(pedido[campo]).toLocaleDateString()
        } else if (campo === "total") {
          td.textContent = `$${Number.parseFloat(pedido[campo]).toFixed(2)}`
        } else if (campo === "estado") {
          td.textContent = pedido[campo].replace("_", " ")
          td.className = pedido[campo]
        } else {
          td.textContent = pedido[campo] !== undefined ? pedido[campo] : ""
        }
        tr.appendChild(td)
      })

      // Crear celda para acciones
      const tdAcciones = document.createElement("td")
      tdAcciones.className = "acciones"

      const btnVer = document.createElement("button")
      btnVer.className = "btn-accion btn-ver"
      btnVer.innerHTML = '<i class="fas fa-eye"></i>'
      btnVer.title = "Ver detalles"
      btnVer.addEventListener("click", () => {
        verDetallesPedido(pedido.id)
      })

      const btnActualizar = document.createElement("button")
      btnActualizar.className = "btn-accion btn-actualizar"
      btnActualizar.innerHTML = '<i class="fas fa-sync-alt"></i>'
      btnActualizar.title = "Actualizar estado"
      btnActualizar.addEventListener("click", () => {
        actualizarEstadoPedido(pedido)
      })

      tdAcciones.appendChild(btnVer)
      tdAcciones.appendChild(btnActualizar)
      tr.appendChild(tdAcciones)

      tbody.appendChild(tr)
    })
  }

  // Función para cargar tabla de cotizaciones
  function cargarTablaCotizaciones(cotizaciones) {
    const tabla = document.getElementById("lista-cotizaciones")
    if (!tabla) return

    const tbody = tabla.querySelector("tbody")
    tbody.innerHTML = ""

    cotizaciones.forEach((cotizacion) => {
      const tr = document.createElement("tr")

      // Crear celdas para cada campo
      const campos = ["id", "cliente", "tipo_mueble", "fecha", "estado"]
      campos.forEach((campo) => {
        const td = document.createElement("td")
        if (campo === "fecha") {
          td.textContent = new Date(cotizacion[campo]).toLocaleDateString()
        } else if (campo === "estado") {
          td.textContent = cotizacion[campo]
          td.className = cotizacion[campo]
        } else {
          td.textContent = cotizacion[campo] !== undefined ? cotizacion[campo] : ""
        }
        tr.appendChild(td)
      })

      // Crear celda para acciones
      const tdAcciones = document.createElement("td")
      tdAcciones.className = "acciones"

      const btnResponder = document.createElement("button")
      btnResponder.className = "btn-accion btn-responder"
      btnResponder.innerHTML = '<i class="fas fa-reply"></i>'
      btnResponder.title = "Responder"
      btnResponder.addEventListener("click", () => {
        responderCotizacion(cotizacion)
      })

      tdAcciones.appendChild(btnResponder)
      tr.appendChild(tdAcciones)

      tbody.appendChild(tr)
    })
  }

  // Función para editar un producto
  function editarProducto(producto) {
    const formulario = document.getElementById("formulario-producto")
    if (!formulario) return

    // Llenar el formulario con los datos del producto
    document.getElementById("nombre_producto").value = producto.nombre
    document.getElementById("descripcion").value = producto.descripcion
    document.getElementById("precio").value = producto.precio
    document.getElementById("stock").value = producto.stock
    document.getElementById("categoria").value = producto.categoria || ""

    // Cambiar el texto del botón
    const boton = formulario.querySelector("button[type='submit']")
    if (boton) boton.textContent = "Actualizar Producto"

    // Agregar un campo oculto para el ID
    let idInput = formulario.querySelector("input[name='id']")
    if (!idInput) {
      idInput = document.createElement("input")
      idInput.type = "hidden"
      idInput.name = "id"
      formulario.appendChild(idInput)
    }
    idInput.value = producto.id

    // Hacer scroll al formulario
    formulario.scrollIntoView({ behavior: "smooth" })
  }

  // Función para eliminar un producto
  function eliminarProducto(id) {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al eliminar el producto")
        return response.json()
      })
      .then((data) => {
        alert("Producto eliminado correctamente")
        cargarDatosAPI()
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Error al eliminar el producto: " + error.message)
      })
  }

  // Función para ver detalles de un pedido
  function verDetallesPedido(id) {
    alert(`Ver detalles del pedido #${id}`)
    // Aquí implementarías la lógica para mostrar los detalles del pedido
  }

  // Función para actualizar el estado de un pedido
  function actualizarEstadoPedido(pedido) {
    const nuevoEstado = prompt(
      "Seleccione el nuevo estado (pendiente, en_proceso, completado, cancelado):",
      pedido.estado,
    )

    if (!nuevoEstado) return

    fetch(`${API_URL}/pedidos/${pedido.id}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify({
        estado: nuevoEstado,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al actualizar el estado del pedido")
        return response.json()
      })
      .then((data) => {
        alert("Estado del pedido actualizado correctamente")
        cargarDatosAPI()
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Error al actualizar el estado del pedido: " + error.message)
      })
  }

  // Función para responder a una cotización
  function responderCotizacion(cotizacion) {
    if (cotizacion.estado !== "pendiente") {
      alert("Solo se pueden responder cotizaciones pendientes")
      return
    }

    const precio = prompt("Ingrese el precio cotizado:")
    if (!precio) return

    const estado = confirm("¿Desea aprobar esta cotización?") ? "procesada" : "rechazada"

    fetch(`${API_URL}/cotizaciones/${cotizacion.id}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify({
        estado: estado,
        precio_cotizado: precio,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al responder la cotización")
        return response.json()
      })
      .then((data) => {
        alert("Cotización respondida correctamente")
        cargarDatosAPI()
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Error al responder la cotización: " + error.message)
      })
  }

  // Función para configurar formularios
  function configurarFormularios() {
    // Formulario de productos
    const formularioProducto = document.getElementById("formulario-producto")
    if (formularioProducto) {
      formularioProducto.addEventListener("submit", function (e) {
        e.preventDefault()

        const formData = new FormData(this)
        const idProducto = formData.get("id")
        const method = idProducto ? "PUT" : "POST"
        const url = idProducto ? `${API_URL}/productos/${idProducto}` : `${API_URL}/productos`

        fetch(url, {
          method: method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
          .then((response) => {
            if (!response.ok) throw new Error("Error al procesar el producto")
            return response.json()
          })
          .then((data) => {
            alert(idProducto ? "Producto actualizado correctamente" : "Producto agregado correctamente")
            this.reset()

            // Restaurar el botón a su estado original
            const boton = this.querySelector("button[type='submit']")
            if (boton) boton.textContent = "Agregar Producto"

            // Eliminar el campo oculto de ID
            const idInput = this.querySelector("input[name='id']")
            if (idInput) idInput.remove()

            cargarDatosAPI()
          })
          .catch((error) => {
            console.error("Error:", error)
            alert("Error al procesar el producto: " + error.message)
          })
      })
    }

    // Formulario de edición de perfil
    const formEditarPerfil = document.getElementById("form-editar-perfil")
    if (formEditarPerfil) {
      formEditarPerfil.addEventListener("submit", function (e) {
        e.preventDefault()

        const formData = new FormData(this)
        const datosUsuario = {
          nombre_usuario: formData.get("nombre_usuario"),
          email_usuario: formData.get("email_usuario"),
        }

        fetch(`${API_URL}/usuarios/${usuario.id_usuario}`, {
          method: "PATCH",
          headers: getAuthHeader(),
          body: JSON.stringify(datosUsuario),
        })
          .then((response) => {
            if (!response.ok) throw new Error("Error al actualizar el perfil")
            return response.json()
          })
          .then((data) => {
            alert("Perfil actualizado correctamente")

            // Actualizar datos en localStorage
            const usuarioActualizado = {
              ...usuario,
              nombre_usuario: datosUsuario.nombre_usuario,
              email_usuario: datosUsuario.email_usuario,
            }
            localStorage.setItem("usuario", JSON.stringify(usuarioActualizado))

            // Actualizar información en la página
            if (nombreUsuarioElement) nombreUsuarioElement.textContent = datosUsuario.nombre_usuario
            if (nombreEmpleadoElement) nombreEmpleadoElement.textContent = datosUsuario.nombre_usuario
            if (emailEmpleadoElement) emailEmpleadoElement.textContent = datosUsuario.email_usuario
          })
          .catch((error) => {
            console.error("Error:", error)
            alert("Error al actualizar el perfil: " + error.message)
          })
      })
    }

    // Formulario de cambio de contraseña
    const formCambiarPassword = document.getElementById("form-cambiar-password")
    if (formCambiarPassword) {
      formCambiarPassword.addEventListener("submit", function (e) {
        e.preventDefault()

        const passwordActual = document.getElementById("password-actual").value
        const passwordNueva = document.getElementById("password-nueva").value
        const passwordConfirmar = document.getElementById("password-confirmar").value

        if (passwordNueva !== passwordConfirmar) {
          alert("Las contraseñas no coinciden")
          return
        }

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
          .then((data) => {
            alert("Contraseña cambiada correctamente")
            this.reset()
          })
          .catch((error) => {
            console.error("Error:", error)
            alert("Error al cambiar la contraseña: " + error.message)
          })
      })
    }
  }

  // Función para configurar el cambio de foto de perfil
  function configurarCambioFotoPerfil() {
    const inputNuevaFoto = document.getElementById("nueva-foto")
    if (inputNuevaFoto) {
      inputNuevaFoto.addEventListener("change", function (e) {
        if (this.files && this.files[0]) {
          const formData = new FormData()
          formData.append("foto_perfil", this.files[0])

          fetch(`${API_URL}/usuarios/${usuario.id_usuario}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          })
            .then((response) => {
              if (!response.ok) throw new Error("Error al actualizar la foto de perfil")
              return response.json()
            })
            .then((data) => {
              alert("Foto de perfil actualizada correctamente")

              // Actualizar foto en localStorage
              const usuarioActualizado = {
                ...usuario,
                foto_perfil: data.foto_perfil,
              }
              localStorage.setItem("usuario", JSON.stringify(usuarioActualizado))

              // Actualizar foto en la página
              if (fotoPerfil && data.foto_perfil) {
                fotoPerfil.src = `/uploads/${data.foto_perfil}`
              }
            })
            .catch((error) => {
              console.error("Error:", error)
              alert("Error al actualizar la foto de perfil: " + error.message)
            })
        }
      })
    }
  }
})
