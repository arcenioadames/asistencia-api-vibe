'use strict';

const { Router } = require('express');
const { randomUUID } = require('crypto');
const store = require('../models/store');

const router = Router();

const CODIGO_REGEX = /^EST\d{5}$/;

// POST /api/estudiantes - Crear un estudiante
router.post('/', (req, res) => {
  const { nombre, codigo } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El campo "nombre" es requerido.' });
  }

  if (!codigo || typeof codigo !== 'string') {
    return res.status(400).json({ error: 'El campo "codigo" es requerido.' });
  }

  if (!CODIGO_REGEX.test(codigo)) {
    return res.status(400).json({
      error: 'El código debe tener el formato EST seguido de 5 dígitos (ej. EST00123).',
    });
  }

  const existe = store.estudiantes.some((e) => e.codigo === codigo);
  if (existe) {
    return res.status(409).json({ error: `El código "${codigo}" ya está registrado.` });
  }

  const estudiante = {
    id: randomUUID(),
    nombre: nombre.trim(),
    codigo,
    creadoEn: new Date().toISOString(),
  };

  store.estudiantes.push(estudiante);
  return res.status(201).json(estudiante);
});

// GET /api/estudiantes - Listar todos los estudiantes
router.get('/', (req, res) => {
  return res.json(store.estudiantes);
});

// GET /api/estudiantes/:id - Obtener un estudiante por ID
router.get('/:id', (req, res) => {
  const estudiante = store.estudiantes.find((e) => e.id === req.params.id);
  if (!estudiante) {
    return res.status(404).json({ error: 'Estudiante no encontrado.' });
  }
  return res.json(estudiante);
});

module.exports = router;
