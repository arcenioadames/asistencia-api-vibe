'use strict';

const model = require('../models/studentModel');

function list(req, res) {
  res.json(model.getAll());
}

function getOne(req, res) {
  const student = model.getById(Number(req.params.id));
  if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });
  res.json(student);
}

function create(req, res) {
  const { nombre, apellido, matricula, email } = req.body;
  if (!nombre || !apellido || !matricula) {
    return res.status(400).json({ message: 'nombre, apellido y matricula son requeridos' });
  }
  const student = model.create({ nombre, apellido, matricula, email });
  res.status(201).json(student);
}

function update(req, res) {
  const updated = model.update(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ message: 'Estudiante no encontrado' });
  res.json(updated);
}

function remove(req, res) {
  const deleted = model.remove(Number(req.params.id));
  if (!deleted) return res.status(404).json({ message: 'Estudiante no encontrado' });
  res.status(204).send();
}

module.exports = { list, getOne, create, update, remove };
