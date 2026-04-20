'use strict';

const request = require('supertest');
const app = require('../src/app');
const model = require('../src/models/courseModel');

beforeEach(() => {
  model._reset();
});

describe('GET /api/courses', () => {
  it('devuelve lista vacía cuando no hay cursos', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('devuelve la lista de cursos creados', async () => {
    model.create({ nombre: 'Matemáticas', codigo: 'MAT101' });
    model.create({ nombre: 'Física', codigo: 'FIS101' });

    const res = await request(app).get('/api/courses');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('GET /api/courses/:id', () => {
  it('devuelve el curso con el id indicado', async () => {
    const c = model.create({ nombre: 'Historia', codigo: 'HIS201', descripcion: 'Historia Universal' });

    const res = await request(app).get(`/api/courses/${c.id}`);
    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Historia');
    expect(res.body.codigo).toBe('HIS201');
  });

  it('devuelve 404 si el curso no existe', async () => {
    const res = await request(app).get('/api/courses/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Curso no encontrado');
  });
});

describe('POST /api/courses', () => {
  it('crea un nuevo curso con datos válidos', async () => {
    const payload = { nombre: 'Química', codigo: 'QUI101', descripcion: 'Química General' };
    const res = await request(app).post('/api/courses').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.nombre).toBe('Química');
    expect(res.body.codigo).toBe('QUI101');
  });

  it('devuelve 400 si faltan campos requeridos', async () => {
    const res = await request(app).post('/api/courses').send({ nombre: 'Sin Código' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/requeridos/);
  });

  it('descripcion es opcional y queda vacía por defecto', async () => {
    const res = await request(app).post('/api/courses').send({ nombre: 'Arte', codigo: 'ART101' });
    expect(res.status).toBe(201);
    expect(res.body.descripcion).toBe('');
  });
});

describe('PUT /api/courses/:id', () => {
  it('actualiza el curso existente', async () => {
    const c = model.create({ nombre: 'Biología', codigo: 'BIO101' });

    const res = await request(app).put(`/api/courses/${c.id}`).send({ nombre: 'Biología Avanzada' });
    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Biología Avanzada');
    expect(res.body.codigo).toBe('BIO101');
  });

  it('devuelve 404 si el curso no existe', async () => {
    const res = await request(app).put('/api/courses/999').send({ nombre: 'X' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/courses/:id', () => {
  it('elimina el curso existente', async () => {
    const c = model.create({ nombre: 'Inglés', codigo: 'ING101' });

    const res = await request(app).delete(`/api/courses/${c.id}`);
    expect(res.status).toBe(204);

    const check = await request(app).get(`/api/courses/${c.id}`);
    expect(check.status).toBe(404);
  });

  it('devuelve 404 si el curso no existe', async () => {
    const res = await request(app).delete('/api/courses/999');
    expect(res.status).toBe(404);
  });
});
