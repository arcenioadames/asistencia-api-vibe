'use strict';

let courses = [];
let nextId = 1;

function getAll() {
  return [...courses];
}

function getById(id) {
  return courses.find((c) => c.id === id) || null;
}

function create(data) {
  const course = {
    id: nextId++,
    nombre: data.nombre,
    codigo: data.codigo,
    descripcion: data.descripcion || '',
    createdAt: new Date().toISOString(),
  };
  courses.push(course);
  return course;
}

function update(id, data) {
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return null;
  courses[index] = { ...courses[index], ...data, id };
  return courses[index];
}

function remove(id) {
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return false;
  courses.splice(index, 1);
  return true;
}

function _reset() {
  courses = [];
  nextId = 1;
}

module.exports = { getAll, getById, create, update, remove, _reset };
