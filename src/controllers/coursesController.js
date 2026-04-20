'use strict';

const model = require('../models/courseModel');

function list(req, res) {
  res.json(model.getAll());
}

function getOne(req, res) {
  const course = model.getById(Number(req.params.id));
  if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
  res.json(course);
}

function create(req, res) {
  const { nombre, codigo, descripcion } = req.body;
  if (!nombre || !codigo) {
    return res.status(400).json({ message: 'nombre y codigo son requeridos' });
  }
  const course = model.create({ nombre, codigo, descripcion });
  res.status(201).json(course);
}

function update(req, res) {
  const updated = model.update(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ message: 'Curso no encontrado' });
  res.json(updated);
}

function remove(req, res) {
  const deleted = model.remove(Number(req.params.id));
  if (!deleted) return res.status(404).json({ message: 'Curso no encontrado' });
  res.status(204).send();
}

module.exports = { list, getOne, create, update, remove };
