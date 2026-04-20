'use strict';

const { Router } = require('express');
const store = require('../models/store');

const router = Router();

// GET /api/reportes/ausentismo - Top 5 estudiantes con más ausencias
router.get('/ausentismo', (req, res) => {
  const conteoAusencias = {};

  store.asistencias
    .filter((a) => a.estado === 'ausente')
    .forEach((a) => {
      conteoAusencias[a.estudianteId] = (conteoAusencias[a.estudianteId] || 0) + 1;
    });

  const top5 = store.estudiantes
    .map((e) => ({
      estudiante: e,
      totalAusencias: conteoAusencias[e.id] || 0,
    }))
    .filter((entry) => entry.totalAusencias > 0)
    .sort((a, b) => b.totalAusencias - a.totalAusencias)
    .slice(0, 5);

  return res.json({ reporte: top5 });
});

module.exports = router;
