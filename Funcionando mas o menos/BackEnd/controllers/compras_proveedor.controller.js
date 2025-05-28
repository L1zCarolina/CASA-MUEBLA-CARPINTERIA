const db = require("../db/db");

//// METODO GET  /////
// Todas las compras
const allPurchases = (req, res) => {
    const sql = "SELECT * FROM compras_proveedor";
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" });
        }
        res.json(rows);
    });
};

//// METODO GET UNO ////
// Compra específica
const showPurchase = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM compras_proveedor WHERE id_compra = ?";
    db.query(sql, [id], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: "ERROR: Compra no encontrada" });
        }
        res.json(rows[0]);
    });
};

//// METODO POST  /////
// Crear compra
const storePurchase = (req, res) => {
    const { id_proveedor, total, estado_compra, notas } = req.body;
    const sql = `
      INSERT INTO compras_proveedor
        (id_proveedor, total, estado_compra, notas)
      VALUES (?,?,?,?)
    `;
    db.query(sql, [id_proveedor, total, estado_compra || 'pendiente', notas || null], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo crear la compra" });
        }
        res.status(201).json({
          id_compra: result.insertId,
          id_proveedor, total, estado_compra, notas
        });
    });
};

//// METODO PUT  /////
// Actualizar estado o notas
const updatePurchase = (req, res) => {
    const { id } = req.params;
    const { estado_compra, notas } = req.body;
    const sql = `
      UPDATE compras_proveedor
      SET estado_compra = ?, notas = ?
      WHERE id_compra = ?
    `;
    db.query(sql, [estado_compra, notas || null, id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo actualizar la compra" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: Compra no encontrada" });
        }
        res.json({ id_compra: id, estado_compra, notas });
    });
};

//// METODO DELETE ////
// Eliminar compra
const destroyPurchase = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM compras_proveedor WHERE id_compra = ?";
    db.query(sql, [id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo eliminar la compra" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: Compra no encontrada" });
        }
        res.json({ mensaje: "Compra Eliminada" });
    });
};

module.exports = {
    allPurchases,
    showPurchase,
    storePurchase,
    updatePurchase,
    destroyPurchase
};
