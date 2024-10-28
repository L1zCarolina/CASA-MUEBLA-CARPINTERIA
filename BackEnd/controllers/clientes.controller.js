/// CONTROLADORES DEL MODULO ///

const db = require("../db/db");

//// METODO GET  /////

// Para todos los clientes
const allClients = (req, res) => {
    const sql = "SELECT * FROM clientes";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para un cliente
const showClient = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * FROM clientes WHERE id = ?";
    db.query(sql,[id], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el cliente buscado"});
        };
        res.json(rows[0]); 
    }); 
};

//// METODO POST  ////
const storeClient = (req, res) => {
    const {nombre, apellido, email, telefono, direccion} = req.body;

    const sql = "INSERT INTO clientes (nombre, apellido, email, telefono, direccion) VALUES (?,?,?,?,?)";

    db.query(sql,[nombre, apellido, email, telefono, direccion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const cliente = {...req.body, id: result.insertId};
        res.status(201).json(cliente);
    });     
};

//// METODO PUT  ////
const updateClient = (req, res) => {
    const {id} = req.params;
    const {nombre, apellido, email, telefono, direccion} = req.body;
    const sql ="UPDATE clientes SET nombre = ?, apellido = ?, email = ?, telefono = ?, direccion = ? WHERE id = ?";
    db.query(sql,[nombre, apellido, email, telefono, direccion, id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El cliente a modificar no existe"});
        };
        
        const cliente = {...req.body, id};

        res.json(cliente);
    });     
};

//// METODO DELETE ////
const destroyClient = (req, res) => {
    const {id} = req.params;
    const sql = "DELETE FROM clientes WHERE id = ?";
    db.query(sql,[id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El cliente a borrar no existe"});
        };
        res.json({mensaje : "Cliente Eliminado"});
    }); 
};

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allClients,
    showClient,
    storeClient,
    updateClient,
    destroyClient
};