/// CONTROLADORES DEL MODULO ///

const db = require("../db/db");

//// METODO GET  /////

// Para todos los detalles de pedidos
const allOrderDetails = (req, res) => {
    const sql = "SELECT * FROM detalles_pedido";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para un detalle de pedido
const showOrderDetail = (req, res) => {
    const { id_pedido, id_producto, cantidad, precio_unitario, notas_especiales } = req.body;
    const subtotal = cantidad * precio_unitario;
    const sql = "INSERT INTO detalles_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal, notas_especiales) VALUES (?,?,?,?,?,?)";
    db.query(sql, [id_pedido, id_producto, cantidad, precio_unitario, subtotal, notas_especiales || null], (error, result) => {
        if(error){
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor" });
        }
        const detallePedido = { id_detalle: result.insertId, id_pedido, id_producto, cantidad, precio_unitario, subtotal, notas_especiales
        };
        res.status(201).json(detallePedido);
    }); 
};

//// METODO POST  ////
const storeOrderDetail = (req, res) => {
    const { id_pedido, id_producto, cantidad, precio_unitario, notas_especiales } = req.body;

    const sql = "INSERT INTO detalles_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal, notas_especiales) VALUES (?,?,?,?,?,?)";

    db.query(sql,[id_pedido, id_producto, cantidad, precio_unitario, subtotal, notas_especiales || null], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const detallePedido = { id_detalle: result.insertId, id_pedido, id_producto, cantidad, precio_unitario, subtotal, notas_especiales };
        res.status(201).json(detallePedido);
    });     
};

//// METODO PUT  ////
const updateOrderDetail = (req, res) => {
    const {id} = req.params;
    const { cantidad, precio_unitario, notas_especiales } = req.body;
    const subtotal = cantidad * precio_unitario;
    const sql ="UPDATE detalles_pedido SET cantidad = precio_unitario = ?, subtotal = ?, notas_especiales = ? WHERE id_detalle = ?";
    db.query(sql,[cantidad, precio_unitario, subtotal, notas_especiales || null, id], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El detalle de pedido a modificar no existe"});
        };
        res.json({ id_detalle: id, cantidad, precio_unitario, subtotal, notas_especiales
        });
    });     
};

//// METODO DELETE ////
const destroyOrderDetail = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM detalles_pedido WHERE id_detalle = ?";
    db.query(sql, [id], (error, result) => {
        if(error){
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor" });
        }
        if(result.affectedRows === 0){
            return res.status(404).json({ error: "ERROR: El detalle de pedido a borrar no existe" });
        }
        res.json({ mensaje: "Detalle de Pedido Eliminado" });
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
