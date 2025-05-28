const db = require("../db/db");

//// METODO GET  /////
// Todos los contactos (solo admin)
const allContacts = (req, res) => {
    const sql = "SELECT * FROM contactos ORDER BY fecha_contacto DESC";
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" });
        }
        res.json(rows);
    });
};

//// METODO POST  /////
// Crear nuevo contacto (desde formulario)
const storeContact = (req, res) => {
    const { nombre, email, telefono, asunto, mensaje } = req.body;
    const sql = `
      INSERT INTO contactos
        (nombre, email, telefono, asunto, mensaje)
      VALUES (?,?,?,?,?)
    `;
    db.query(sql, [nombre, email, telefono || null, asunto || null, mensaje], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo enviar el mensaje" });
        }
        res.status(201).json({
          id_contacto: result.insertId,
          nombre, email, telefono, asunto, mensaje
        });
    });
};

//// METODO PUT  /////
// Marcar como leído/respondido
const updateContact = (req, res) => {
    const { id } = req.params;
    const { leido, respondido } = req.body;
    const sql = `
      UPDATE contactos
      SET leido = ?, respondido = ?
      WHERE id_contacto = ?
    `;
    db.query(sql, [leido, respondido, id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo actualizar el contacto" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: Contacto no encontrado" });
        }
        res.json({ id_contacto: id, leido, respondido });
    });
};

//// METODO DELETE /////
// Eliminar contacto
const destroyContact = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM contactos WHERE id_contacto = ?";
    db.query(sql, [id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo eliminar el contacto" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: Contacto no encontrado" });
        }
        res.json({ mensaje: "Contacto Eliminado" });
    });
};

module.exports = {
    allContacts,
    storeContact,
    updateContact,
    destroyContact
};
