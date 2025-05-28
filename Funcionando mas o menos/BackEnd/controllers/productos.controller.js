    /// CONTROLADORES DEL MODULO ///

    const db = require("../db/db")

    //// METODO GET  /////

    // Para todos los productos
    const allProducts = (req, res) => {
    const sql = "SELECT * FROM productos ORDER BY id_producto DESC"
    db.query(sql, (error, rows) => {
        if (error) {
        console.error("Error en allProducts:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }

        // ← ASEGURAR QUE SIEMPRE SE ENVÍE ARRAY
        const productos = Array.isArray(rows) ? rows : []
        console.log(`Enviando ${productos.length} productos`)
        res.json(productos)
    })
    }

    // Para un producto
    const showProduct = (req, res) => {
    const { id } = req.params
    const sql = "SELECT * FROM productos WHERE id_producto = ?"
    db.query(sql, [id], (error, rows) => {
        if (error) {
        console.error("Error en showProduct:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (rows.length == 0) {
        return res.status(404).send({ error: "ERROR: No existe el producto buscado" })
        }
        res.json(rows[0])
    })
    }

    //// METODO POST  ////
    const storeProduct = (req, res) => {
    console.log("=== CREAR PRODUCTO ===")
    console.log("Archivo recibido:", req.file)
    console.log("Datos del formulario:", req.body)

    const { nombre_producto, descripcion_producto, precio, stock, id_categoria } = req.body
    const imagen_producto = req.file ? req.file.filename : null

    // Validación básica
    if (!nombre_producto || !descripcion_producto || !precio || !stock || !id_categoria) {
        return res.status(400).json({
        error: "Por favor, complete todos los campos del formulario.",
        })
    }

    const sql =
        "INSERT INTO productos (nombre_producto, descripcion_producto, precio, stock, id_categoria, imagen_producto) VALUES (?,?,?,?,?,?)"

    db.query(
        sql,
        [nombre_producto, descripcion_producto, precio, stock, id_categoria, imagen_producto],
        (error, result) => {
        if (error) {
            console.error("Error al crear producto:", error)
            return res.status(500).json({
            error: "ERROR: No se pudo agregar el producto",
            })
        }

        // ← RESPUESTA CONSISTENTE
        const producto = {
            id_producto: result.insertId,
            nombre_producto,
            descripcion_producto,
            precio: Number.parseFloat(precio),
            stock: Number.parseInt(stock),
            id_categoria: Number.parseInt(id_categoria),
            imagen_producto,
            destacado: false,
            activo: true,
        }

        console.log("Producto creado exitosamente:", producto)
        res.status(201).json({
            mensaje: "✅ Producto creado exitosamente",
            producto: producto,
        })
        },
    )
    }

    //// METODO PUT  ////
    const updateProduct = (req, res) => {
    console.log("=== ACTUALIZAR PRODUCTO ===")
    const { id } = req.params
    console.log("ID a actualizar:", id)
    console.log("Archivo recibido:", req.file)
    console.log("Datos del formulario:", req.body)

    const { nombre_producto, descripcion_producto, precio, stock, id_categoria } = req.body

    // ← VERIFICAR QUE EL PRODUCTO EXISTE ANTES DE ACTUALIZAR
    const checkSql = "SELECT * FROM productos WHERE id_producto = ?"
    db.query(checkSql, [id], (checkError, checkResults) => {
        if (checkError) {
        console.error("Error al verificar producto:", checkError)
        return res.status(500).json({ error: "Error al verificar producto" })
        }

        if (checkResults.length === 0) {
        return res.status(404).json({ error: "Producto no encontrado" })
        }

        const productoExistente = checkResults[0]

        // ← MANEJAR IMAGEN: usar nueva si se subió, sino mantener la actual
        let imagen_producto
        if (req.file) {
        imagen_producto = req.file.filename
        } else {
        imagen_producto = productoExistente.imagen_producto // Mantener imagen actual
        }

        const updateSql =
        "UPDATE productos SET nombre_producto = ?, descripcion_producto = ?, precio = ?, stock = ?, id_categoria = ?, imagen_producto = ? WHERE id_producto = ?"

        db.query(
        updateSql,
        [nombre_producto, descripcion_producto, precio, stock, id_categoria, imagen_producto, id],
        (error, result) => {
            if (error) {
            console.error("Error al actualizar producto:", error)
            return res.status(500).json({ error: "ERROR: No se pudo actualizar el producto" })
            }

            if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: El producto a modificar no existe" })
            }

            // ← RESPUESTA CONSISTENTE
            const productoActualizado = {
            id_producto: Number.parseInt(id),
            nombre_producto,
            descripcion_producto,
            precio: Number.parseFloat(precio),
            stock: Number.parseInt(stock),
            id_categoria: Number.parseInt(id_categoria),
            imagen_producto,
            destacado: productoExistente.destacado,
            activo: productoExistente.activo,
            }

            console.log("Producto actualizado exitosamente:", productoActualizado)
            res.json({
            mensaje: "✅ Producto actualizado exitosamente",
            producto: productoActualizado,
            })
        },
        )
    })
    }

    //// METODO DELETE ////
    const destroyProduct = (req, res) => {
    const { id } = req.params
    const sql = "DELETE FROM productos WHERE id_producto = ?"
    db.query(sql, [id], (error, result) => {
        if (error) {
        console.error("Error al eliminar producto:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
        return res.status(404).send({ error: "ERROR: El producto a borrar no existe" })
        }
        res.json({ mensaje: "Producto Eliminado" })
    })
    }

    // EXPORTAR DEL MODULO TODAS LAS FUNCIONES
    module.exports = {
        allProducts,
        showProduct,
        storeProduct,
        updateProduct,
        destroyProduct,
    }
