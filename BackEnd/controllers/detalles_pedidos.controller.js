/// CONTROLADORES DEL MODULO ///

const db = require("../db/db");

//// METODO GET  /////

// Para todos los detalles de pedidos
const allOrderDetails = (req, res) => {
    const sql = "SELECT * FROM detalles_pedidos";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para un detalle de pedido
const showOrderDetail = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * FROM detalles_pedidos WHERE id = ?";
    db.query(sql,[id], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el detalle de pedido buscado"});
        };
        res.json(rows[0]); 
    }); 
};

//// METODO POST  ////
const storeOrderDetail = (req, res) => {
    const {pedido_id, producto_id, cantidad, precio_unitario} = req.body;

    const sql = "INSERT INTO detalles_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?,?,?,?)";

    db.query(sql,[pedido_id, producto_id, cantidad, precio_unitario], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const detallePedido = {...req.body, id: result.insertId};
        res.status(201).json(detallePedido);
    });     
};

//// METODO PUT  ////
const updateOrderDetail = (req, res) => {
    const {id} = req.params;
    const {pedido_id, producto_id, cantidad, precio_unitario} = req.body;
    const sql ="UPDATE detalles_pedidos SET pedido_id = ?, producto_id = ?, cantidad = ?, precio_unitario = ? WHERE id = ?";
    db.query(sql,[pedido_id, producto_id, cantidad, precio_unitario, id], (error, result) => {
        
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El detalle de pedido a modificar no existe"});
        };
        
        const detallePedido = {...req.body, id};

        res.json(detallePedido);
    });     
};

//// METODO DELETE ////
const destroyOrderDetail = (req, res) => {
    const {id} = req.params;
    const sql = "DELETE FROM detalles_pedidos WHERE id = ?";
    db.query(sql,[id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El detalle de pedido a borrar no existe"});
        };
        res.json({mensaje : "Detalle de Pedido Eliminado"});
    }); 
};

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allOrderDetails,
    showOrderDetail,
    storeOrderDetail,
    updateOrderDetail,
    destroyOrderDetail
};