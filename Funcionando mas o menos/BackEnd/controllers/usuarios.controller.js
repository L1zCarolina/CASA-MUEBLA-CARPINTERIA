/// CONTROLADORES DEL MODULO /// 

// Campos de la tabla usuarios
// id_usuario
// nombre_usuario
// email_usuario
// password
// fecha_registro
// foto_perfil
// rol

/// Controladores del modulo
// Importación de dependencias necesarias
const db = require("../db/db"); // Conexión a la base de datos
const bcrypt = require("bcryptjs"); // Para la encriptación de contraseñas
const jwt = require("jsonwebtoken"); // Para la creación de tokens JWT

//---------------- METODOS HTTP ---------------------///

/// METODO GET  ///

// Para obtener todos los usuarios
const allUsers = (req, res) => {
    const sql = "SELECT id_usuario, nombre_usuario, email_usuario, fecha_registro, foto_perfil, rol FROM usuarios";
    db.query(sql, (error, rows) => {
        if (error) return res.status(500).json({ error: "Error al obtener los usuarios" });
        res.json(rows);
    });
};

// Para obtener un usuario específico por su ID
const showUser = (req, res) => {
    const { id_usuario } = req.params;
    const sql = "SELECT id_usuario, nombre_usuario, email_usuario, fecha_registro, foto_perfil, rol FROM usuarios WHERE id_usuario = ?";
    db.query(sql, [id_usuario], (error, rows) => {
        if (error) return res.status(500).json({ error: "Error al obtener el usuario" });
        if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json(rows[0]);
    });
};

/// METODO POST  ///

// Para crear un nuevo usuario, incluyendo la subida de foto de perfil
const storeUser = (req, res) => {
    // Ver los datos recibidos en el body y el archivo subido (solo para depuración)
    console.log("Body recibido:", req.body);
    console.log("Archivo recibido:", req.file);

     // Manejar imagen de perfil (si se sube)
    //Si el usuario sube una imagen, el middleware multer guarda el archivo en la carpeta designada (por ejemplo, ./uploads) y el nombre del archivo se guarda en la base de datos como foto_perfil.
    const foto_perfil = req.file ? req.file.filename : null; //Si no se sube imagen, el valor de foto_perfil será null.

    // Desestructurar los datos del body  
    // Validación de datos del cuerpo de la solicitud:
    const { nombre_usuario, email_usuario, password, rol = "cliente" } = req.body; 

    // Validación de campos obligatorios
    //Se revisa que los campos obligatorios (nombre_usuario, email_usuario, password) estén presentes.
    if (!nombre_usuario || !email_usuario || !password) {
        return res.status(400).json({ 
            error: "Campos incompletos", 
            camposFaltantes: {
                nombre_usuario: !nombre_usuario ? "Falta el nombre_usuario" : undefined,
                email_usuario: !email_usuario ? "Falta el email_usuario" : undefined,
                password: !password ? "Falta la contraseña" : undefined
            }
        }); //Si faltan, se responde con un error 400 y un mensaje que indica los campos faltantes.
    }

    //Encriptación de la contraseña
    //Utilizamos bcrypt para encriptar la contraseña antes de almacenarla en la base de datos.
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: "Error al encriptar la contraseña" }); //Si ocurre un error durante la encriptación, se responde con un error 500.

        //Inserción en la base de datos
        // Crear la consulta SQL para insertar el usuario
        //Se utiliza la consulta SQL INSERT INTO para guardar los datos del nuevo usuario en la tabla usuarios.
        const sql = "INSERT INTO usuarios (nombre_usuario, email_usuario, password, foto_perfil, rol) VALUES (?, ?, ?, ?, ?)";

        // Ejecutar la consulta SQL
        db.query(sql, [nombre_usuario, email_usuario, hashedPassword, foto_perfil, rol], (error, result) => {
            if (error) return res.status(500).json({ error: "Error al registrar el usuario" }); //Si ocurre un error en la inserción (por ejemplo, duplicidad de correos), se devuelve un error 500.

            // Responder con los datos del usuario registrado (excluyendo la contraseña)
            res.status(201).json({ id_usuario: result.insertId, nombre_usuario, email_usuario, rol, foto_perfil }); //Si la operación es exitosa, se devuelve una respuesta con el código 201 y un objeto JSON que contiene los datos del usuario registrado.

            if (error) {
                console.error("Error al insertar el usuario:", error);
                return res.status(500).json({
                    error: "Error al registrar el usuario. Verifique que el correo no esté registrado."
                }); //Si el correo electrónico ya existe y la base de datos tiene una restricción de unicidad en el campo email_usuario, la consulta SQL fallará y generará un error. Este error es capturado y se devuelve un mensaje claro al cliente.
            }   
        });
    });
};

/// METODO PUT  ///

// Para actualizar un usuario completamente
const updateUser = (req, res) => {
    const { id_usuario } = req.params;
    const { nombre_usuario, email_usuario, password, rol } = req.body;
    const foto_perfil = req.file ? req.file.filename : null;

// Validación de campos faltantes
    const camposFaltantes = [];
    const camposRequeridos = ['nombre_usuario', 'email_usuario', 'password', 'rol'];

    camposRequeridos.forEach(campo => {
        if (!req.body[campo]) {
        camposFaltantes.push(campo);
        }
    });

    if (camposFaltantes.length > 0) {
        return res.status(400).json({
        message: 'Campos faltantes para actualizar el usuario.',
        camposFaltantes: camposFaltantes
        });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: "Error al encriptar la contraseña" });

        const sql = "UPDATE usuarios SET nombre_usuario=?, email_usuario=?, password=?, foto_perfil=?, rol=? WHERE id_usuario=?";
        db.query(sql, [nombre_usuario, email_usuario, hashedPassword, foto_perfil, rol, id_usuario], (error, result) => {
            if (error) return res.status(500).json({ error: "Error al actualizar el usuario" });
            if (result.affectedRows === 0) return res.status(404).json({ error: "Usuario no encontrado" });
            res.json({ id_usuario, nombre_usuario, email_usuario, rol, foto_perfil });
        });
    });
};

/// METODO PATCH ///

// Función para actualizar parcialmente un usuario
const updatePartialUser = (req, res) => {
    const { id_usuario } = req.params;
    const { nombre_usuario, email_usuario, rol } = req.body;
    const foto_perfil = req.file ? req.file.filename : null;

    const sql = "UPDATE usuarios SET nombre_usuario=?, email_usuario=?, foto_perfil=?, rol=? WHERE id_usuario=?";
    db.query(sql, [nombre_usuario, email_usuario, foto_perfil, rol, id_usuario], (error, result) => {
        if (error) return res.status(500).json({ error: "Error al actualizar parcialmente el usuario" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json({ id_usuario, nombre_usuario, email_usuario, rol, foto_perfil });
    });
};
/// METODO DELETE ///

// Para eliminar un usuario
const destroyUser = (req, res) => {
    const { id_usuario } = req.params;
    const sql = "DELETE FROM usuarios WHERE id_usuario=?";
    db.query(sql, [id_usuario], (error, result) => {
        if (error) return res.status(500).json({ error: "Error al eliminar el usuario" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json({ mensaje: "Usuario eliminado" });
    });
};

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = { 
    allUsers, 
    showUser, 
    storeUser, 
    updateUser, 
    updatePartialUser, 
    destroyUser 
};
