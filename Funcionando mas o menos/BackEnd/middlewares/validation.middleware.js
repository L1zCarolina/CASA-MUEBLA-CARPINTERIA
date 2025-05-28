const { body, param, validationResult } = require("express-validator")

// Función para manejar los errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// Función para combinar middlewares en uno solo
const combineMiddlewares = (middlewares) => {
  return (req, res, next) => {
    // Crear una copia del array de middlewares
    const middlewaresCopy = [...middlewares]

    // Función recursiva para ejecutar los middlewares en secuencia
    const executeMiddleware = (index) => {
      // Si hemos ejecutado todos los middlewares, llamamos a next()
      if (index === middlewaresCopy.length) {
        return next()
      }

      // Ejecutar el middleware actual
      middlewaresCopy[index](req, res, (err) => {
        // Si hay un error, lo pasamos a next()
        if (err) {
          return next(err)
        }

        // Si no hay error, ejecutamos el siguiente middleware
        executeMiddleware(index + 1)
      })
    }

    // Comenzar la ejecución de middlewares
    executeMiddleware(0)
  }
}

// Validaciones para productos
const validateProductoMiddlewares = [
  body("nombre_producto").notEmpty().withMessage("El nombre es obligatorio"),
  body("descripcion_producto").notEmpty().withMessage("La descripción es obligatoria"),
  body("precio").isNumeric().withMessage("El precio debe ser un número"),
  body("stock").isInt().withMessage("El stock debe ser un número entero"),
  body("id_categoria").isInt().withMessage("Debes seleccionar una categoría válida"),
  handleValidationErrors,
]

// Combinar los middlewares en uno solo
const validateProducto = combineMiddlewares(validateProductoMiddlewares)

// Validaciones para categorías
const validateCategoriaMiddlewares = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  handleValidationErrors,
]

// Combinar los middlewares en uno solo
const validateCategoria = combineMiddlewares(validateCategoriaMiddlewares)

// Validaciones para clientes
const validateClienteMiddlewares = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("El email debe tener un formato válido"),
  body("telefono").notEmpty().withMessage("El teléfono es obligatorio"),
  handleValidationErrors,
]

// Combinar los middlewares en uno solo
const validateCliente = combineMiddlewares(validateClienteMiddlewares)

// Validaciones para pedidos
const validatePedidoMiddlewares = [
  body("cliente_id").isInt().withMessage("El ID del cliente debe ser un número entero"),
  body("estado").notEmpty().withMessage("El estado es obligatorio"),
  body("total").isNumeric().withMessage("El total debe ser un número"),
  handleValidationErrors,
]

// Combinar los middlewares en uno solo
const validatePedido = combineMiddlewares(validatePedidoMiddlewares)

// Validaciones para detalles de pedidos
const validateDetallePedidoMiddlewares = [
  body("pedido_id").isInt().withMessage("El ID del pedido debe ser un número entero"),
  body("producto_id").isInt().withMessage("El ID del producto debe ser un número entero"),
  body("cantidad").isInt().withMessage("La cantidad debe ser un número entero"),
  body("precio_unitario").isNumeric().withMessage("El precio unitario debe ser un número"),
  handleValidationErrors,
]

// Combinar los middlewares en uno solo
const validateDetallePedido = combineMiddlewares(validateDetallePedidoMiddlewares)

// Validaciones para proveedores
const validateProveedorMiddlewares = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("contacto").notEmpty().withMessage("El contacto es obligatorio"),
  body("email").isEmail().withMessage("El email debe tener un formato válido"),
  body("telefono").notEmpty().withMessage("El teléfono es obligatorio"),
  handleValidationErrors,
]

// Combinar los middlewares en uno solo
const validateProveedor = combineMiddlewares(validateProveedorMiddlewares)

// Validaciones para materiales
const validateMaterialMiddlewares = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("unidad_medida").notEmpty().withMessage("La unidad de medida es obligatoria"),
  body("precio_unitario").isNumeric().withMessage("El precio unitario debe ser un número"),
  body("stock").isInt().withMessage("El stock debe ser un número entero"),
  body("proveedor_id").isInt().withMessage("El ID del proveedor debe ser un número entero"),
  handleValidationErrors,
]

// Combinar los middlewares en uno solo
const validateMaterial = combineMiddlewares(validateMaterialMiddlewares)

// Validaciones para relaciones producto-material
const validateProductoMaterialMiddlewares = [
  body("producto_id").isInt().withMessage("El ID del producto debe ser un número entero"),
  body("material_id").isInt().withMessage("El ID del material debe ser un número entero"),
  body("cantidad").isNumeric().withMessage("La cantidad debe ser un número"),
  handleValidationErrors,
]

// Combinar los middlewares en uno solo
const validateProductoMaterial = combineMiddlewares(validateProductoMaterialMiddlewares)

// Validaciones para usuarios
const validateUsuarioMiddlewares = [
  body("nombre_usuario").notEmpty().withMessage("El nombre es obligatorio"),
  body("email_usuario").isEmail().withMessage("El email debe tener un formato válido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  handleValidationErrors,
]

// Combinar los middlewares en uno solo
const validateUsuario = combineMiddlewares(validateUsuarioMiddlewares)

// Validaciones para cotizaciones
const validateCotizacionMiddlewares = [
  body("cliente_id").isInt().withMessage("El ID del cliente debe ser un número entero"),
  body("tipo_mueble").notEmpty().withMessage("El tipo de mueble es obligatorio"),
  body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
  handleValidationErrors,
]

// Combinar los middlewares en uno solo
const validateCotizacion = combineMiddlewares(validateCotizacionMiddlewares)

module.exports = {
  validateProducto,
  validateCategoria,
  validateCliente,
  validatePedido,
  validateDetallePedido,
  validateProveedor,
  validateMaterial,
  validateProductoMaterial,
  validateUsuario,
  validateCotizacion,
}
