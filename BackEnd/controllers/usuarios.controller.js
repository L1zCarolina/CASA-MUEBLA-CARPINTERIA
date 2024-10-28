const db = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
    const { nombre, apellido, email, password, rol } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = "INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [nombre, apellido, email, hashedPassword, rol], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Error al registrar usuario", error: err });
        }
        res.status(201).send({ message: "Usuario registrado exitosamente", userId: result.insertId });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM usuarios WHERE email = ?";
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Error en el servidor", error: err });
        }
        if (results.length === 0) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({ message: "Contraseña inválida" });
        }

        const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 horas
        });

        res.status(200).send({
            message: "Inicio de sesión exitoso",
            token: token,
            user: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                rol: user.rol
            }
        });
    });
};

exports.getAllUsers = (req, res) => {
    const query = "SELECT id, nombre, apellido, email, rol FROM usuarios";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Error al obtener usuarios", error: err });
        }
        res.status(200).send(results);
    });
};

exports.getUserById = (req, res) => {
    const id = req.params.id;
    const query = "SELECT id, nombre, apellido, email, rol FROM usuarios WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Error al obtener usuario", error: err });
        }
        if (results.length === 0) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
        res.status(200).send(results[0]);
    });
};

exports.updateUser = (req, res) => {
    const id = req.params.id;
    const { nombre, apellido, email, rol } = req.body;
    const query = "UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, rol = ? WHERE id = ?";
    db.query(query, [nombre, apellido, email, rol, id], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Error al actualizar usuario", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
        res.status(200).send({ message: "Usuario actualizado exitosamente" });
    });
};

exports.deleteUser = (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM usuarios WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Error al eliminar usuario", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
        res.status(200).send({ message: "Usuario eliminado exitosamente" });
    });
};