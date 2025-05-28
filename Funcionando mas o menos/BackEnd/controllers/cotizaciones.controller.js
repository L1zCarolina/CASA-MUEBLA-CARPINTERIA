// Cotizaciones.controller.js
const db = require("../db/db");

const storeCotizacion = (req, res) => {
    const { cliente_id, tipo_mueble, descripcion } = req.body;
    
    const sql = "INSERT INTO cotizaciones (cliente_id, tipo_mueble, descripcion, fecha) VALUES (?,?,?,NOW())";
    
    db.query(sql, [cliente_id, tipo_mueble, descripcion], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: No se pudo enviar la cotización"});
        }
        
        res.status(201).json({ mensaje: "Cotización enviada correctamente", id: result.insertId });
    });
};

module.exports = {
    storeCotizacion
};