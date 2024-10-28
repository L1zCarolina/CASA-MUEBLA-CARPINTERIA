import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle } from "lucide-react"

export default function Component() {
  const pasos = [
    {
      titulo: "Configuración del Proyecto",
      tareas: [
        "Inicializar un nuevo proyecto de Node.js",
        "Instalar dependencias necesarias",
        "Crear la estructura básica del servidor Express"
      ]
    },
    {
      titulo: "Diseño de la Base de Datos",
      tareas: [
        "Diseñar al menos 6 tablas relacionales",
        "Crear el esquema SQL para estas tablas",
        "Implementar la conexión a la base de datos en la aplicación Node.js"
      ]
    },
    {
      titulo: "Rutas y Controladores de la API",
      tareas: [
        "Crear archivos de rutas para cada entidad principal",
        "Implementar operaciones CRUD para cada entidad",
        "Configurar middleware de autenticación para rutas protegidas"
      ]
    },
    {
      titulo: "Autenticación de Usuarios",
      tareas: [
        "Implementar rutas de registro y inicio de sesión",
        "Utilizar JWT para la autenticación",
        "Crear middleware para proteger rutas que requieren autenticación"
      ]
    },
    {
      titulo: "Carga de Archivos",
      tareas: [
        "Configurar Multer para manejar la carga de archivos",
        "Crear rutas para subir y servir imágenes"
      ]
    },
    {
      titulo: "Pruebas y Documentación",
      tareas: [
        "Escribir pruebas unitarias para los endpoints de la API",
        "Crear documentación de la API usando una herramienta como Swagger",
        "Implementar manejo de errores y registro de logs"
      ]
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Plan de Implementación del Backend para el Sitio Web de Carpintería</h1>
      <div className="grid gap-4">
        {pasos.map((paso, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{paso.titulo}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {paso.tareas.map((tarea, tareaIndex) => (
                  <li key={tareaIndex} className="flex items-center">
                    <Circle className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{tarea}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}