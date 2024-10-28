const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("../db/db");

const register = (req, res) => {
    const {nombre, apellido, email, password, rol} = req.body;
    const hash = bcrypt.hashSync(password, 8);

    const sql = "INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES (?,?,?,?,?)";
    db.query(sql, [nombre, apellido, email, hash, rol], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: No se pudo registrar el usuario"});
        }

        const token = jwt.sign({id: result.insertId}, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });

        res.status(201).send({auth: true, token});
    });
};

const login = (req, res) => {
    const {email, password} = req.body;

    const sql = "SELECT * FROM usuarios WHERE email = ?";
    db.query(sql, [email], (error, results) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }

        if(results.length === 0){
            return res.status(404).send("Usuario no encontrado.");
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if(!passwordIsValid){
            return res.status(401).send({auth: false, token: null});
        }

        const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });

        res.send({auth: true, token});
    });
};


module.exports = {
    register,
    login,
};