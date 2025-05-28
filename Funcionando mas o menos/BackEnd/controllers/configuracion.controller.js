
const db = require("../db/db");

//// GET  /////
// Obtener configuración actual (asumo solo una fila)
const showConfig = (req, res) => {
    const sql = "SELECT * FROM configuracion ORDER BY id_configuracion DESC LIMIT 1";
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" });
        }
        res.json(rows[0] || {});
    });
};

//// METODO PUT  /////
// Actualizar configuración
const updateConfig = (req, res) => {
    const {
        nombre_sitio, logo_url, email_contacto, telefono_contacto,
        direccion, horario_atencion, facebook_url, instagram_url,
        twitter_url, meta_descripcion, meta_keywords,
        terminos_condiciones, politica_privacidad
    } = req.body;
    const sql = `
      UPDATE configuracion SET
        nombre_sitio=?, logo_url=?, email_contacto=?, telefono_contacto=?, direccion=?,
        horario_atencion=?, facebook_url=?, instagram_url=?, twitter_url=?,
        meta_descripcion=?, meta_keywords=?, terminos_condiciones=?, politica_privacidad=?
    `;
    db.query(sql, [
        nombre_sitio, logo_url, email_contacto, telefono_contacto, direccion,
        horario_atencion, facebook_url, instagram_url, twitter_url,
        meta_descripcion, meta_keywords, terminos_condiciones, politica_privacidad
    ], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo actualizar la configuración" });
        }
        res.json({ mensaje: "Configuración actualizada" });
    });
};

module.exports = {
    showConfig,
    updateConfig
};
