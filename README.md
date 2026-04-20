# asistencia-api-vibe

Plataforma de asistencia de estudiantes — REST API construida con Node.js + Express.

## Estructura del proyecto

```
.
├── src/
│   ├── app.js                  # Configuración de Express
│   ├── models/                 # Capa de datos en memoria
│   │   ├── studentModel.js
│   │   ├── courseModel.js
│   │   └── attendanceModel.js
│   ├── controllers/            # Lógica de negocio
│   │   ├── studentsController.js
│   │   ├── coursesController.js
│   │   └── attendanceController.js
│   └── routes/                 # Definición de rutas
│       ├── students.js
│       ├── courses.js
│       └── attendance.js
├── tests/                      # Pruebas unitarias (Jest + Supertest)
│   ├── students.test.js
│   ├── courses.test.js
│   └── attendance.test.js
├── docs/
│   ├── postman_collection.json # Colección importable en Postman
│   └── POSTMAN_GUIDE.md        # Guía de pruebas manuales con Postman
└── server.js                   # Punto de entrada
```

## Instalación

```bash
npm install
```

## Iniciar el servidor

```bash
npm start
```

El servidor corre en `http://localhost:3000`.

## Ejecutar pruebas unitarias

```bash
npm test
```

```bash
# Con detalle por cada caso de prueba
npm run test:verbose
```

## Endpoints disponibles

| Recurso | Ruta base |
|---------|-----------|
| Health | `GET /api/health` |
| Estudiantes | `/api/students` |
| Cursos | `/api/courses` |
| Asistencia | `/api/attendance` |

Consulta la [Guía de Postman](docs/POSTMAN_GUIDE.md) para ver todos los endpoints, ejemplos de peticiones y respuestas esperadas.
