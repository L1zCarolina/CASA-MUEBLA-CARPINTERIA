
const db = require("../db/db");

//// METODO GET  /////
// Obtener imágenes de un producto
const allImages = (req, res) => {
    const { id_producto } = req.params;
    const sql = "SELECT * FROM imagenes_producto WHERE id_producto = ?";
    db.query(sql, [id_producto], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" });
        }
        res.json(rows);
    });
};

//// METODO POST  /////
// Subir nueva imagen (usa multer upload.array('imagenes'))
const storeImages = (req, res) => {
    const { id_producto } = req.body;
    const files = req.files; // multer array
    const sql = "INSERT INTO imagenes_producto (id_producto, url_imagen, es_principal) VALUES ?";
    const values = files.map((file, idx) => [id_producto, file.filename, idx === 0 ? 1 : 0]);
    db.query(sql, [values], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudieron subir las imágenes" });
        }
        res.status(201).json({ inserted: result.affectedRows });
    });
};

//// METODO DELETE /////
// Eliminar una imagen
const destroyImage = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM imagenes_producto WHERE id_imagen = ?";
    db.query(sql, [id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo eliminar la imagen" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: Imagen no encontrada" });
        }
        res.json({ mensaje: "Imagen Eliminada" });
    });
};

module.exports = {
    allImages,
    storeImages,
    destroyImage
};
