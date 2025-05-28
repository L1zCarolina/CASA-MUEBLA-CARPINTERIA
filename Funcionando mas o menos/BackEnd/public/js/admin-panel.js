// admin-panel.js - Panel de administración ARREGLADO COMPLETAMENTE

document.addEventListener("DOMContentLoaded", () => {
  // Variables globales
  const API_URL = "http://localhost:3001/api"
  let vistaActual = localStorage.getItem("vistaProductos") || "cards"
  let editandoProducto = false
  let productoEditandoId = null
  let seccionActual = "dashboard"
  const productosSeleccionados = new Set()
  let productosData = [] // ← CACHE DE PRODUCTOS

  // Referencias DOM
  const btnLogout = document.getElementById("btn-logout")
  const panelNavButtons = document.querySelectorAll(".panel-nav-btn")
  const panelSections = document.querySelectorAll(".panel-section")

  // Referencias específicas de productos
  const mensajeProductos = document.getElementById("mensaje-productos")
  const btnToggleVista = document.getElementById("btn-toggle-vista")
  const btnNuevoProducto = document.getElementById("btn-nuevo-producto")
  const formularioContainer = document.getElementById("formulario-producto-container")
  const formularioProducto = document.getElementById("formulario-producto")
  const formularioTitulo = document.getElementById("formulario-titulo")
  const btnGuardarProducto = document.getElementById("btn-guardar-producto")
  const btnCancelarProducto = document.getElementById("btn-cancelar-producto")
  const productosCards = document.getElementById("productos-cards")
  const productosTablaContainer = document.getElementById("productos-tabla-container")

  // Verificar autenticación
  const token = localStorage.getItem("token")
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")

  if (!token || usuario.rol !== "admin") {
    window.location.href = "mi-cuenta.html"
    return
  }

  // Headers para peticiones
  function getAuthHeader() {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  // ========== RESTAURAR SECCIÓN ACTIVA AL RECARGAR ==========
  function restaurarSeccionActiva() {
    const seccionGuardada = localStorage.getItem("seccionActiva") || "dashboard"
    cambiarSeccion(seccionGuardada)
  }

  // ========== CAMBIAR SECCIÓN Y GUARDAR ESTADO ==========
  function cambiarSeccion(seccion) {
    seccionActual = seccion
    localStorage.setItem("seccionActiva", seccion)

    // Actualizar navegación
    panelNavButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.section === seccion)
    })

    // Mostrar sección
    panelSections.forEach((sec) => {
      sec.classList.toggle("active", sec.id === seccion)
    })

    // Si cambiamos de sección, ocultar formulario de producto
    if (seccion !== "productos") {
      ocultarFormularioProducto()
    }

    // ← RESTAURAR VISTA AL ENTRAR A PRODUCTOS
    if (seccion === "productos") {
      aplicarVistaGuardada()
    }
  }

  // ========== GESTIÓN DE VISTA Y RECORDAR PREFERENCIA ==========
  function aplicarVistaGuardada() {
    console.log("Aplicando vista guardada:", vistaActual)

    if (vistaActual === "cards") {
      productosCards.style.display = "grid"
      productosTablaContainer.style.display = "none"
      btnToggleVista.innerHTML = '<i class="fas fa-table"></i> Vista Tabla'

      // ← RECARGAR CARDS SI ESTÁN VACÍAS PERO HAY DATOS
      if (productosData.length > 0 && productosCards.children.length === 0) {
        cargarProductosCards(productosData)
      }
    } else {
      productosCards.style.display = "none"
      productosTablaContainer.style.display = "block"
      btnToggleVista.innerHTML = '<i class="fas fa-th-large"></i> Vista Cards'

      // ← RECARGAR TABLA SI ESTÁ VACÍA PERO HAY DATOS
      if (productosData.length > 0) {
        const tbody = document.querySelector("#lista-productos tbody")
        if (tbody && tbody.children.length === 0) {
          cargarProductosTabla(productosData)
        }
      }
    }
  }

  function toggleVista() {
    vistaActual = vistaActual === "cards" ? "tabla" : "cards"
    localStorage.setItem("vistaProductos", vistaActual)
    console.log("Cambiando vista a:", vistaActual)

    aplicarVistaGuardada()
  }

  // ========== FUNCIONES DE UTILIDAD ==========

  function mostrarMensaje(mensaje, tipo = "info") {
    if (!mensajeProductos) return

    mensajeProductos.className = `mensaje-estado mensaje-${tipo}`
    mensajeProductos.textContent = mensaje
    mensajeProductos.style.display = "block"

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      mensajeProductos.style.display = "none"
    }, 5000)
  }

  function obtenerNombreCategoria(idCategoria) {
    const categorias = {
      1: "Sillas",
      2: "Mesas",
      3: "Muebles de sala",
      4: "Muebles de comedor",
      5: "Muebles de dormitorio",
      6: "Muebles de oficina",
    }
    return categorias[idCategoria] || "Sin categoría"
  }

  // ========== GESTIÓN DE PRODUCTOS ==========

  function mostrarFormularioProducto() {
    formularioContainer.style.display = "block"
    formularioContainer.scrollIntoView({ behavior: "smooth" })
  }

  function ocultarFormularioProducto() {
    formularioContainer.style.display = "none"
    resetearFormularioProducto()
  }

  function resetearFormularioProducto() {
    formularioProducto.reset()
    editandoProducto = false
    productoEditandoId = null
    formularioTitulo.textContent = "Nuevo Producto"
    btnGuardarProducto.innerHTML = '<i class="fas fa-save"></i> Guardar Producto'

    // Limpiar campo hidden
    const productoIdInput = document.getElementById("producto-id")
    if (productoIdInput) {
      productoIdInput.value = ""
    }

    // Ocultar imagen actual
    const imagenActualContainer = document.getElementById("imagen-actual-container")
    if (imagenActualContainer) {
      imagenActualContainer.style.display = "none"
    }

    // Limpiar vista previa
    const imagenPreview = document.getElementById("imagen-preview")
    if (imagenPreview) {
      imagenPreview.innerHTML = ""
    }

    // Hacer imagen requerida para nuevos productos
    const imagenInput = document.getElementById("imagen_producto")
    if (imagenInput) {
      if (!editandoProducto) {
        imagenInput.setAttribute("required", "")
      } else {
        imagenInput.removeAttribute("required")
      }
    }
  }

  function cargarProductos() {
    console.log("Cargando productos...")

    fetch(`${API_URL}/productos`)
      .then((response) => {
        console.log("Respuesta recibida:", response.status)
        if (!response.ok) throw new Error("Error al cargar productos")
        return response.json()
      })
      .then((data) => {
        console.log("Datos recibidos:", data)

        // ← VERIFICAR QUE SEA ARRAY Y NO OBJETO CON MENSAJE
        let productos = []
        if (Array.isArray(data)) {
          productos = data
        } else if (data && Array.isArray(data.productos)) {
          productos = data.productos
        } else {
          console.error("Respuesta no es array válido:", data)
          throw new Error("Formato de respuesta inválido")
        }

        // ← GUARDAR EN CACHE
        productosData = productos
        console.log(`Procesando ${productos.length} productos`)

        // Cargar en ambas vistas
        cargarProductosCards(productos)
        cargarProductosTabla(productos)

        // Actualizar contador en dashboard
        const contador = document.querySelector(".dashboard-card:nth-child(2) .count")
        if (contador) contador.textContent = productos.length

        if (productos.length === 0) {
          mostrarMensaje("No hay productos registrados", "info")
        } else {
          mostrarMensaje(`${productos.length} productos cargados correctamente`, "exito")
        }
      })
      .catch((error) => {
        console.error("Error cargando productos:", error)
        mostrarMensaje("Error al cargar productos", "error")
        productosData = []
        cargarProductosCards([])
        cargarProductosTabla([])
      })
  }

  function cargarProductosCards(productos) {
    if (!productosCards) return

    productosCards.innerHTML = ""

    if (productos.length === 0) {
      productosCards.innerHTML = `
        <div class="no-productos">
          <div style="text-align: center; padding: 40px; color: #666;">
            <i class="fas fa-box" style="font-size: 3rem; margin-bottom: 20px; color: #ddd;"></i>
            <h3>No hay productos registrados</h3>
            <p>Comienza agregando tu primer producto</p>
            <button onclick="mostrarFormularioNuevoProducto()" class="boton-panel" style="margin-top: 20px;">
              <i class="fas fa-plus"></i> Agregar Producto
            </button>
          </div>
        </div>
      `
      return
    }

    productos.forEach((producto) => {
      const card = document.createElement("div")
      card.className = "producto-card"
      card.innerHTML = `
        <div class="producto-imagen">
          ${
            producto.imagen_producto
              ? `<img src="http://localhost:3001/uploads/${producto.imagen_producto}" alt="${producto.nombre_producto}" onclick="mostrarImagenGrande('http://localhost:3001/uploads/${producto.imagen_producto}')">`
              : `<div class="sin-imagen"><i class="fas fa-image"></i><span>Sin imagen</span></div>`
          }
        </div>
        <div class="producto-info">
          <h3 class="producto-nombre">${producto.nombre_producto}</h3>
          <p class="producto-descripcion">${producto.descripcion_producto}</p>
          <div class="producto-detalles">
            <span class="producto-precio">$${Number.parseFloat(producto.precio).toFixed(2)}</span>
            <span class="producto-stock ${producto.stock <= 0 ? "sin-stock" : producto.stock <= 10 ? "poco-stock" : "con-stock"}">
              Stock: ${producto.stock}
            </span>
          </div>
          <p class="producto-categoria">${obtenerNombreCategoria(producto.id_categoria)}</p>
        </div>
        <div class="producto-acciones">
          <button class="btn-editar" onclick="editarProducto(${producto.id_producto})" title="Editar producto">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn-eliminar" onclick="eliminarProducto(${producto.id_producto})" title="Eliminar producto">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      `
      productosCards.appendChild(card)
    })
  }

  function cargarProductosTabla(productos) {
    const tabla = document.getElementById("lista-productos")
    if (!tabla) return

    const tbody = tabla.querySelector("tbody")
    tbody.innerHTML = ""

    if (productos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 20px; color: #666;">
            No hay productos registrados
          </td>
        </tr>
      `
      return
    }

    productos.forEach((producto) => {
      const tr = document.createElement("tr")
      tr.style.borderBottom = "1px solid #eee"

      tr.innerHTML = `
        <td style="text-align: center;">
          <input type="checkbox" class="producto-checkbox" value="${producto.id_producto}" onchange="actualizarSeleccion()">
        </td>
        <td style="font-weight: bold;">${producto.id_producto}</td>
        <td style="text-align: center;">
          ${
            producto.imagen_producto
              ? `<img src="http://localhost:3001/uploads/${producto.imagen_producto}" 
                   alt="Imagen" 
                   style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; cursor: pointer;"
                   onclick="mostrarImagenGrande('http://localhost:3001/uploads/${producto.imagen_producto}')">`
              : '<span style="color: #999; font-size: 12px;">Sin imagen</span>'
          }
        </td>
        <td style="font-weight: 500;">${producto.nombre_producto}</td>
        <td style="font-size: 13px; color: #666;" title="${producto.descripcion_producto}">
          ${
            producto.descripcion_producto?.length > 50
              ? producto.descripcion_producto.substring(0, 50) + "..."
              : producto.descripcion_producto || "Sin descripción"
          }
        </td>
        <td style="color: #e8491d; font-weight: bold;">$${Number.parseFloat(producto.precio).toFixed(2)}</td>
        <td style="text-align: center;">
          <span style="background: ${producto.stock > 10 ? "#d4edda" : producto.stock > 0 ? "#fff3cd" : "#f8d7da"}; 
                       color: ${producto.stock > 10 ? "#155724" : producto.stock > 0 ? "#856404" : "#721c24"}; 
                       padding: 2px 8px; border-radius: 12px; font-size: 12px;">
            ${producto.stock}
          </span>
        </td>
        <td>${obtenerNombreCategoria(producto.id_categoria)}</td>
        <td style="text-align: center;">
          <button class="btn-icon btn-editar" onclick="editarProducto(${producto.id_producto})" title="Editar producto">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon btn-eliminar" onclick="eliminarProducto(${producto.id_producto})" title="Eliminar producto">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `

      tbody.appendChild(tr)
    })

    actualizarBotonEliminarMultiples()
  }

  // ← PREVENIR ENVÍOS MÚLTIPLES
  let enviandoFormulario = false

  function guardarProducto(e) {
    e.preventDefault()

    // ← PREVENIR MÚLTIPLES ENVÍOS
    if (enviandoFormulario) {
      console.log("Ya se está enviando el formulario, ignorando...")
      return
    }

    const formData = new FormData(formularioProducto)
    const submitBtn = btnGuardarProducto

    enviandoFormulario = true
    submitBtn.disabled = true
    const textoOriginal = submitBtn.innerHTML
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...'

    // ← VERIFICAR SI ESTAMOS EDITANDO
    let url, method
    if (editandoProducto && productoEditandoId) {
      url = `${API_URL}/productos/${productoEditandoId}`
      method = "PUT"
      console.log("EDITANDO producto ID:", productoEditandoId)
    } else {
      url = `${API_URL}/productos`
      method = "POST"
      console.log("CREANDO nuevo producto")
    }

    console.log("Enviando:", method, url)

    fetch(url, { method, body: formData })
      .then((response) => {
        console.log("Respuesta del servidor:", response.status)
        if (!response.ok) {
          return response.json().then((err) => Promise.reject(err))
        }
        return response.json()
      })
      .then((data) => {
        console.log("Datos recibidos:", data)

        const mensaje = editandoProducto ? "Producto actualizado exitosamente" : "Producto creado exitosamente"

        mostrarMensaje(`✅ ${mensaje}`, "exito")
        ocultarFormularioProducto()

        // ← RECARGAR PRODUCTOS DESPUÉS DE GUARDAR
        setTimeout(() => {
          cargarProductos()
        }, 500)
      })
      .catch((error) => {
        console.error("Error:", error)
        mostrarMensaje(`❌ Error: ${error.error || error.message || "No se pudo guardar"}`, "error")
      })
      .finally(() => {
        enviandoFormulario = false
        submitBtn.disabled = false
        submitBtn.innerHTML = textoOriginal
      })
  }

  // ========== FUNCIONES GLOBALES PARA SELECCIÓN MÚLTIPLE ==========
  window.seleccionarTodos = () => {
    const selectAll = document.getElementById("selectAll")
    const checkboxes = document.querySelectorAll(".producto-checkbox")

    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAll.checked
    })

    actualizarSeleccion()
  }

  window.actualizarSeleccion = () => {
    const checkboxes = document.querySelectorAll(".producto-checkbox:checked")
    productosSeleccionados.clear()

    checkboxes.forEach((checkbox) => {
      productosSeleccionados.add(Number.parseInt(checkbox.value))
    })

    actualizarBotonEliminarMultiples()
  }

  function actualizarBotonEliminarMultiples() {
    let btnEliminar = document.getElementById("btnEliminarSeleccionados")

    if (productosSeleccionados.size === 0) {
      if (btnEliminar) {
        btnEliminar.style.display = "none"
      }
      return
    }

    if (!btnEliminar) {
      btnEliminar = document.createElement("button")
      btnEliminar.id = "btnEliminarSeleccionados"
      btnEliminar.className = "boton-panel"
      btnEliminar.style.backgroundColor = "#dc3545"
      btnEliminar.style.marginTop = "10px"
      btnEliminar.onclick = eliminarProductosSeleccionados

      const filtros = document.getElementById("productos-filtros")
      if (filtros) {
        filtros.parentNode.insertBefore(btnEliminar, filtros.nextSibling)
      }
    }

    btnEliminar.style.display = "block"
    btnEliminar.innerHTML = `<i class="fas fa-trash"></i> Eliminar Seleccionados (${productosSeleccionados.size})`
  }

  window.eliminarProductosSeleccionados = () => {
    if (productosSeleccionados.size === 0) return

    if (confirm(`¿Estás seguro de eliminar ${productosSeleccionados.size} producto(s)?`)) {
      const promesas = Array.from(productosSeleccionados).map((id) =>
        fetch(`${API_URL}/productos/${id}`, {
          method: "DELETE",
          headers: getAuthHeader(),
        }),
      )

      Promise.all(promesas)
        .then(() => {
          mostrarMensaje(`✅ ${productosSeleccionados.size} producto(s) eliminado(s)`, "exito")
          productosSeleccionados.clear()
          document.getElementById("selectAll").checked = false
          cargarProductos()
        })
        .catch(() => {
          mostrarMensaje("❌ Error al eliminar algunos productos", "error")
        })
    }
  }

  // ========== FUNCIONES GLOBALES ==========

  window.mostrarFormularioNuevoProducto = () => {
    resetearFormularioProducto()
    mostrarFormularioProducto()
  }

  window.editarProducto = (id) => {
    console.log("Editando producto ID:", id)

    fetch(`${API_URL}/productos/${id}`)
      .then((response) => response.json())
      .then((producto) => {
        console.log("Producto a editar:", producto)

        editandoProducto = true
        productoEditandoId = id

        // Llenar formulario
        document.getElementById("producto-id").value = producto.id_producto
        document.getElementById("nombre_producto").value = producto.nombre_producto
        document.getElementById("descripcion").value = producto.descripcion_producto
        document.getElementById("precio").value = producto.precio
        document.getElementById("stock").value = producto.stock
        document.getElementById("categoria").value = producto.id_categoria

        // Mostrar imagen actual si existe
        if (producto.imagen_producto) {
          const imagenActualContainer = document.getElementById("imagen-actual-container")
          const imagenActualPreview = document.getElementById("imagen-actual-preview")

          imagenActualContainer.style.display = "block"
          imagenActualPreview.innerHTML = `
            <img src="http://localhost:3001/uploads/${producto.imagen_producto}" 
                 alt="Imagen actual" 
                 style="max-width: 150px; border-radius: 5px; cursor: pointer; border: 2px solid #ddd;"
                 onclick="mostrarImagenGrande('http://localhost:3001/uploads/${producto.imagen_producto}')">
            <p style="font-size: 12px; color: #666; margin-top: 5px;">
              Deja el campo de imagen vacío para mantener la imagen actual
            </p>
          `
        }

        // Hacer imagen opcional en edición
        const imagenInput = document.getElementById("imagen_producto")
        imagenInput.removeAttribute("required")

        // Cambiar textos
        formularioTitulo.textContent = "Editar Producto"
        btnGuardarProducto.innerHTML = '<i class="fas fa-save"></i> Actualizar Producto'

        mostrarFormularioProducto()
        mostrarMensaje("Editando producto. Modifica los campos necesarios.", "info")
      })
      .catch((error) => {
        console.error("Error al cargar producto:", error)
        mostrarMensaje("Error al cargar datos del producto", "error")
      })
  }

  window.eliminarProducto = (id) => {
    if (confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) {
      fetch(`${API_URL}/productos/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error al eliminar")
          return response.json()
        })
        .then(() => {
          mostrarMensaje("✅ Producto eliminado exitosamente", "exito")
          cargarProductos()
        })
        .catch((error) => {
          console.error("Error al eliminar:", error)
          mostrarMensaje("❌ Error al eliminar producto", "error")
        })
    }
  }

  window.mostrarImagenGrande = (src) => {
    const modal = document.createElement("div")
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center;
      z-index: 9999; cursor: pointer;
    `

    const img = document.createElement("img")
    img.src = src
    img.style.cssText = "max-width: 90%; max-height: 90%; border-radius: 10px;"

    modal.appendChild(img)
    modal.onclick = () => document.body.removeChild(modal)
    document.body.appendChild(modal)
  }

  // ========== EXPORTAR A GOOGLE SHEETS MEJORADO ==========
  window.exportarTablaExcel = () => {
    fetch(`${API_URL}/productos`)
      .then((response) => response.json())
      .then((data) => {
        let productos = []
        if (Array.isArray(data)) {
          productos = data
        } else if (data && Array.isArray(data.productos)) {
          productos = data.productos
        } else {
          throw new Error("Error al obtener datos")
        }

        if (productos.length === 0) {
          mostrarMensaje("No hay productos para exportar", "info")
          return
        }

        const datosExcel = productos.map((producto) => {
          const stockStatus = producto.stock > 10 ? "Con Stock" : producto.stock > 0 ? "Poco Stock" : "Sin Stock"
          const stockColor = producto.stock > 10 ? "Verde" : producto.stock > 0 ? "Amarillo" : "Rojo"

          return {
            ID: producto.id_producto,
            Nombre: producto.nombre_producto,
            Descripción: producto.descripcion_producto,
            Precio: Number.parseFloat(producto.precio).toFixed(2),
            Stock: producto.stock,
            "Estado Stock": stockStatus,
            "Color Stock": stockColor,
            Categoría: obtenerNombreCategoria(producto.id_categoria),
            "Tiene Imagen": producto.imagen_producto ? "Sí" : "No",
            "Fecha Creación": producto.fecha_creacion ? new Date(producto.fecha_creacion).toLocaleDateString() : "N/A",
            Activo: producto.activo ? "Sí" : "No",
          }
        })

        const headers = Object.keys(datosExcel[0])
        const csvContent = [
          headers.join(","),
          ...datosExcel.map((row) => headers.map((header) => `"${row[header]}"`).join(",")),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)

        const fechaHoy = new Date().toISOString().split("T")[0]
        const nombreArchivo = `productos_casa_muebla_${fechaHoy}.csv`

        link.setAttribute("href", url)
        link.setAttribute("download", nombreArchivo)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        mostrarMensaje(
          "✅ Archivo descargado. Para abrirlo en Google Sheets: 1) Ve a sheets.google.com 2) Archivo > Importar > Subir > Selecciona el archivo descargado",
          "exito",
        )

        // ← MEJORAR APERTURA DE GOOGLE SHEETS
        setTimeout(() => {
          if (confirm("¿Quieres abrir Google Sheets para importar el archivo?")) {
            // ← USAR LOCATION.HREF EN LUGAR DE WINDOW.OPEN PARA EVITAR POPUP BLOCKER
            const googleSheetsUrl = "https://sheets.google.com/create"
            const newWindow = window.open(googleSheetsUrl, "_blank", "noopener,noreferrer")

            if (!newWindow) {
              // Si el popup fue bloqueado, mostrar instrucciones
              alert("Popup bloqueado. Ve manualmente a: https://sheets.google.com")
            }
          }
        }, 2000)
      })
      .catch((error) => {
        console.error("Error al exportar:", error)
        mostrarMensaje("❌ Error al exportar tabla", "error")
      })
  }

  // ========== FILTROS ==========

  function aplicarFiltros() {
    const busqueda = document.getElementById("buscar-producto").value.toLowerCase()
    const categoria = document.getElementById("filtro-categoria").value
    const stock = document.getElementById("filtro-stock").value

    if (vistaActual === "cards") {
      const cards = document.querySelectorAll(".producto-card")
      cards.forEach((card) => {
        const nombre = card.querySelector(".producto-nombre").textContent.toLowerCase()
        const descripcion = card.querySelector(".producto-descripcion").textContent.toLowerCase()
        const categoriaCard = card.querySelector(".producto-categoria").textContent
        const stockText = card.querySelector(".producto-stock").textContent
        const stockCard = Number.parseInt(stockText.match(/\d+/)[0])

        let mostrar = true

        if (busqueda && !nombre.includes(busqueda) && !descripcion.includes(busqueda)) {
          mostrar = false
        }

        if (categoria && !categoriaCard.includes(obtenerNombreCategoria(Number.parseInt(categoria)))) {
          mostrar = false
        }

        if (stock) {
          switch (stock) {
            case "sin_stock":
              if (stockCard > 0) mostrar = false
              break
            case "poco_stock":
              if (stockCard > 10) mostrar = false
              break
            case "con_stock":
              if (stockCard <= 10) mostrar = false
              break
          }
        }

        card.style.display = mostrar ? "block" : "none"
      })
    } else {
      const filas = document.querySelectorAll("#lista-productos tbody tr")
      filas.forEach((fila) => {
        if (fila.cells.length < 9) return

        const nombre = fila.cells[3].textContent.toLowerCase()
        const descripcion = fila.cells[4].textContent.toLowerCase()
        const categoriaFila = fila.cells[7].textContent
        const stockFila = Number.parseInt(fila.cells[6].textContent.trim())

        let mostrar = true

        if (busqueda && !nombre.includes(busqueda) && !descripcion.includes(busqueda)) {
          mostrar = false
        }

        if (categoria && !categoriaFila.includes(obtenerNombreCategoria(Number.parseInt(categoria)))) {
          mostrar = false
        }

        if (stock) {
          switch (stock) {
            case "sin_stock":
              if (stockFila > 0) mostrar = false
              break
            case "poco_stock":
              if (stockFila > 10) mostrar = false
              break
            case "con_stock":
              if (stockFila <= 10) mostrar = false
              break
          }
        }

        fila.style.display = mostrar ? "" : "none"
      })
    }
  }

  function limpiarFiltros() {
    document.getElementById("buscar-producto").value = ""
    document.getElementById("filtro-categoria").value = ""
    document.getElementById("filtro-stock").value = ""
    aplicarFiltros()
  }

  // ========== VISTA PREVIA DE IMAGEN ==========

  function configurarVistaPrevia() {
    const imagenInput = document.getElementById("imagen_producto")
    const imagenPreview = document.getElementById("imagen-preview")

    if (imagenInput && imagenPreview) {
      imagenInput.addEventListener("change", function () {
        imagenPreview.innerHTML = ""

        const file = this.files[0]
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            alert("La imagen supera los 5MB. Por favor, elige una más liviana.")
            this.value = ""
            return
          }

          const img = document.createElement("img")
          img.src = URL.createObjectURL(file)
          img.style.maxWidth = "150px"
          img.style.borderRadius = "5px"
          img.style.border = "2px solid #ddd"
          img.onload = () => URL.revokeObjectURL(img.src)
          imagenPreview.appendChild(img)
        }
      })
    }
  }

  // ========== CARGAR OTROS DATOS ==========

  function cargarUsuarios() {
    fetch(`${API_URL}/usuarios`, { headers: getAuthHeader() })
      .then((r) => {
        if (!r.ok) throw new Error("Error al cargar usuarios")
        return r.json()
      })
      .then((usuarios) => {
        if (Array.isArray(usuarios)) {
          const contador = document.querySelector(".dashboard-card:nth-child(1) .count")
          if (contador) contador.textContent = usuarios.length
        }
      })
      .catch((error) => {
        console.error("Error cargando usuarios:", error)
        const contador = document.querySelector(".dashboard-card:nth-child(1) .count")
        if (contador) contador.textContent = "Error"
      })
  }

  function cargarClientes() {
    fetch(`${API_URL}/clientes`)
      .then((r) => {
        if (!r.ok) throw new Error("Error al cargar clientes")
        return r.json()
      })
      .then((clientes) => {
        if (Array.isArray(clientes)) {
          const contador = document.querySelector(".dashboard-card:nth-child(4) .count")
          if (contador) contador.textContent = clientes.length
        }
      })
      .catch((error) => {
        console.error("Error cargando clientes:", error)
        const contador = document.querySelector(".dashboard-card:nth-child(4) .count")
        if (contador) contador.textContent = "Error"
      })
  }

  function cargarPedidos() {
    fetch(`${API_URL}/pedidos`)
      .then((r) => {
        if (!r.ok) throw new Error("Error al cargar pedidos")
        return r.json()
      })
      .then((pedidos) => {
        if (Array.isArray(pedidos)) {
          const contador = document.querySelector(".dashboard-card:nth-child(3) .count")
          if (contador) contador.textContent = pedidos.length
        }
      })
      .catch((error) => {
        console.error("Error cargando pedidos:", error)
        const contador = document.querySelector(".dashboard-card:nth-child(3) .count")
        if (contador) contador.textContent = "Error"
      })
  }

  function cargarProveedores() {
    fetch(`${API_URL}/proveedores`)
      .then((r) => {
        if (!r.ok) throw new Error("Error al cargar proveedores")
        return r.json()
      })
      .then((proveedores) => {
        if (Array.isArray(proveedores)) {
          const contador = document.querySelector(".dashboard-card:nth-child(5) .count")
          if (contador) contador.textContent = proveedores.length
        }
      })
      .catch((error) => {
        console.error("Error cargando proveedores:", error)
        const contador = document.querySelector(".dashboard-card:nth-child(5) .count")
        if (contador) contador.textContent = "Error"
      })
  }

  // ========== INICIALIZACIÓN ==========

  function inicializarPanel() {
    // Logout
    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        localStorage.removeItem("token")
        localStorage.removeItem("usuario")
        localStorage.removeItem("seccionActiva")
        localStorage.removeItem("vistaProductos")
        window.location.href = "mi-cuenta.html"
      })
    }

    // Navegación
    panelNavButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        cambiarSeccion(btn.dataset.section)
      })
    })

    // Cards clickeables para navegar
    document.querySelectorAll(".dashboard-card").forEach((card, index) => {
      card.style.cursor = "pointer"
      card.addEventListener("click", () => {
        const secciones = ["usuarios", "productos", "pedidos", "clientes", "proveedores"]
        if (secciones[index]) {
          cambiarSeccion(secciones[index])
        }
      })
    })

    // Eventos de productos
    if (btnToggleVista) {
      btnToggleVista.addEventListener("click", toggleVista)
    }

    if (btnNuevoProducto) {
      btnNuevoProducto.addEventListener("click", mostrarFormularioNuevoProducto)
    }

    if (btnCancelarProducto) {
      btnCancelarProducto.addEventListener("click", ocultarFormularioProducto)
    }

    if (formularioProducto) {
      formularioProducto.addEventListener("submit", guardarProducto)
    }

    // Filtros
    const buscarInput = document.getElementById("buscar-producto")
    const filtroCategoria = document.getElementById("filtro-categoria")
    const filtroStock = document.getElementById("filtro-stock")
    const btnLimpiarFiltros = document.getElementById("btn-limpiar-filtros")

    if (buscarInput) buscarInput.addEventListener("input", aplicarFiltros)
    if (filtroCategoria) filtroCategoria.addEventListener("change", aplicarFiltros)
    if (filtroStock) filtroStock.addEventListener("change", aplicarFiltros)
    if (btnLimpiarFiltros) btnLimpiarFiltros.addEventListener("click", limpiarFiltros)

    // Vista previa de imagen
    configurarVistaPrevia()

    // Cargar datos
    cargarProductos()
    cargarUsuarios()
    cargarClientes()
    cargarPedidos()
    cargarProveedores()

    // Restaurar sección y vista al final
    restaurarSeccionActiva()
  }

  // Inicializar todo
  inicializarPanel()
})
