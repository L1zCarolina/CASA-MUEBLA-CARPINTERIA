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
    const sql = "SELECT * FROM pedidos WHERE id_pedido = ?";
    db.query(sql,[id], (error, rows) => {
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
    const { id_cliente, estado_pedido, total, metodo_pago, notas, direccion_envio, fecha_entrega } = req.body;

    const sql = "INSERT INTO pedidos (id_cliente, estado_pedido, total, metodo_pago, notas, direccion_envio, fecha_entrega) VALUES (?,?,?, ?,?,?,?)";

    db.query(sql,[ id_cliente, estado_pedido, total, metodo_pago || null, notas || null, direccion_envio || null, fecha_entrega || null], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const pedido = { id_pedido: result.insertId, id_cliente, estado_pedido, total, metodo_pago, notas, direccion_envio, fecha_entrega };
        res.status(201).json(pedido);
    });     
};

//// METODO PUT  ////
// Para actualizar un pedido
const updateOrder = (req, res) => {
    const {id} = req.params;
    const { id_cliente, estado_pedido, total, metodo_pago, notas, direccion_envio, fecha_entrega } = req.body;
    const sql ="UPDATE pedidos SET cid_cliente = ?, estado_pedido = ?, total = ?, metodo_pago = ?, notas = ?, direccion_envio = ?, fecha_entrega = ? WHERE id_pedido = ?";
    db.query(sql,[ id_cliente, estado_pedido, total, metodo_pago || null, notas || null, direccion_envio || null, fecha_entrega || null, id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows === 0){
            return res.status(404).send({error : "ERROR: El pedido a modificar no existe"});
        };
        
        const pedido = { id_pedido: id, id_cliente, estado_pedido, total, metodo_pago, notas, direccion_envio, fecha_entrega };

        res.json(pedido);
    });     
};

//// METODO DELETE ////
const destroyOrder = (req, res) => {
    const {id} = req.params;
    const sql = "DELETE FROM pedidos WHERE id_pedido = ?";
    db.query(sql,[id], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows === 0){
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
