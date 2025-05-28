const mysql = require("mysql")
require("dotenv").config()

// Configuración de la conexión a la base de datos
const dbConfig = {
host: process.env.DB_HOST || "localhost",
user: process.env.DB_USER || "root",
password: process.env.DB_PASSWORD || "",
database: process.env.DB_NAME || "casa_muebla_carpinteria",
port: process.env.DB_PORT || 3306,
connectionLimit: 10,
connectTimeout: 20000,
acquireTimeout: 20000,
waitForConnections: true,
queueLimit: 0,
}

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig)

// Verificar conexión
pool.getConnection((err, connection) => {
if (err) {
    console.error("Error al conectar a la base de datos:", err)

    if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.error("Conexión a la base de datos perdida")
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
    console.error("La base de datos tiene demasiadas conexiones")
    }
    if (err.code === "ECONNREFUSED") {
    console.error("Conexión a la base de datos rechazada")
    }

    return
}

if (connection) {
    console.log("Conexión a la base de datos establecida correctamente")
    connection.release()
}
})

// Promisificar consultas para uso con async/await (opcional)
pool.queryPromise = (sql, params) => {
return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results) => {
    if (error) {
        return reject(error)
    }
    resolve(results)
    })
})
}

// Exportar el pool de conexiones
module.exports = pool