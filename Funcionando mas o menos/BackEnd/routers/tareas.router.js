// routers/tareas.router.js
const express = require('express');
const router = express.Router();
const {
  getAllTareas,
  getTareasEmpleado,
  getMisTareas,
  getTarea,
  createTarea,
  updateEstadoTarea,
  deleteTarea
} = require('../controllers/tareas.controller');
const authMiddleware = require('../middlewares/auth.middleware');

//// ADMINISTRADORES ////
router.get('/', authMiddleware, getAllTareas);
router.get('/empleado/:id_empleado', authMiddleware, getTareasEmpleado);
router.post('/', authMiddleware, createTarea);
router.delete('/:id_tarea', authMiddleware, deleteTarea);

//// EMPLEADOS ////
router.get('/mis-tareas', authMiddleware, getMisTareas);
router.get('/:id_tarea', authMiddleware, getTarea);
router.put('/:id_tarea/estado', authMiddleware, updateEstadoTarea);

module.exports = router;
