// Primero, se importa todas las dependencias
require("dotenv").config() // Carga variables de entorno desde un archivo .env
// Importar dependencias
const express = require("express")
const cors = require("cors") //ayuda a manejar problemas de seguridad relacionados con solicitudes de diferentes dominios.
const morgan = require("morgan") //proporciona información valiosa sobre las solicitudes que llegan a tu API, lo que es crucial para el desarrollo y la depuración.
const path = require("path")
const errorMiddleware = require("./middlewares/error.middleware") // Importar middleware de error (si existe)

// Despues, Se Inicializa La Aplicación Express
const app = express()

// Ahora se Configura CORS y otros middelewares
app.use(
  cors({
    origin: "*", // En desarrollo, se puede permitir todas las origenes
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
)

// Configuración de middlewares
app.use(morgan("dev")) // Registra las solicitudes HTTP para debugging
app.use(express.json()) // Parsea solicitudes con payloads JSON
app.use(express.urlencoded({ extended: false })) // Parsea solicitudes con payloads codificados en URL

// Rutas estáticos
app.use(express.static(path.join(__dirname, "public")))
app.use("/uploads", express.static("uploads"))

// Importar rutas
const authRouter = require("./routers/auth.router")
const productosRouter = require("./routers/productos.router")
const categoriasRouter = require("./routers/categorias.router")
const clientesRouter = require("./routers/clientes.router")
const pedidosRouter = require("./routers/pedidos.router")
const detallesPedidosRouter = require("./routers/detalles_pedidos.router")
const proveedoresRouter = require("./routers/proveedores.router")
const materialesRouter = require("./routers/materiales.router")
const materialesProductoRouter = require("./routers/materiales_producto.router")
const usuariosRouter = require("./routers/usuarios.router")
const cotizacionesRouter = require("./routers/cotizaciones.router")
const comentariosRouter = require("./routers/comentarios_producto.router")
const comprasProveedorRouter = require("./routers/compras_proveedor.router")
const detallesCompraRouter = require("./routers/detalles_compra.router")
const configuracionRouter = require("./routers/configuracion.router")
const contactosRouter = require("./routers/contactos.router")
const imagenesProductoRouter = require("./routers/imagenes_producto.router")
const newsletterRouter = require("./routers/newsletter.router")
const pagosRouter = require("./routers/pagos.router")

// Comentar temporalmente todas las rutas para identificar el problema
// Reemplazar la sección de "Configurar rutas API" con esto:

console.log("=== VERIFICANDO ROUTERS ===")

// Verificar cada router antes de usarlo
try {
  console.log("Verificando authRouter:", typeof authRouter)
  if (typeof authRouter === "function") {
    app.use("/api/auth", authRouter)
    console.log("✅ authRouter cargado")
  } else {
    console.log("❌ authRouter no es función:", authRouter)
  }
} catch (error) {
  console.log("❌ Error con authRouter:", error.message)
}

try {
  console.log("Verificando productosRouter:", typeof productosRouter)
  if (typeof productosRouter === "function") {
    app.use("/api/productos", productosRouter)
    console.log("✅ productosRouter cargado")
  } else {
    console.log("❌ productosRouter no es función:", productosRouter)
  }
} catch (error) {
  console.log("❌ Error con productosRouter:", error.message)
}

try {
  console.log("Verificando categoriasRouter:", typeof categoriasRouter)
  if (typeof categoriasRouter === "function") {
    app.use("/api/categorias", categoriasRouter)
    console.log("✅ categoriasRouter cargado")
  } else {
    console.log("❌ categoriasRouter no es función:", categoriasRouter)
  }
} catch (error) {
  console.log("❌ Error con categoriasRouter:", error.message)
}

try {
  console.log("Verificando clientesRouter:", typeof clientesRouter)
  if (typeof clientesRouter === "function") {
    app.use("/api/clientes", clientesRouter)
    console.log("✅ clientesRouter cargado")
  } else {
    console.log("❌ clientesRouter no es función:", clientesRouter)
  }
} catch (error) {
  console.log("❌ Error con clientesRouter:", error.message)
}

try {
  console.log("Verificando pedidosRouter:", typeof pedidosRouter)
  if (typeof pedidosRouter === "function") {
    app.use("/api/pedidos", pedidosRouter)
    console.log("✅ pedidosRouter cargado")
  } else {
    console.log("❌ pedidosRouter no es función:", pedidosRouter)
  }
} catch (error) {
  console.log("❌ Error con pedidosRouter:", error.message)
}

try {
  console.log("Verificando detallesPedidosRouter:", typeof detallesPedidosRouter)
  if (typeof detallesPedidosRouter === "function") {
    app.use("/api/detalles-pedidos", detallesPedidosRouter)
    console.log("✅ detallesPedidosRouter cargado")
  } else {
    console.log("❌ detallesPedidosRouter no es función:", detallesPedidosRouter)
  }
} catch (error) {
  console.log("❌ Error con detallesPedidosRouter:", error.message)
}

try {
  console.log("Verificando proveedoresRouter:", typeof proveedoresRouter)
  if (typeof proveedoresRouter === "function") {
    app.use("/api/proveedores", proveedoresRouter)
    console.log("✅ proveedoresRouter cargado")
  } else {
    console.log("❌ proveedoresRouter no es función:", proveedoresRouter)
  }
} catch (error) {
  console.log("❌ Error con proveedoresRouter:", error.message)
}

try {
  console.log("Verificando materialesRouter:", typeof materialesRouter)
  if (typeof materialesRouter === "function") {
    app.use("/api/materiales", materialesRouter)
    console.log("✅ materialesRouter cargado")
  } else {
    console.log("❌ materialesRouter no es función:", materialesRouter)
  }
} catch (error) {
  console.log("❌ Error con materialesRouter:", error.message)
}

try {
  console.log("Verificando materialesProductoRouter:", typeof materialesProductoRouter)
  if (typeof materialesProductoRouter === "function") {
    app.use("/api/materiales_producto", materialesProductoRouter)
    console.log("✅ materialesProductoRouter cargado")
  } else {
    console.log("❌ materialesProductoRouter no es función:", materialesProductoRouter)
  }
} catch (error) {
  console.log("❌ Error con materialesProductoRouter:", error.message)
}

try {
  console.log("Verificando usuariosRouter:", typeof usuariosRouter)
  if (typeof usuariosRouter === "function") {
    app.use("/api/usuarios", usuariosRouter)
    console.log("✅ usuariosRouter cargado")
  } else {
    console.log("❌ usuariosRouter no es función:", usuariosRouter)
  }
} catch (error) {
  console.log("❌ Error con usuariosRouter:", error.message)
}

try {
  console.log("Verificando cotizacionesRouter:", typeof cotizacionesRouter)
  if (typeof cotizacionesRouter === "function") {
    app.use("/api/cotizaciones", cotizacionesRouter)
    console.log("✅ cotizacionesRouter cargado")
  } else {
    console.log("❌ cotizacionesRouter no es función:", cotizacionesRouter)
  }
} catch (error) {
  console.log("❌ Error con cotizacionesRouter:", error.message)
}

try {
  console.log("Verificando comentariosRouter:", typeof comentariosRouter)
  if (typeof comentariosRouter === "function") {
    app.use("/api/comentarios_producto", comentariosRouter)
    console.log("✅ comentariosRouter cargado")
  } else {
    console.log("❌ comentariosRouter no es función:", comentariosRouter)
  }
} catch (error) {
  console.log("❌ Error con comentariosRouter:", error.message)
}

try {
  console.log("Verificando comprasProveedorRouter:", typeof comprasProveedorRouter)
  if (typeof comprasProveedorRouter === "function") {
    app.use("/api/compras_proveedor", comprasProveedorRouter)
    console.log("✅ comprasProveedorRouter cargado")
  } else {
    console.log("❌ comprasProveedorRouter no es función:", comprasProveedorRouter)
  }
} catch (error) {
  console.log("❌ Error con comprasProveedorRouter:", error.message)
}

try {
  console.log("Verificando detallesCompraRouter:", typeof detallesCompraRouter)
  if (typeof detallesCompraRouter === "function") {
    app.use("/api/detalles_compra", detallesCompraRouter)
    console.log("✅ detallesCompraRouter cargado")
  } else {
    console.log("❌ detallesCompraRouter no es función:", detallesCompraRouter)
  }
} catch (error) {
  console.log("❌ Error con detallesCompraRouter:", error.message)
}

try {
  console.log("Verificando configuracionRouter:", typeof configuracionRouter)
  if (typeof configuracionRouter === "function") {
    app.use("/api/configuracion", configuracionRouter)
    console.log("✅ configuracionRouter cargado")
  } else {
    console.log("❌ configuracionRouter no es función:", configuracionRouter)
  }
} catch (error) {
  console.log("❌ Error con configuracionRouter:", error.message)
}

try {
  console.log("Verificando contactosRouter:", typeof contactosRouter)
  if (typeof contactosRouter === "function") {
    app.use("/api/contactos", contactosRouter)
    console.log("✅ contactosRouter cargado")
  } else {
    console.log("❌ contactosRouter no es función:", contactosRouter)
  }
} catch (error) {
  console.log("❌ Error con contactosRouter:", error.message)
}

try {
  console.log("Verificando imagenesProductoRouter:", typeof imagenesProductoRouter)
  if (typeof imagenesProductoRouter === "function") {
    app.use("/api/imagenes_producto", imagenesProductoRouter)
    console.log("✅ imagenesProductoRouter cargado")
  } else {
    console.log("❌ imagenesProductoRouter no es función:", imagenesProductoRouter)
  }
} catch (error) {
  console.log("❌ Error con imagenesProductoRouter:", error.message)
}

try {
  console.log("Verificando newsletterRouter:", typeof newsletterRouter)
  if (typeof newsletterRouter === "function") {
    app.use("/api/newsletter", newsletterRouter)
    console.log("✅ newsletterRouter cargado")
  } else {
    console.log("❌ newsletterRouter no es función:", newsletterRouter)
  }
} catch (error) {
  console.log("❌ Error con newsletterRouter:", error.message)
}

try {
  console.log("Verificando pagosRouter:", typeof pagosRouter)
  if (typeof pagosRouter === "function") {
    app.use("/api/pagos", pagosRouter)
    console.log("✅ pagosRouter cargado")
  } else {
    console.log("❌ pagosRouter no es función:", pagosRouter)
  }
} catch (error) {
  console.log("❌ Error con pagosRouter:", error.message)
}

console.log("=== FIN VERIFICACIÓN ROUTERS ===")

// Ruta para servir el frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"))
})

// Middleware de manejo de errores (que debe estar después de todas las rutas)
app.use(errorMiddleware)

// Iniciar servidor
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
  console.log(`Ambiente: ${process.env.NODE_ENV || "desarrollo"}`)
})

// Manejo de errores no capturados
process.on("uncaughtException", (error) => {
  console.error("Error no capturado:", error)
})
