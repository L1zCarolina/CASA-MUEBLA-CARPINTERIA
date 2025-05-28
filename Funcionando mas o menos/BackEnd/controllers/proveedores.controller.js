/// CONTROLADORES DEL MODULO ///

const db = require("../db/db");

//// METODO GET  /////

// Para todos los proveedores
const allSuppliers = (req, res) => {
    const sql = "SELECT * FROM proveedores";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para un proveedor
const showSupplier = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * FROM proveedores WHERE id_proveedor = ?";
    db.query(sql,[id], (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length === 0){
            return res.status(404).send({error : "ERROR: No existe el proveedor buscado"});
        };
        res.json(rows[0]); 
    }); 
};

//// METODO POST  ////
const storeSupplier = (req, res) => {
    const {nombre_proveedor, contacto_nombre, contacto_telefono, contacto_email, direccion, notas, activo} = req.body;

    const sql = "INSERT INTO proveedores (nombre_proveedor, contacto_nombre, contacto_telefono, contacto_email, direccion, notas, activo) VALUES (?,?,?,?,?,?,?)";

    db.query(sql,[nombre_proveedor, contacto_nombre || null, contacto_telefono || null, contacto_email || null, direccion || null, notas || null, activo !== undefined ? activo : 1], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const proveedor = { id_proveedor: result.insertId,nombre_proveedor, contacto_nombre, contacto_telefono, contacto_email, direccion, notas, activo};
        res.status(201).json(proveedor);
    });     
};

//// METODO PUT  ////
// Para actualizar un proveedor
const updateSupplier = (req, res) => {
    const {id} = req.params;
    const {nombre_proveedor, contacto_nombre, contacto_telefono, contacto_email, direccion, notas, activo} = req.body;
    const sql ="UPDATE provnombre_proveedor, contacto_nombre, contacto_telefono, contacto_email, direccion, notas, activo) VALUES (?,?,?,?,?,?,?)";
    db.query(sql,[nombre_proveedor, contacto_nombre || null, contacto_telefono || null, contacto_email || null, direccion || null, notas || null, activo, id], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El proveedor a modificar no existe"});
        };

        res.json({ id_proveedor: id, nombre_proveedor, contacto_nombre, contacto_telefono, contacto_email, direccion, notas, activo});
    });     
};

//// METODO DELETE ////
const destroySupplier = (req, res) => {
    const {id} = req.params;
    const sql = "DELETE FROM proveedores WHERE id_proveedor = ?";
    db.query(sql,[id], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El proveedor a borrar no existe"});
        };
        res.json({mensaje : "Proveedor Eliminado"});
    }); 
};

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allSuppliers,
    showSupplier,
    storeSupplier,
    updateSupplier,
    destroySupplier
};
