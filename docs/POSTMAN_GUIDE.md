# Guía de Pruebas con Postman — Asistencia API

## Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [Postman](https://www.postman.com/downloads/) instalado
- Dependencias del proyecto instaladas:

```bash
npm install
```

---

## 1. Iniciar el Servidor

```bash
npm start
```

El servidor quedará escuchando en `http://localhost:3000`.  
Puedes verificarlo abriendo `http://localhost:3000/api/health` en tu navegador; debes recibir:

```json
{ "status": "ok", "timestamp": "..." }
```

---

## 2. Importar la Colección en Postman

1. Abre Postman.
2. Haz clic en **Import** (botón superior izquierdo).
3. Selecciona el archivo `docs/postman_collection.json` incluido en este repositorio.
4. La colección **"Asistencia API"** aparecerá en el panel izquierdo.

### Configurar la variable de entorno `baseUrl`

La colección usa la variable `{{baseUrl}}` para todas las URLs.

1. Haz clic en el ícono de **Environments** (ojo) en la barra lateral.
2. Crea un nuevo entorno llamado **Local**.
3. Agrega una variable:
   - **Variable:** `baseUrl`
   - **Initial Value:** `http://localhost:3000`
   - **Current Value:** `http://localhost:3000`
4. Guarda y selecciona el entorno **Local** desde el selector en la esquina superior derecha.

---

## 3. Flujo de Prueba Recomendado

Sigue este orden para probar todos los recursos de manera coherente:

### Paso 1 — Verificar el servidor

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `{{baseUrl}}/api/health` | Verifica que el servidor esté en línea |

**Respuesta esperada (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-03-01T10:00:00.000Z"
}
```

---

### Paso 2 — Crear un Estudiante

| Método | URL | Body |
|--------|-----|------|
| POST | `{{baseUrl}}/api/students` | JSON |

**Body (JSON):**
```json
{
  "nombre": "Ana",
  "apellido": "Pérez",
  "matricula": "A001",
  "email": "ana.perez@universidad.edu"
}
```

**Respuesta esperada (201 Created):**
```json
{
  "id": 1,
  "nombre": "Ana",
  "apellido": "Pérez",
  "matricula": "A001",
  "email": "ana.perez@universidad.edu",
  "createdAt": "2024-03-01T10:00:00.000Z"
}
```

> 📝 Anota el `id` devuelto (ej.: `1`) para usarlo en los pasos siguientes.

---

### Paso 3 — Crear un Curso

| Método | URL | Body |
|--------|-----|------|
| POST | `{{baseUrl}}/api/courses` | JSON |

**Body (JSON):**
```json
{
  "nombre": "Matemáticas I",
  "codigo": "MAT101",
  "descripcion": "Álgebra y cálculo diferencial"
}
```

**Respuesta esperada (201 Created):**
```json
{
  "id": 1,
  "nombre": "Matemáticas I",
  "codigo": "MAT101",
  "descripcion": "Álgebra y cálculo diferencial",
  "createdAt": "2024-03-01T10:00:00.000Z"
}
```

---

### Paso 4 — Registrar Asistencia

| Método | URL | Body |
|--------|-----|------|
| POST | `{{baseUrl}}/api/attendance` | JSON |

**Body (JSON):**
```json
{
  "estudianteId": 1,
  "cursoId": 1,
  "fecha": "2024-03-01",
  "presente": true,
  "observaciones": "Llegó puntual"
}
```

**Respuesta esperada (201 Created):**
```json
{
  "id": 1,
  "estudianteId": 1,
  "cursoId": 1,
  "fecha": "2024-03-01",
  "presente": true,
  "observaciones": "Llegó puntual",
  "createdAt": "2024-03-01T10:00:00.000Z"
}
```

---

### Paso 5 — Consultar Asistencia por Estudiante

| Método | URL |
|--------|-----|
| GET | `{{baseUrl}}/api/attendance/student/1` |

**Respuesta esperada (200 OK):** Lista de registros del estudiante con `id=1`.

---

### Paso 6 — Consultar Asistencia por Curso

| Método | URL |
|--------|-----|
| GET | `{{baseUrl}}/api/attendance/course/1` |

**Respuesta esperada (200 OK):** Lista de registros del curso con `id=1`.

---

### Paso 7 — Actualizar un Registro de Asistencia

| Método | URL | Body |
|--------|-----|------|
| PUT | `{{baseUrl}}/api/attendance/1` | JSON |

**Body (JSON):**
```json
{
  "presente": false,
  "observaciones": "Ausente por enfermedad"
}
```

**Respuesta esperada (200 OK):**
```json
{
  "id": 1,
  "presente": false,
  "observaciones": "Ausente por enfermedad",
  ...
}
```

---

### Paso 8 — Eliminar Registros

| Método | URL | Respuesta |
|--------|-----|-----------|
| DELETE | `{{baseUrl}}/api/attendance/1` | 204 No Content |
| DELETE | `{{baseUrl}}/api/students/1` | 204 No Content |
| DELETE | `{{baseUrl}}/api/courses/1` | 204 No Content |

---

## 4. Referencia Completa de Endpoints

### Estudiantes `/api/students`

| Método | Ruta | Descripción | Body requerido |
|--------|------|-------------|----------------|
| GET | `/api/students` | Listar todos | — |
| GET | `/api/students/:id` | Obtener uno | — |
| POST | `/api/students` | Crear | `nombre`, `apellido`, `matricula` |
| PUT | `/api/students/:id` | Actualizar | Campos a modificar |
| DELETE | `/api/students/:id` | Eliminar | — |

**Campos del estudiante:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombre` | string | ✅ | Nombre del estudiante |
| `apellido` | string | ✅ | Apellido del estudiante |
| `matricula` | string | ✅ | Número de matrícula (único) |
| `email` | string | ❌ | Correo electrónico |

---

### Cursos `/api/courses`

| Método | Ruta | Descripción | Body requerido |
|--------|------|-------------|----------------|
| GET | `/api/courses` | Listar todos | — |
| GET | `/api/courses/:id` | Obtener uno | — |
| POST | `/api/courses` | Crear | `nombre`, `codigo` |
| PUT | `/api/courses/:id` | Actualizar | Campos a modificar |
| DELETE | `/api/courses/:id` | Eliminar | — |

**Campos del curso:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombre` | string | ✅ | Nombre del curso |
| `codigo` | string | ✅ | Código único del curso |
| `descripcion` | string | ❌ | Descripción del curso |

---

### Asistencia `/api/attendance`

| Método | Ruta | Descripción | Body requerido |
|--------|------|-------------|----------------|
| GET | `/api/attendance` | Listar todos | — |
| GET | `/api/attendance/:id` | Obtener uno | — |
| GET | `/api/attendance/student/:studentId` | Por estudiante | — |
| GET | `/api/attendance/course/:courseId` | Por curso | — |
| POST | `/api/attendance` | Registrar | `estudianteId`, `cursoId`, `fecha` |
| PUT | `/api/attendance/:id` | Actualizar | Campos a modificar |
| DELETE | `/api/attendance/:id` | Eliminar | — |

**Campos del registro de asistencia:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `estudianteId` | number | ✅ | ID del estudiante |
| `cursoId` | number | ✅ | ID del curso |
| `fecha` | string | ✅ | Fecha en formato `YYYY-MM-DD` |
| `presente` | boolean | ❌ | `true` (presente) o `false` (ausente). Por defecto `true` |
| `observaciones` | string | ❌ | Notas adicionales |

---

## 5. Códigos de Respuesta HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK — Solicitud exitosa |
| 201 | Created — Recurso creado correctamente |
| 204 | No Content — Eliminación exitosa |
| 400 | Bad Request — Faltan campos requeridos |
| 404 | Not Found — El recurso no existe |

---

## 6. Ejemplos de Errores

### 400 — Campo requerido faltante

```bash
POST /api/students
Body: { "nombre": "Solo nombre" }
```

```json
{
  "message": "nombre, apellido y matricula son requeridos"
}
```

### 404 — Recurso no encontrado

```bash
GET /api/students/999
```

```json
{
  "message": "Estudiante no encontrado"
}
```

---

## 7. Ejecutar Pruebas Unitarias

Las pruebas unitarias cubren los mismos endpoints y validan el comportamiento de la API sin necesidad de un servidor en ejecución.

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con detalle de cada prueba
npm run test:verbose
```

**Resultado esperado:**
```
PASS  tests/students.test.js
PASS  tests/courses.test.js
PASS  tests/attendance.test.js

Test Suites: 3 passed, 3 total
Tests:       37 passed, 37 total
```
