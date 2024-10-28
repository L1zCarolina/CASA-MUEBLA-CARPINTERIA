const mysql = require("mysql2");

//// CONEXION A LA BBDD ////
const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "casa_muebla_carpinteria"
});

connection.connect((error) => {
    if(error){
        return console.error(error);
    }
    console.log("Estamos conectados a la Base de Datos - Casa Muebla Carpinteria");
});

// EXPORTAR DEL MODULO LA FUNCION CONNECTION
module.exports = connection;