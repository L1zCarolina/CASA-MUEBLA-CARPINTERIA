// script.js
//const API_URL = 'http://localhost:3001/api';
// Se ambia la definición de API_URL para que sea dinámica según el entorno
const API_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3001/api"
    : "/api"

//
const body = document.querySelector("body"),
  nav = document.querySelector("nav"),
  modeToggle = document.querySelector(".dark-light"),
  searchToggle = document.querySelector(".searchToggle"),
  siderbarOpen = document.querySelector(".siderbarOpen"),
  siderbarClose = document.querySelector(".siderbarClose")

const getMode = localStorage.getItem("mode")
if (getMode && getMode === "dark-mode") {
  body.classList.add("dark")
}

//Código JS para alternar entre el modo OSCURO y CLARO
modeToggle.addEventListener("click", () => {
  modeToggle.classList.toggle("active")
  body.classList.toggle("dark")

  if (!body.classList.contains("dark")) {
    localStorage.setItem("mode", "light-mode")
  } else {
    localStorage.setItem("mode", "dark-mode")
  }
})

//Código JS para alternar entre el cuadro de BUSQUEDA
searchToggle.addEventListener("click", () => {
  searchToggle.classList.toggle("active")
})

//Código JS para alternar la barra lateral
siderbarOpen.addEventListener("click", () => {
  nav.classList.add("active")
})

body.addEventListener("click", (e) => {
  const clickedElm = e.target

  if (!clickedElm.classList.contains("siderbarOpen") && !clickedElm.classList.contains("menu")) {
    nav.classList.remove("active")
  }
})

// Función para manejar errores de fetch de manera consistente
function handleFetchError(error, customMessage = "Ha ocurrido un error en la comunicación con el servidor") {
  console.error("Error en fetch:", error)
  return {
    error: true,
    message: customMessage,
    details: error.message,
  }
}

// Función mejorada para realizar peticiones fetch
async function fetchAPI(endpoint, options = {}) {
  try {
    const token = localStorage.getItem("token")

    // Configurar headers por defecto
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    }

    // Si es una petición con FormData, no establecer Content-Type
    if (options.body instanceof FormData) {
      delete headers["Content-Type"]
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers,
    })

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    return handleFetchError(error)
  }
}

// Función para verificar si el token ha expirado
function isTokenExpired(token) {
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.exp * 1000 < Date.now()
  } catch (e) {
    return true
  }
}


// Agregar esta función para cerrar sesión de forma global
function cerrarSesion() {
  console.log("Cerrando sesión...")

  // Limpiar localStorage
  localStorage.removeItem("token")
  localStorage.removeItem("usuario")

  // Redirigir a la página de inicio con un parámetro para indicar logout
  window.location.href = "mi-cuenta.html?logout=true"
}

// Agregar esta función para verificar la autenticación en cualquier página
function estaAutenticado() {
  const token = localStorage.getItem("token")
  if (!token || isTokenExpired(token)) {
    // Si no hay token o está expirado, limpiar localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    return false
  }

  return true
}

function mostrarSubseccion(subseccionId) {
  const seccion = document.getElementById(subseccionId)
  if (seccion) {
    document.querySelectorAll(".subseccion").forEach((sub) => (sub.style.display = "none"))
    seccion.style.display = "block"
    cargarDatos(subseccionId)
  } else {
    console.warn(`Subsección '${subseccionId}' no encontrada.`)
  }
}

function cargarDatos(seccionId) {
  fetch(`${API_URL}/${seccionId}`)
    .then((response) => response.json())
    .then((data) => {
      const elementoLista = document.getElementById(`lista-${seccionId}`)
      elementoLista.innerHTML = ""
      data.forEach((item) => {
        const elementoItem = document.createElement("p")
        elementoItem.textContent = JSON.stringify(item)
        elementoLista.appendChild(elementoItem)
      })
    })
    .catch((error) => console.error("Error:", error))
}

document.addEventListener("DOMContentLoaded", () => {
  const formularioUsuario = document.getElementById("formulario-usuario")
  if (formularioUsuario) {
    formularioUsuario.addEventListener("submit", (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      if (!formData.get("nombre") || !formData.get("email")) {
        alert("Todos los campos son obligatorios")
        return
      }
      fetch(`${API_URL}/usuarios`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Éxito:", data)
          cargarDatos("usuarios")
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    })
  }

  const formularioProducto = document.getElementById("formulario-producto")
  if (formularioProducto) {
    formularioProducto.addEventListener("submit", (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      fetch(`${API_URL}/productos`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Éxito:", data)
          cargarDatos("productos")
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    })
  }

  const formularioPedido = document.getElementById("formulario-pedido")
  if (formularioPedido) {
    formularioPedido.addEventListener("submit", (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      fetch(`${API_URL}/pedidos`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Éxito:", data)
          cargarDatos("pedidos")
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    })
  }

  const formularioCliente = document.getElementById("formulario-cliente")
  if (formularioCliente) {
    formularioCliente.addEventListener("submit", (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      fetch(`${API_URL}/clientes`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Éxito:", data)
          cargarDatos("clientes")
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    })
  }

  const formularioProveedor = document.getElementById("formulario-proveedor")
  if (formularioProveedor) {
    formularioProveedor.addEventListener("submit", (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      fetch(`${API_URL}/proveedores`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Éxito:", data)
          cargarDatos("proveedores")
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    })
  }

  const formularioContacto = document.getElementById("formulario-contacto")
  if (formularioContacto) {
    formularioContacto.addEventListener("submit", function (e) {
      e.preventDefault()
      // Aquí puedes agregar la lógica para manejar el envío del formulario de contacto
      alert("Mensaje enviado. Gracias por contactarnos!")
      this.reset()
    })
  }

  // Si estamos en la página de Mi Cuenta, mostrar la subsección de usuarios por defecto
  if (window.location.pathname.includes("mi-cuenta.html")) {
    mostrarSubseccion("usuarios")
  }

  // Buscar todos los enlaces que requieren autenticación
  const authLinks = document.querySelectorAll("[data-require-auth]")

  authLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (!verificarAutenticacion()) {
        e.preventDefault()
        alert("Debes iniciar sesión para acceder a esta página")
        window.location.href = "mi-cuenta.html"
      }
    })
  })

  // Configurar botones de cerrar sesión
  const logoutButtons = document.querySelectorAll(".btn-cerrar-sesion, [data-action='logout']")

  logoutButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      cerrarSesion()
    })
  })
})

// Código para inicializar el slider Splide
document.addEventListener("DOMContentLoaded", () => {
  let splide // Declare splide here
  var splideElement = document.querySelector(".splide")
  
  //Esto asegura que el código solo se ejecute si el elemento `.splide` existe en la página, evitando errores en páginas donde no esté presente el slider.
  if (splideElement) {
    splide = new Splide(".splide", {
      type: "loop" /*Pasa las imagenes infinitamente repitiendolo*/,
      autoplay: false /*False: Para que no se reproduzca automaticamente las imagenes si no se ve... Inicialmente desactivado*/,
      interval: 5000,
      /*Velocidad en la que se mueve cada img. NOTA: El valor debe ser un número, no una cadena*/ 
      pauseOnHover: false,
      pauseOnFocus: false,
      rewind: true,
      speed: 1000,
      arrows: true,
      pagination: true,
      breakpoints: {
        640: {
          arrows: false,
        },
      },
    })

    splide.mount()

    // Configurar el Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            splide.Components.Autoplay.play()
            console.log("Slider visible, reproducción iniciada")
          } else {
            splide.Components.Autoplay.pause()
            console.log("Slider no visible, reproducción pausada")
          }
        })
      },
      {
        threshold: 0.5, // El slider se considera visible cuando al menos el 50% está en la pantalla
      },
    )

    // Observar el elemento del slider
    observer.observe(splideElement)

    splide.on("mounted", () => {
      console.log("Splide montado correctamente")
      // Iniciar la reproducción automática si el slider es visible al cargar la página
      if (isElementInViewport(splideElement)) {
        splide.Components.Autoplay.play() //Si el autoplay no funcionar, se intenta forzarlo manualmente después de la inicialización para que funcione
      }
    })

    //Para depurar, se le añade más registros de consola
    splide.on("autoplay:playing", (rate) => {
      console.log("Autoplay en progreso, tasa:", rate)
    })
  }
})

// Función auxiliar para verificar si un elemento está en el viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
// window.splide.on('moved', function(newIndex) {
//     console.log('Slide cambiado a:', newIndex);
// });

// Animación de números en la sección de estadísticas
function animateNumber(el, target) {
  let current = 0
  const increment = target > 100 ? 10 : 1
  const timer = setInterval(() => {
    current += increment
    el.textContent = current
    if (current >= target) {
      clearInterval(timer)
      el.textContent = target
    }
  }, 20)
}

function checkVisibility() {
  const statistics = document.querySelectorAll(".estadistica .numero")
  statistics.forEach((stat) => {
    const rect = stat.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    if (rect.top <= windowHeight && rect.bottom >= 0 && !stat.classList.contains("animated")) {
      animateNumber(stat, Number.parseInt(stat.getAttribute("data-valor")))
      stat.classList.add("animated")
    }
  })
}

window.addEventListener("scroll", checkVisibility)
window.addEventListener("load", checkVisibility)
