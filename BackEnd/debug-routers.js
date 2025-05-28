// Script para debuggear routers específicamente
console.log("=== INICIANDO DEBUG DE ROUTERS ===\n")

const path = require("path")

// Lista de todos los routers
const routers = [
  "auth.router.js",
  "productos.router.js",
  "categorias.router.js",
  "clientes.router.js",
  "pedidos.router.js",
  "detalles_pedidos.router.js",
  "proveedores.router.js",
  "materiales.router.js",
  "materiales_producto.router.js",
  "usuarios.router.js",
  "cotizaciones.router.js",
  "comentarios_producto.router.js",
  "compras_proveedor.router.js",
  "detalles_compra.router.js",
  "configuracion.router.js",
  "contactos.router.js",
  "imagenes_producto.router.js",
  "newsletter.router.js",
  "pagos.router.js",
]

let routersOk = 0
let routersError = 0

for (const routerFile of routers) {
  try {
    console.log(`--- Cargando ${routerFile.replace(".router.js", "")} ---`)

    const routerPath = path.join(__dirname, "routers", routerFile)

    // Limpiar cache para forzar recarga
    delete require.cache[require.resolve(routerPath)]

    const router = require(routerPath)

    console.log(`Tipo: ${typeof router}`)
    console.log(`Es función: ${typeof router === "function"}`)

    if (typeof router === "function") {
      console.log(`✅ ${routerFile}: Router válido`)
      routersOk++
    } else {
      console.log(`❌ ${routerFile}: No es función, es ${typeof router}`)
      console.log(`Contenido:`, router)
      routersError++
    }
  } catch (error) {
    console.log(`❌ ${routerFile}: Error al cargar`)
    console.log(`   Error: ${error.message}`)
    routersError++
  }

  console.log("") // Línea en blanco
}

console.log("=== RESUMEN ===")
console.log(`✅ Routers cargados correctamente: ${routersOk}`)
console.log(`❌ Routers con errores: ${routersError}`)
console.log(`📊 Total: ${routersOk + routersError}`)

if (routersError === 0) {
  console.log("\n🎉 ¡Todos los routers se cargan correctamente!")
} else {
  console.log(`\n⚠️  Hay ${routersError} router(s) con problemas que necesitan corrección.`)
}
