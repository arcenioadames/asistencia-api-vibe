'use strict';

const { Router } = require('express');
const { randomUUID } = require('crypto');
const store = require('../models/store');

const router = Router();

const ESTADOS_VALIDOS = ['presente', 'ausente', 'justificada'];

// POST /api/asistencias - Registrar una asistencia
router.post('/', (req, res) => {
  const { estudianteId, fecha, estado } = req.body;

  if (!estudianteId) {
    return res.status(400).json({ error: 'El campo "estudianteId" es requerido.' });
  }

  if (!fecha) {
    return res.status(400).json({ error: 'El campo "fecha" es requerido.' });
  }

  if (!estado) {
    return res.status(400).json({ error: 'El campo "estado" es requerido.' });
  }

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({
      error: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}.`,
    });
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(fecha)) {
    return res.status(400).json({ error: 'La fecha debe tener el formato YYYY-MM-DD.' });
  }

  const fechaDate = new Date(fecha);
  if (isNaN(fechaDate.getTime())) {
    return res.status(400).json({ error: 'La fecha no es válida.' });
  }

  // Compare date without time: use UTC date parts from the ISO string
  const hoy = new Date();
  const hoyStr = hoy.toISOString().slice(0, 10);
  if (fecha > hoyStr) {
    return res.status(400).json({ error: 'La fecha no puede ser futura.' });
  }

  const estudiante = store.estudiantes.find((e) => e.id === estudianteId);
  if (!estudiante) {
    return res.status(404).json({ error: 'Estudiante no encontrado.' });
  }

  const duplicada = store.asistencias.some(
    (a) => a.estudianteId === estudianteId && a.fecha === fecha
  );
  if (duplicada) {
    return res.status(409).json({
      error: 'Ya existe una asistencia registrada para este estudiante en esa fecha.',
    });
  }

  const asistencia = {
    id: randomUUID(),
    estudianteId,
    fecha,
    estado,
    creadoEn: new Date().toISOString(),
  };

  store.asistencias.push(asistencia);
  return res.status(201).json(asistencia);
});

// GET /api/asistencias/estudiante/:id - Listar asistencias de un estudiante
router.get('/estudiante/:id', (req, res) => {
  const estudiante = store.estudiantes.find((e) => e.id === req.params.id);
  if (!estudiante) {
    return res.status(404).json({ error: 'Estudiante no encontrado.' });
  }

  const asistencias = store.asistencias
    .filter((a) => a.estudianteId === req.params.id)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  return res.json({ estudiante, asistencias });
});

module.exports = router;
