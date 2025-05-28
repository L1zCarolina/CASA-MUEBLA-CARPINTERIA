// controllers/newsletter.controller.js
const db = require("../db/db");

//// METODO GET  /////
// Suscriptores activos (solo admin)
const allSubs = (req, res) => {
    const sql = "SELECT * FROM newsletter WHERE activo = 1";
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" });
        }
        res.json(rows);
    });
};

//// METODO POST  /////
// Suscribir email
const subscribe = (req, res) => {
    const { email } = req.body;
    const sql = "INSERT INTO newsletter (email) VALUES (?)";
    db.query(sql, [email], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo suscribir" });
        }
        res.status(201).json({ id_suscriptor: result.insertId, email });
    });
};

//// METODO DELETE ////
// Desactivar suscripción
const unsubscribe = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE newsletter SET activo = 0 WHERE id_suscriptor = ?";
    db.query(sql, [id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo desuscribir" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: Suscriptor no encontrado" });
        }
        res.json({ mensaje: "Suscripción desactivada" });
    });
};

module.exports = {
    allSubs,
    subscribe,
    unsubscribe
};
