//Este archivo se encargará de manejar la subida de imágenes con multer y facilitará la gestión de las fotos de perfil.
const multer = require("multer")
const path = require("path")
const fs = require("fs")

console.log("=== CARGANDO UPLOAD MIDDLEWARE ===")
console.log("Multer importado:", typeof multer)

const uploadDir = path.join(__dirname, "../public/uploads")

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
  console.log("Carpeta uploads creada:", uploadDir)
}

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir) // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

// Filtrar archivos permitidos (solo imágenes)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Formato de archivo no permitido. Solo se aceptan imágenes."), false)
  }
}

// Configuración final del middleware de subida
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo de archivo: 5 MB
  fileFilter: fileFilter,
})

console.log("Upload creado:", typeof upload)
console.log("Upload.single existe:", typeof upload.single)

// EXPORTAR EL OBJETO MULTER COMPLETO
module.exports = upload
