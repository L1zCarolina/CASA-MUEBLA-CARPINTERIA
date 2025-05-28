
const db = require("../db/db");

//// METODO GET  /////
// Todos los pagos
const allPayments = (req, res) => {
    const sql = "SELECT * FROM pagos";
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" });
        }
        res.json(rows);
    });
};

//// METODO GET UNO ////
// Pago específico
const showPayment = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM pagos WHERE id_pago = ?";
    db.query(sql, [id], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: "ERROR: Pago no encontrado" });
        }
        res.json(rows[0]);
    });
};

//// METODO POST  /////
// Crear pago
const storePayment = (req, res) => {
    const { id_pedido, monto, metodo_pago, estado_pago, referencia } = req.body;
    const sql = `
      INSERT INTO pagos
        (id_pedido, monto, metodo_pago, estado_pago, referencia)
      VALUES (?,?,?,?,?)
    `;
    db.query(sql, [id_pedido, monto, metodo_pago, estado_pago || 'pendiente', referencia || null], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo registrar el pago" });
        }
        res.status(201).json({
          id_pago: result.insertId,
          id_pedido, monto, metodo_pago, estado_pago, referencia
        });
    });
};

//// METODO PUT  /////
// Actualizar estado
const updatePayment = (req, res) => {
    const { id } = req.params;
    const { estado_pago } = req.body;
    const sql = "UPDATE pagos SET estado_pago = ? WHERE id_pago = ?";
    db.query(sql, [estado_pago, id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo actualizar el pago" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: Pago no encontrado" });
        }
        res.json({ id_pago: id, estado_pago });
    });
};

//// METODO DELETE ////
// Eliminar pago
const destroyPayment = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM pagos WHERE id_pago = ?";
    db.query(sql, [id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo eliminar el pago" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: Pago no encontrado" });
        }
        res.json({ mensaje: "Pago Eliminado" });
    });
};

module.exports = {
    allPayments,
    showPayment,
    storePayment,
    updatePayment,
    destroyPayment
};
