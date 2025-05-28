/// CONTROLADORES DEL MODULO ///

const db = require("../db/db");

//// METODO GET  /////

// Para obtener todas las categorías
const allCategories = (req, res) => {
    const sql = "SELECT * FROM categorias";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para obtener una sola categoría
const showCategory = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * FROM categorias WHERE id_categoria = ?";
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
// Para crear categoría
const storeCategory = (req, res) => {
    const {nombre_categoria, descripcion_categoria} = req.body;

    const sql = "INSERT INTO categorias (nombre_categoria, descripcion_categoria) VALUES (?,?)";

    db.query(sql,[nombre_categoria, descripcion_categoria], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const categoria = { id_categoria: result.insertId, nombre_categoria, descripcion_categoria };
        res.status(201).json(categoria);
    });     
};

//// METODO PUT  ///=
//Para actualizar
const updateCategory = (req, res) => {
    const {id} = req.params;
    const {nombre_categoria, descripcion_categoria} = req.body;
    const sql ="UPDATE categorias SET nombre_categoria = ?, descripcion_categoria = ? WHERE id_categoria = ?";
    db.query(sql,[nombre_categoria, descripcion_categoria, id], (error, result) => {
        if (error) return res.status(500).json({ error: "ERROR: Intente más tarde por favor" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "ERROR: La categoría a modificar no existe" });
        res.json({ id_categoria: id, nombre_categoria, descripcion_categoria });
    });     
};

//// METODO DELETE ////
// Para eliminar
const destroyCategory = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM categorias WHERE id_categoria = ?";
    db.query(sql, [id], (error, result) => {
        if (error) return res.status(500).json({ error: "ERROR: Intente más tarde por favor" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "ERROR: La categoría a borrar no existe" });
        res.json({ mensaje: "Categoría Eliminada" });
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
