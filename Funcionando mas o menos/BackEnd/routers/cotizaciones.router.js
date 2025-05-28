// Cotizaciones.router.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/cotizaciones.controller");

router.post('/', controller.storeCotizacion);

module.exports = router;