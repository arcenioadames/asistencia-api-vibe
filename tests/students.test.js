'use strict';

const request = require('supertest');
const app = require('../src/app');
const model = require('../src/models/studentModel');

beforeEach(() => {
  model._reset();
});

describe('GET /api/students', () => {
  it('devuelve lista vacía cuando no hay estudiantes', async () => {
    const res = await request(app).get('/api/students');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('devuelve la lista de estudiantes creados', async () => {
    model.create({ nombre: 'Ana', apellido: 'Pérez', matricula: 'A001', email: 'ana@test.com' });
    model.create({ nombre: 'Luis', apellido: 'Gómez', matricula: 'A002', email: 'luis@test.com' });

    const res = await request(app).get('/api/students');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('GET /api/students/:id', () => {
  it('devuelve el estudiante con el id indicado', async () => {
    const s = model.create({ nombre: 'Ana', apellido: 'Pérez', matricula: 'A001', email: 'ana@test.com' });

    const res = await request(app).get(`/api/students/${s.id}`);
    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Ana');
    expect(res.body.matricula).toBe('A001');
  });

  it('devuelve 404 si el estudiante no existe', async () => {
    const res = await request(app).get('/api/students/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Estudiante no encontrado');
  });
});

describe('POST /api/students', () => {
  it('crea un nuevo estudiante con datos válidos', async () => {
    const payload = { nombre: 'Carlos', apellido: 'Ruiz', matricula: 'B001', email: 'carlos@test.com' };
    const res = await request(app).post('/api/students').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.nombre).toBe('Carlos');
    expect(res.body.matricula).toBe('B001');
  });

  it('devuelve 400 si faltan campos requeridos', async () => {
    const res = await request(app).post('/api/students').send({ nombre: 'Solo' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/requeridos/);
  });

  it('devuelve 400 si el body está vacío', async () => {
    const res = await request(app).post('/api/students').send({});
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/students/:id', () => {
  it('actualiza el estudiante existente', async () => {
    const s = model.create({ nombre: 'Pedro', apellido: 'Lima', matricula: 'C001', email: 'pedro@test.com' });

    const res = await request(app).put(`/api/students/${s.id}`).send({ nombre: 'Pedro Actualizado' });
    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Pedro Actualizado');
    expect(res.body.matricula).toBe('C001');
  });

  it('devuelve 404 si el estudiante no existe', async () => {
    const res = await request(app).put('/api/students/999').send({ nombre: 'X' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/students/:id', () => {
  it('elimina el estudiante existente', async () => {
    const s = model.create({ nombre: 'Eva', apellido: 'Cruz', matricula: 'D001', email: 'eva@test.com' });

    const res = await request(app).delete(`/api/students/${s.id}`);
    expect(res.status).toBe(204);

    const check = await request(app).get(`/api/students/${s.id}`);
    expect(check.status).toBe(404);
  });

  it('devuelve 404 si el estudiante no existe', async () => {
    const res = await request(app).delete('/api/students/999');
    expect(res.status).toBe(404);
  });
});
