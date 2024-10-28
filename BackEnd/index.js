require('dotenv').config(); // Carga variables de entorno desde un archivo .env
const express = require('express');
const cors = require('cors'); //ayuda a manejar problemas de seguridad relacionados con solicitudes de diferentes dominios.
const morgan = require('morgan');//proporciona información valiosa sobre las solicitudes que llegan a tu API, lo que es crucial para el desarrollo y la depuración.
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// Importar rutas
const authRouter = require('./routers/auth.router');
const usuariosRouter = require('./routers/usuarios.router');
const productosRouter = require('./routers/productos.router');
const categoriasRouter = require('./routers/categorias.router');
const clientesRouter = require('./routers/clientes.router');
const pedidosRouter = require('./routers/pedidos.router');
const detallesPedidosRouter = require('./routers/detalles_pedidos.router');
const proveedoresRouter = require('./routers/proveedores.router');
const materialesRouter = require('./routers/materiales.router');
const productoMaterialRouter = require('./routers/producto_material.router');

// Middlewares
app.use(cors()); // Habilita Cross-Origin Resource Sharing (CORS)
app.use(morgan('dev')); // Registra las solicitudes HTTP para debugging
app.use(helmet()); // Añade headers de seguridad
app.use(compression()); // Comprime las respuestas del servidor
app.use(express.json()); // Parsea solicitudes con payloads JSON
app.use(express.urlencoded({extended:false})); // Parsea solicitudes con payloads codificados en URL

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/detalles-pedidos', detallesPedidosRouter);
app.use('/api/proveedores', proveedoresRouter);
app.use('/api/materiales', materialesRouter);
app.use('/api/producto-material', productoMaterialRouter);

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
