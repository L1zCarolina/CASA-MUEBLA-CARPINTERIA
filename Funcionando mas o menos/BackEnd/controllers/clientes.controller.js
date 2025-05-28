/// CONTROLADORES DEL MODULO ///

const db = require("../db/db")

//// METODO GET  /////

// Para todos los clientes
const allClients = (req, res) => {
  const sql = "SELECT * FROM clientes"
  db.query(sql, (error, rows) => {
    if (error) {
      console.error("Error en allClients:", error)
      return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
    }
    res.json(rows)
  })
}

// Para un cliente
const showClient = (req, res) => {
  const { id } = req.params
  const sql = "SELECT * FROM clientes WHERE id_cliente = ?"
  db.query(sql, [id], (error, rows) => {
    if (error) {
      console.error("Error en showClient:", error)
      return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "ERROR: No existe el cliente buscado" })
    }
    res.json(rows[0])
  })
}

//// METODO POST  ////
// Para crear clientes
const storeClient = (req, res) => {
  const {
    id_usuario,
    nombre_cliente,
    apellido_cliente,
    telefono_cliente,
    direccion_cliente,
    ciudad,
    estado,
    codigo_postal,
  } = req.body

  // Validación básica
  if (!nombre_cliente || !apellido_cliente || !telefono_cliente) {
    return res.status(400).json({ error: "Nombre, apellido y teléfono son obligatorios" })
  }

  const sql =
    "INSERT INTO clientes (id_usuario, nombre_cliente, apellido_cliente, telefono_cliente, direccion_cliente, ciudad, estado, codigo_postal) VALUES (?,?,?,?,?,?,?,?)"

  db.query(
    sql,
    [
      id_usuario || null,
      nombre_cliente,
      apellido_cliente,
      telefono_cliente,
      direccion_cliente,
      ciudad,
      estado,
      codigo_postal,
    ],
    (error, result) => {
      if (error) {
        console.error("Error en storeClient:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
      }

      const cliente = {
        id_cliente: result.insertId,
        id_usuario: id_usuario || null,
        nombre_cliente,
        apellido_cliente,
        telefono_cliente,
        direccion_cliente,
        ciudad,
        estado,
        codigo_postal,
      }
      res.status(201).json(cliente)
    },
  )
}

//// METODO PUT  ////
// Para actualizar
const updateClient = (req, res) => {
  const { id } = req.params
  const { nombre_cliente, apellido_cliente, telefono_cliente, direccion_cliente, ciudad, estado, codigo_postal } =
    req.body

  // ← ARREGLAR SQL: Faltaba coma y había error de sintaxis
  const sql =
    "UPDATE clientes SET nombre_cliente = ?, apellido_cliente = ?, telefono_cliente = ?, direccion_cliente = ?, ciudad = ?, estado = ?, codigo_postal = ? WHERE id_cliente = ?"

  db.query(
    sql,
    [nombre_cliente, apellido_cliente, telefono_cliente, direccion_cliente, ciudad, estado, codigo_postal, id],
    (error, result) => {
      if (error) {
        console.error("Error en updateClient:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "ERROR: El cliente a modificar no existe" })
      }

      res.json({
        id_cliente: id,
        nombre_cliente,
        apellido_cliente,
        telefono_cliente,
        direccion_cliente,
        ciudad,
        estado,
        codigo_postal,
      })
    },
  )
}

//// METODO DELETE ////
// Para eliminar
const destroyClient = (req, res) => {
  const { id } = req.params
  const sql = "DELETE FROM clientes WHERE id_cliente = ?"
  db.query(sql, [id], (error, result) => {
    if (error) {
      console.error("Error en destroyClient:", error)
      return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ERROR: El cliente a borrar no existe" })
    }
    res.json({ mensaje: "Cliente Eliminado" })
  })
}

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
  allClients,
  showClient,
  storeClient,
  updateClient,
  destroyClient,
}
