'use strict';

const express = require('express');

const estudiantesRouter = require('./routes/estudiantes');
const asistenciasRouter = require('./routes/asistencias');
const reportesRouter = require('./routes/reportes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Gestión de Asistencia Estudiantil', version: '1.0.0' });
});

app.use('/api/estudiantes', estudiantesRouter);
app.use('/api/asistencias', asistenciasRouter);
app.use('/api/reportes', reportesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

module.exports = app;
