/// CONTROLADORES DEL MODULO ///

const db = require("../db/db");

//// METODO GET  /////

// Para todos los materiales
const allMaterials = (req, res) => {
    const sql = "SELECT * FROM materiales";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para un material
const showMaterial = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * FROM materiales WHERE id_material = ?";
    db.query(sql,[id], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el material buscado"});
        };
        res.json(rows[0]); 
    }); 
};

//// METODO POST  ////
const storeMaterial = (req, res) => {
    const { nombre_material, descripcion_material, unidad_medida,precio_unitario, stock, stock_minimo, proveedor} = req.body;

    const sql = "INSERT INTO materiales (nombre_material, descripcion_material, unidad_medida, precio_unitario, stock, stock_minimo, proveedor) VALUES (?,?,?,?,?,?,?)";

    db.query(sql,[ nombre_material, descripcion_material, unidad_medida, precio_unitario, stock, stock_minimo || 5, proveedor], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const material = { id_material: result.insertId, nombre_material, descripcion_material, unidad_medida, precio_unitario, stock, stock_minimo, proveedor};
        res.status(201).json(material);
    });     
};

//// METODO PUT  ////
const updateMaterial = (req, res) => {
    const {id} = req.params;
    const { nombre_material, descripcion_material, unidad_medida,  precio_unitario, stock, stock_minimo, proveedor } = req.body;
    const sql ="UPDATE materiales SET nombre_material = ?, descripcion_material = ?, unidad_medida = ?, precio_unitario = ?, stock = ?, stock_minimo = ?, proveedor = ? WHERE id_material = ?";
    db.query(sql, [nombre_material, descripcion_material, unidad_medida, precio_unitario, stock, stock_minimo, proveedor, id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El material a modificar no existe"});
        };
        
        res.json({ id_material: id, nombre_material, unidad_medida, precio_unitario, stock, stock_minimo, proveedor
        });
    });     
};

//// METODO DELETE ////
const destroyMaterial = (req, res) => {
    const {id} = req.params;
    const sql = "DELETE FROM materiales WHERE id_material = ?";
    db.query(sql,[id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows === 0){
            return res.status(404).send({error : "ERROR: El material a borrar no existe"});
        };
        res.json({mensaje : "Material Eliminado"});
    }); 
};

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allMaterials,
    showMaterial,
    storeMaterial,
    updateMaterial,
    destroyMaterial
};
