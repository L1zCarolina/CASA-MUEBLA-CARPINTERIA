// debug-controllers.js - Script para verificar que todos los controladores se cargan correctamente

console.log("=== INICIANDO DEBUG DE CONTROLADORES ===")

const controllers = [
  { name: "auth", path: "./controllers/auth.controller.js" },
  { name: "categorias", path: "./controllers/categorias.controller.js" },
  { name: "clientes", path: "./controllers/clientes.controller.js" },
  { name: "comentarios_producto", path: "./controllers/comentarios_producto.controller.js" },
  { name: "compras_proveedor", path: "./controllers/compras_proveedor.controller.js" },
  { name: "configuracion", path: "./controllers/configuracion.controller.js" },
  { name: "contactos", path: "./controllers/contactos.controller.js" },
  { name: "cotizaciones", path: "./controllers/cotizaciones.controller.js" },
  { name: "detalles_compra", path: "./controllers/detalles_compra.controller.js" },
  { name: "detalles_pedidos", path: "./controllers/detalles_pedidos.controller.js" },
  { name: "imagenes_producto", path: "./controllers/imagenes_producto.controller.js" },
  { name: "materiales", path: "./controllers/materiales.controller.js" },
  { name: "materiales_producto", path: "./controllers/materiales_producto.controller.js" },
  { name: "newsletter", path: "./controllers/newsletter.controller.js" },
  { name: "pagos", path: "./controllers/pagos.controller.js" },
  { name: "pedidos", path: "./controllers/pedidos.controller.js" },
  { name: "productos", path: "./controllers/productos.controller.js" },
  { name: "proveedores", path: "./controllers/proveedores.controller.js" },
  { name: "tareas", path: "./controllers/tareas.controller.js" },
  { name: "usuarios", path: "./controllers/usuarios.controller.js" },
]

let erroresEncontrados = 0
let controladoresCargados = 0

controllers.forEach((controller) => {
  try {
    console.log(`\n--- Cargando ${controller.name} ---`)
    const controllerModule = require(controller.path)

    if (controllerModule && typeof controllerModule === "object") {
      const funciones = Object.keys(controllerModule)
      console.log(`✅ ${controller.name}: ${funciones.length} funciones exportadas`)
      console.log(`   Funciones: ${funciones.join(", ")}`)
      controladoresCargados++
    } else {
      console.log(`❌ ${controller.name}: No exporta un objeto válido`)
      erroresEncontrados++
    }
  } catch (error) {
    console.log(`❌ ${controller.name}: ERROR AL CARGAR`)
    console.log(`   Error: ${error.message}`)
    if (error.stack) {
      console.log(`   Stack: ${error.stack.split("\n")[1]}`)
    }
    erroresEncontrados++
  }
})

console.log("\n=== RESUMEN ===")
console.log(`✅ Controladores cargados correctamente: ${controladoresCargados}`)
console.log(`❌ Controladores con errores: ${erroresEncontrados}`)
console.log(`📊 Total: ${controllers.length}`)

if (erroresEncontrados === 0) {
  console.log("\n🎉 ¡Todos los controladores se cargan correctamente!")
} else {
  console.log("\n⚠️  Hay errores que necesitan ser corregidos.")
  process.exit(1)
}
