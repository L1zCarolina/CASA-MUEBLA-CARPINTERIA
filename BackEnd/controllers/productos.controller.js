/// CONTROLADORES DEL MODULO ///

const db = require("../db/db");

//// METODO GET  /////

// Para todos los productos
const allProducts = (req, res) => {
    const sql = "SELECT * FROM productos";
    db.query(sql, (error, rows) => {
        if(error){
            console.error('Error en la consulta:', error);
            return res.status(500).json({error : "Error interno del servidor. Por favor, intente más tarde."});
        }
        res.json(rows);
    }); 
};

// Para un producto
const showProduct = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * FROM productos WHERE id = ?";
    db.query(sql,[id], (error, rows) => {
        console.log(rows);
        if(error){
            console.error('Error en la consulta:', error);
            return res.status(500).json({error : "Error interno del servidor. Por favor, intente más tarde."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el mueble buscado"});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const storeProduct = (req, res) => {
    console.log(req.file);
    let imageName = "";

    if(req.file){
        imageName = req.file.filename;
    };

    const {nombre, descripcion, precio, stock, categoria} = req.body;

    const sql = "INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen) VALUES (?,?,?,?,?,?)";

    db.query(sql,[nombre, descripcion, precio, stock, categoria, imageName], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: No se pudo agregar el mueble. Intente más tarde por favor"});
        }
        const producto = {...req.body, id: result.insertId, imagen: imageName}; // ... reconstruir el objeto del body
        res.status(201).json({mensaje: "Mueble agregado exitosamente", producto}); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateProduct = (req, res) => {
    const {id} = req.params;
    const {nombre, descripcion, precio, stock, categoria} = req.body;
    const sql ="UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ? WHERE id = ?";
    db.query(sql,[nombre, descripcion, precio, stock, categoria, id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: No se pudo actualizar el mueble. Intente más tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El mueble a modificar no existe"});
        };
        
        const producto = {...req.body, id}; // ... reconstruir el objeto del body

        res.json({mensaje: "Mueble actualizado exitosamente", producto}); // mostrar el elemento que existe
    });     
};


//// METODO DELETE ////
const destroyProduct = (req, res) => {
    const {id} = req.params;
    const sql = "DELETE FROM productos WHERE id = ?";
    db.query(sql,[id], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: No se pudo eliminar el mueble. Intente más tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El mueble a borrar no existe"});
        };
        res.json({mensaje : "Mueble eliminado exitosamente"});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allProducts,
    showProduct,
    storeProduct,
    updateProduct,
    destroyProduct
};