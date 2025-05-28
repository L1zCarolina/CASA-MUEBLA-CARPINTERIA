// controllers/tareas.controller.js
const { pool } = require('../db/db');
const { errorHandler } = require('../middlewares/error.middleware');

// Obtener todas las tareas
const getAllTareas = async (req, res) => {
  try {
    const [tareas] = await pool.query(`
      SELECT *
      FROM tareas_empleados
      ORDER BY fecha_entrega ASC
    `);
    res.status(200).json(tareas);
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

// Obtener tareas de un empleado específico
const getTareasEmpleado = async (req, res) => {
  try {
    const { id_empleado } = req.params;
    const [tareas] = await pool.query(
      'SELECT * FROM tareas_empleados WHERE id_empleado = ? ORDER BY fecha_entrega ASC',
      [id_empleado]
    );
    res.status(200).json(tareas);
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

// Obtener las tareas del empleado autenticado
const getMisTareas = async (req, res) => {
  try {
    const id_empleado = req.user.id_usuario;
    const [tareas] = await pool.query(
      'SELECT * FROM tareas_empleados WHERE id_empleado = ? ORDER BY fecha_entrega ASC',
      [id_empleado]
    );
    res.status(200).json(tareas);
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

// Obtener una tarea específica
const getTarea = async (req, res) => {
  try {
    const { id_tarea } = req.params;
    const [tareas] = await pool.query(
      'SELECT * FROM tareas_empleados WHERE id_tarea = ?',
      [id_tarea]
    );
    if (tareas.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(200).json(tareas[0]);
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

// Crear una nueva tarea
const createTarea = async (req, res) => {
  try {
    const { id_empleado, id_pedido, descripcion, fecha_entrega, prioridad } = req.body;
    const [result] = await pool.query(
      `INSERT INTO tareas_empleados
         (id_empleado, id_pedido, descripcion, fecha_entrega, prioridad)
       VALUES (?,?,?,?,?)`,
      [id_empleado, id_pedido || null, descripcion, fecha_entrega, prioridad || 'media']
    );
    const [nueva] = await pool.query(
      'SELECT * FROM tareas_empleados WHERE id_tarea = ?',
      [result.insertId]
    );
    res.status(201).json(nueva[0]);
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

// Actualizar estado de una tarea
const updateEstadoTarea = async (req, res) => {
  try {
    const { id_tarea } = req.params;
    const { estado, porcentaje_avance, notas } = req.body;
    await pool.query(
      `UPDATE tareas_empleados
         SET estado = ?, porcentaje_avance = ?, notas = ?
       WHERE id_tarea = ?`,
      [estado, porcentaje_avance || 0, notas || null, id_tarea]
    );
    const [actualizada] = await pool.query(
      'SELECT * FROM tareas_empleados WHERE id_tarea = ?',
      [id_tarea]
    );
    res.status(200).json(actualizada[0]);
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

// Eliminar una tarea
const deleteTarea = async (req, res) => {
  try {
    const { id_tarea } = req.params;
    await pool.query('DELETE FROM tareas_empleados WHERE id_tarea = ?', [id_tarea]);
    res.status(200).json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

module.exports = {
  getAllTareas,
  getTareasEmpleado,
  getMisTareas,
  getTarea,
  createTarea,
  updateEstadoTarea,
  deleteTarea
};
