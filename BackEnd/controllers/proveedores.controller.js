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
    const sql = "SELECT * FROM proveedores WHERE id = ?";
    db.query(sql,[id], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el proveedor buscado"});
        };
        res.json(rows[0]); 
    }); 
};

//// METODO POST  ////
const storeSupplier = (req, res) => {
    const {nombre, contacto, email, telefono, direccion} = req.body;

    const sql = "INSERT INTO proveedores (nombre, contacto, email, telefono, direccion) VALUES (?,?,?,?,?)";

    db.query(sql,[nombre, contacto, email, telefono, direccion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const proveedor = {...req.body, id: result.insertId};
        res.status(201).json(proveedor);
    });     
};

//// METODO PUT  ////
const updateSupplier = (req, res) => {
    const {id} = req.params;
    const {nombre, contacto, email, telefono, direccion} = req.body;
    const sql ="UPDATE proveedores SET nombre = ?, contacto = ?, email = ?, telefono = ?, direccion = ? WHERE id = ?";
    db.query(sql,[nombre, contacto, email, telefono, direccion, id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El proveedor a modificar no existe"});
        };
        
        const proveedor = {...req.body, id};

        res.json(proveedor);
    });     
};

//// METODO DELETE ////
const destroySupplier = (req, res) => {
    const {id} = req.params;
    const sql = "DELETE FROM proveedores WHERE id = ?";
    db.query(sql,[id], (error, result) => {
        console.log(result);
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