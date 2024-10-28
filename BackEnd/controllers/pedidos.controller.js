/// CONTROLADORES DEL MODULO ///

const db = require("../db/db");

//// METODO GET  /////

// Para todos los pedidos
const allOrders = (req, res) => {
    const sql = "SELECT * FROM pedidos";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para un pedido
const showOrder = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * FROM pedidos WHERE id = ?";
    db.query(sql,[id], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el pedido buscado"});
        };
        res.json(rows[0]); 
    }); 
};

//// METODO POST  ////
const storeOrder = (req, res) => {
    const {cliente_id, estado, total} = req.body;

    const sql = "INSERT INTO pedidos (cliente_id, estado, total) VALUES (?,?,?)";

    db.query(sql,[cliente_id, estado, total], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const pedido = {...req.body, id: result.insertId};
        res.status(201).json(pedido);
    });     
};

//// METODO PUT  ////
const updateOrder = (req, res) => {
    const {id} = req.params;
    const {cliente_id, estado, total} = req.body;
    const sql ="UPDATE pedidos SET cliente_id = ?, estado = ?, total = ? WHERE id = ?";
    db.query(sql,[cliente_id, estado, total, id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El pedido a modificar no existe"});
        };
        
        const pedido = {...req.body, id};

        res.json(pedido);
    });     
};

//// METODO DELETE ////
const destroyOrder = (req, res) => {
    const {id} = req.params;
    const sql = "DELETE FROM pedidos WHERE id = ?";
    db.query(sql,[id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El pedido a borrar no existe"});
        };
        res.json({mensaje : "Pedido Eliminado"});
    }); 
};

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allOrders,
    showOrder,
    storeOrder,
    updateOrder,
    destroyOrder
};