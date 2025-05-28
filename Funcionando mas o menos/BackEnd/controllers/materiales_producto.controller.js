/// CONTROLADORES DEL MODULO ///

const db = require("../db/db");

//// METODO GET  /////

// Para todas las relaciones material-producto
const allProductMaterials = (req, res) => {
    const sql = "SELECT * FROM materiales_producto";
    db.query(sql, (error, rows) => {
        if(error){
            console.error('Error en la consulta:', error);
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para una relación material-producto
const showProductMaterial = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * FROM materiales_producto WHERE id_material_producto = ?";
    db.query(sql,[id], (error, rows) => {
        if(error){
            console.error('Error en la consulta:', error);
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe la relación buscada"});
        };
        res.json(rows[0]); 
    }); 
};

//// METODO POST  ////
const storeProductMaterial = (req, res) => {
    const {id_producto, id_material, cantidad} = req.body;

    const sql = "INSERT INTO materiales_producto (id_producto, id_material, cantidad) VALUES (?,?,?)";

    db.query(sql,[id_producto, id_material, cantidad], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const relacion = { id_material_producto: result.insertId, id_producto, id_material, cantidad };
        res.status(201).json(relacion);
    });     
};

//// METODO PUT  ////
const updateProductMaterial = (req, res) => {
    const {id} = req.params;
    const {cantidad} = req.body;
    const sql ="UPDATE materiales_producto SET cantidad = ? WHERE id_material_producto = ?";
    db.query(sql,[cantidad, id], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La relación  a modificar no existe"});
        };
        
        res.json({ id_material_producto: id, cantidad });
    });     
};

//// METODO DELETE ////
// Para borrar una relación
const destroyProductMaterial = (req, res) => {
    const {id} = req.params;
    const sql = "DELETE FROM materiales_producto WHERE id_material_producto = ?";
    db.query(sql,[id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La relación  a eliminar no existe"});
        };
        res.json({mensaje : "Relación Eliminada"});
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
