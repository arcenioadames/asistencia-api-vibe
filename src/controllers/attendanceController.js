'use strict';

const model = require('../models/attendanceModel');

function list(req, res) {
  res.json(model.getAll());
}

function getOne(req, res) {
  const record = model.getById(Number(req.params.id));
  if (!record) return res.status(404).json({ message: 'Registro de asistencia no encontrado' });
  res.json(record);
}

function byStudent(req, res) {
  res.json(model.getByStudent(Number(req.params.studentId)));
}

function byCourse(req, res) {
  res.json(model.getByCourse(Number(req.params.courseId)));
}

function create(req, res) {
  const { estudianteId, cursoId, fecha, presente, observaciones } = req.body;
  if (!estudianteId || !cursoId || !fecha) {
    return res.status(400).json({ message: 'estudianteId, cursoId y fecha son requeridos' });
  }
  const record = model.create({ estudianteId, cursoId, fecha, presente, observaciones });
  res.status(201).json(record);
}

function update(req, res) {
  const updated = model.update(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ message: 'Registro de asistencia no encontrado' });
  res.json(updated);
}

function remove(req, res) {
  const deleted = model.remove(Number(req.params.id));
  if (!deleted) return res.status(404).json({ message: 'Registro de asistencia no encontrado' });
  res.status(204).send();
}

module.exports = { list, getOne, byStudent, byCourse, create, update, remove };
