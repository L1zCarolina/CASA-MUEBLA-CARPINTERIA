/// CONTROLADORES DEL MODULO ///

const db = require("../db/db");

//// METODO GET  /////

// Para todas las categorías
const allCategories = (req, res) => {
    const sql = "SELECT * FROM categorias";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para una categoría
const showCategory = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * FROM categorias WHERE id = ?";
    db.query(sql,[id], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe la categoría buscada"});
        };
        res.json(rows[0]); 
    }); 
};

//// METODO POST  ////
const storeCategory = (req, res) => {
    const {nombre, descripcion} = req.body;

    const sql = "INSERT INTO categorias (nombre, descripcion) VALUES (?,?)";

    db.query(sql,[nombre, descripcion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const categoria = {...req.body, id: result.insertId};
        res.status(201).json(categoria);
    });     
};

//// METODO PUT  ////
const updateCategory = (req, res) => {
    const {id} = req.params;
    const {nombre, descripcion} = req.body;
    const sql ="UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?";
    db.query(sql,[nombre, descripcion, id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La categoría a modificar no existe"});
        };
        
        const categoria = {...req.body, id};

        res.json(categoria);
    });     
};

//// METODO DELETE ////
const destroyCategory = (req, res) => {
    const {id} = req.params;
    const sql = "DELETE FROM categorias WHERE id = ?";
    db.query(sql,[id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La categoría a borrar no existe"});
        };
        res.json({mensaje : "Categoría Eliminada"});
    }); 
};

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allCategories,
    showCategory,
    storeCategory,
    updateCategory,
    destroyCategory
};