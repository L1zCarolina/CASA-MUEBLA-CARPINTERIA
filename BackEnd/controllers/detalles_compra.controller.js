const db = require("../db/db");

//// METODO GET  /////
// Todos los detalles de compra
const allDetails = (req, res) => {
    const sql = "SELECT * FROM detalles_compra";
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" });
        }
        res.json(rows);
    });
};

//// METODO GET UNO ////
// Detalle específico
const showDetail = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM detalles_compra WHERE id_detalle_compra = ?";
    db.query(sql, [id], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: "ERROR: Detalle no encontrado" });
        }
        res.json(rows[0]);
    });
};

//// METODO POST  /////
// Crear detalle
const storeDetail = (req, res) => {
    const { id_compra, id_material, cantidad, precio_unitario } = req.body;
    const subtotal = cantidad * precio_unitario;
    const sql = `
      INSERT INTO detalles_compra
        (id_compra, id_material, cantidad, precio_unitario, subtotal)
      VALUES (?,?,?,?,?)
    `;
    db.query(sql, [id_compra, id_material, cantidad, precio_unitario, subtotal], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo crear el detalle" });
        }
        res.status(201).json({
          id_detalle_compra: result.insertId,
          id_compra, id_material, cantidad, precio_unitario, subtotal
        });
    });
};

//// METODO PUT  /////
// Actualizar cantidad/precio
const updateDetail = (req, res) => {
    const { id } = req.params;
    const { cantidad, precio_unitario } = req.body;
    const subtotal = cantidad * precio_unitario;
    const sql = `
      UPDATE detalles_compra
      SET cantidad = ?, precio_unitario = ?, subtotal = ?
      WHERE id_detalle_compra = ?
    `;
    db.query(sql, [cantidad, precio_unitario, subtotal, id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo actualizar el detalle" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: Detalle no encontrado" });
        }
        res.json({ id_detalle_compra: id, cantidad, precio_unitario, subtotal });
    });
};

//// METODO DELETE ////
// Eliminar detalle
const destroyDetail = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM detalles_compra WHERE id_detalle_compra = ?";
    db.query(sql, [id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo eliminar el detalle" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: Detalle no encontrado" });
        }
        res.json({ mensaje: "Detalle Eliminado" });
    });
};

module.exports = {
    allDetails,
    showDetail,
    storeDetail,
    updateDetail,
    destroyDetail
};
