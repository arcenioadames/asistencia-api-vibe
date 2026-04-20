'use strict';

let students = [];
let nextId = 1;

function getAll() {
  return [...students];
}

function getById(id) {
  return students.find((s) => s.id === id) || null;
}

function create(data) {
  const student = {
    id: nextId++,
    nombre: data.nombre,
    apellido: data.apellido,
    matricula: data.matricula,
    email: data.email,
    createdAt: new Date().toISOString(),
  };
  students.push(student);
  return student;
}

function update(id, data) {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;
  students[index] = { ...students[index], ...data, id };
  return students[index];
}

function remove(id) {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return false;
  students.splice(index, 1);
  return true;
}

// Utility for tests — resets in-memory state
function _reset() {
  students = [];
  nextId = 1;
}

module.exports = { getAll, getById, create, update, remove, _reset };
