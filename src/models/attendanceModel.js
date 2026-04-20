'use strict';

let records = [];
let nextId = 1;

function getAll() {
  return [...records];
}

function getById(id) {
  return records.find((r) => r.id === id) || null;
}

function getByStudent(studentId) {
  return records.filter((r) => r.estudianteId === studentId);
}

function getByCourse(courseId) {
  return records.filter((r) => r.cursoId === courseId);
}

function create(data) {
  const record = {
    id: nextId++,
    estudianteId: data.estudianteId,
    cursoId: data.cursoId,
    fecha: data.fecha,
    presente: data.presente !== undefined ? data.presente : true,
    observaciones: data.observaciones || '',
    createdAt: new Date().toISOString(),
  };
  records.push(record);
  return record;
}

function update(id, data) {
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return null;
  records[index] = { ...records[index], ...data, id };
  return records[index];
}

function remove(id) {
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return false;
  records.splice(index, 1);
  return true;
}

function _reset() {
  records = [];
  nextId = 1;
}

module.exports = { getAll, getById, getByStudent, getByCourse, create, update, remove, _reset };
