'use strict';

const express = require('express');

const studentsRouter = require('./routes/students');
const coursesRouter = require('./routes/courses');
const attendanceRouter = require('./routes/attendance');

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/students', studentsRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/attendance', attendanceRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;
