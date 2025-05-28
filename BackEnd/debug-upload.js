// Archivo temporal para debuggear el problema
console.log("=== DEBUGGING UPLOAD MIDDLEWARE ===")

try {
  const upload = require("./middlewares/upload.middleware")
  console.log("Upload importado:", typeof upload)
  console.log("Upload.single existe:", typeof upload.single)
  console.log("Upload completo:", upload)

  if (upload && typeof upload.single === "function") {
    console.log("✅ Upload funciona correctamente")
  } else {
    console.log("❌ Upload no tiene método .single")
  }
} catch (error) {
  console.error("❌ Error al importar upload:", error.message)
}

// Probar importar multer directamente
try {
  const multer = require("multer")
  console.log("Multer importado:", typeof multer)
  console.log("Multer.single existe:", typeof multer.single)
} catch (error) {
  console.error("❌ Error al importar multer:", error.message)
}
