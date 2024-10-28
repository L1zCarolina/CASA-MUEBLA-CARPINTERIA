/// CONTROLADORES DEL MODULO ///

const db = require("../db/db");

//// METODO GET  /////

// Para todas las relaciones producto-material
const allProductMaterials = (req, res) => {
    const sql = "SELECT * FROM producto_material";
    db.query(sql, (error, rows) => {
        if(error){
            console.error('Error en la consulta:', error);
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para una relación producto-material
const showProductMaterial = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * FROM producto_material WHERE id = ?";
    db.query(sql,[id], (error, rows) => {
        console.log(rows);
        if(error){
            console.error('Error en la consulta:', error);
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe la relación producto-material buscada"});
        };
        res.json(rows[0]); 
    }); 
};

//// METODO POST  ////
const storeProductMaterial = (req, res) => {
    const {producto_id, material_id, cantidad} = req.body;

    const sql = "INSERT INTO producto_material (producto_id, material_id, cantidad) VALUES (?,?,?)";

    db.query(sql,[producto_id, material_id, cantidad], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const productoMaterial = {...req.body, id: result.insertId};
        res.status(201).json(productoMaterial);
    });     
};

//// METODO PUT  ////
const updateProductMaterial = (req, res) => {
    const {id} = req.params;
    const {producto_id, material_id, cantidad} = req.body;
    const sql ="UPDATE producto_material SET producto_id = ?, material_id = ?, cantidad = ? WHERE id = ?";
    db.query(sql,[producto_id, material_id, cantidad, id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La relación producto-material a modificar no existe"});
        };
        
        const productoMaterial = {...req.body, id};

        res.json(productoMaterial);
    });     
};

//// METODO DELETE ////
const destroyProductMaterial = (req, res) => {
    const {id} = req.params;
    const sql = "DELETE FROM producto_material WHERE id = ?";
    db.query(sql,[id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La relación producto-material a borrar no existe"});
        };
        res.json({mensaje : "Relación Producto-Material Eliminada"});
    }); 
};

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allProductMaterials,
    showProductMaterial,
    storeProductMaterial,
    updateProductMaterial,
    destroyProductMaterial
};