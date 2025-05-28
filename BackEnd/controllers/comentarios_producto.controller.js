
const db = require("../db/db");

//// METODO GET  /////
// Todos los comentarios de producto (solo los aprobados)
const allComments = (req, res) => {
    const sql = "SELECT * FROM comentarios_producto WHERE aprobado = 1";
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" });
        }
        res.json(rows);
    });
};

//// METODO GET UNO ////
// Comentario específico
const showComment = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM comentarios_producto WHERE id_comentario = ?";
    db.query(sql, [id], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: "ERROR: Comentario no encontrado" });
        }
        res.json(rows[0]);
    });
};

//// METODO POST  /////
// Crea un comentario (queda pendiente de aprobación)
const storeComment = (req, res) => {
    const { id_producto, id_cliente, calificacion, comentario } = req.body;
    const sql = `
      INSERT INTO comentarios_producto
        (id_producto, id_cliente, calificacion, comentario, aprobado)
      VALUES (?,?,?,?, 0)
    `;
    db.query(sql, [id_producto, id_cliente, calificacion, comentario || null], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo enviar el comentario" });
        }
        res.status(201).json({
          id_comentario: result.insertId,
          id_producto, id_cliente, calificacion, comentario, aprobado: 0
        });
    });
};

//// METODO PUT  /////
// Aprobar un comentario (solo admin)
const approveComment = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE comentarios_producto SET aprobado = 1 WHERE id_comentario = ?";
    db.query(sql, [id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo aprobar el comentario" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: Comentario no encontrado" });
        }
        res.json({ id_comentario: id, aprobado: 1 });
    });
};

//// METODO DELETE ////
// Eliminar un comentario
const destroyComment = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM comentarios_producto WHERE id_comentario = ?";
    db.query(sql, [id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo eliminar el comentario" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: Comentario no encontrado" });
        }
        res.json({ mensaje: "Comentario Eliminado" });
    });
};

module.exports = {
    allComments,
    showComment,
    storeComment,
    approveComment,
    destroyComment
};
