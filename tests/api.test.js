'use strict';

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/models/store');

// Reset store before each test
beforeEach(() => {
  store.estudiantes.length = 0;
  store.asistencias.length = 0;
});

// ── Estudiantes ─────────────────────────────────────────────────────────────

describe('POST /api/estudiantes', () => {
  it('crea un estudiante con datos válidos', async () => {
    const res = await request(app)
      .post('/api/estudiantes')
      .send({ nombre: 'Juan Pérez', codigo: 'EST00001' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ nombre: 'Juan Pérez', codigo: 'EST00001' });
    expect(res.body.id).toBeDefined();
  });

  it('rechaza código con formato incorrecto', async () => {
    const res = await request(app)
      .post('/api/estudiantes')
      .send({ nombre: 'Ana López', codigo: 'EST123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/formato/i);
  });

  it('rechaza código duplicado', async () => {
    await request(app)
      .post('/api/estudiantes')
      .send({ nombre: 'Juan Pérez', codigo: 'EST00001' });

    const res = await request(app)
      .post('/api/estudiantes')
      .send({ nombre: 'Otro Estudiante', codigo: 'EST00001' });

    expect(res.status).toBe(409);
  });

  it('rechaza cuando falta el nombre', async () => {
    const res = await request(app)
      .post('/api/estudiantes')
      .send({ codigo: 'EST00002' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/estudiantes', () => {
  it('retorna lista vacía cuando no hay estudiantes', async () => {
    const res = await request(app).get('/api/estudiantes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('retorna lista con estudiantes registrados', async () => {
    await request(app)
      .post('/api/estudiantes')
      .send({ nombre: 'Juan Pérez', codigo: 'EST00001' });

    const res = await request(app).get('/api/estudiantes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe('GET /api/estudiantes/:id', () => {
  it('retorna el estudiante por ID', async () => {
    const created = await request(app)
      .post('/api/estudiantes')
      .send({ nombre: 'Juan Pérez', codigo: 'EST00001' });

    const res = await request(app).get(`/api/estudiantes/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.codigo).toBe('EST00001');
  });

  it('retorna 404 para ID inexistente', async () => {
    const res = await request(app).get('/api/estudiantes/id-que-no-existe');
    expect(res.status).toBe(404);
  });
});

// ── Asistencias ──────────────────────────────────────────────────────────────

describe('POST /api/asistencias', () => {
  let estudianteId;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/estudiantes')
      .send({ nombre: 'Juan Pérez', codigo: 'EST00001' });
    estudianteId = res.body.id;
  });

  it('registra una asistencia válida', async () => {
    const res = await request(app)
      .post('/api/asistencias')
      .send({ estudianteId, fecha: '2025-01-15', estado: 'presente' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ estudianteId, fecha: '2025-01-15', estado: 'presente' });
  });

  it('rechaza estado inválido', async () => {
    const res = await request(app)
      .post('/api/asistencias')
      .send({ estudianteId, fecha: '2025-01-15', estado: 'tarde' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/estado/i);
  });

  it('rechaza fecha futura', async () => {
    const res = await request(app)
      .post('/api/asistencias')
      .send({ estudianteId, fecha: '2099-12-31', estado: 'presente' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/futura/i);
  });

  it('rechaza formato de fecha incorrecto', async () => {
    const res = await request(app)
      .post('/api/asistencias')
      .send({ estudianteId, fecha: '15/01/2025', estado: 'presente' });

    expect(res.status).toBe(400);
  });

  it('rechaza asistencia duplicada para mismo estudiante y fecha', async () => {
    await request(app)
      .post('/api/asistencias')
      .send({ estudianteId, fecha: '2025-01-15', estado: 'presente' });

    const res = await request(app)
      .post('/api/asistencias')
      .send({ estudianteId, fecha: '2025-01-15', estado: 'ausente' });

    expect(res.status).toBe(409);
  });

  it('rechaza estudianteId inexistente', async () => {
    const res = await request(app)
      .post('/api/asistencias')
      .send({ estudianteId: 'id-inexistente', fecha: '2025-01-15', estado: 'presente' });

    expect(res.status).toBe(404);
  });
});

describe('GET /api/asistencias/estudiante/:id', () => {
  it('retorna asistencias del estudiante', async () => {
    const { body: estudiante } = await request(app)
      .post('/api/estudiantes')
      .send({ nombre: 'Ana López', codigo: 'EST00002' });

    await request(app)
      .post('/api/asistencias')
      .send({ estudianteId: estudiante.id, fecha: '2025-01-15', estado: 'ausente' });

    const res = await request(app).get(`/api/asistencias/estudiante/${estudiante.id}`);
    expect(res.status).toBe(200);
    expect(res.body.asistencias).toHaveLength(1);
    expect(res.body.estudiante.id).toBe(estudiante.id);
  });

  it('retorna 404 para estudiante inexistente', async () => {
    const res = await request(app).get('/api/asistencias/estudiante/no-existe');
    expect(res.status).toBe(404);
  });
});

// ── Reportes ─────────────────────────────────────────────────────────────────

describe('GET /api/reportes/ausentismo', () => {
  it('retorna top 5 estudiantes con más ausencias', async () => {
    // Create 6 students
    const estudiantes = [];
    for (let i = 1; i <= 6; i++) {
      const { body } = await request(app)
        .post('/api/estudiantes')
        .send({ nombre: `Estudiante ${i}`, codigo: `EST0000${i}` });
      estudiantes.push(body);
    }

    // Register absences: student 1 = 6 absences, student 2 = 5, ..., student 6 = 1
    for (let i = 0; i < estudiantes.length; i++) {
      const numAusencias = 6 - i;
      for (let d = 1; d <= numAusencias; d++) {
        const day = String(d).padStart(2, '0');
        await request(app)
          .post('/api/asistencias')
          .send({ estudianteId: estudiantes[i].id, fecha: `2025-01-${day}`, estado: 'ausente' });
      }
    }

    const res = await request(app).get('/api/reportes/ausentismo');
    expect(res.status).toBe(200);
    expect(res.body.reporte).toHaveLength(5);
    expect(res.body.reporte[0].totalAusencias).toBe(6);
    expect(res.body.reporte[0].estudiante.id).toBe(estudiantes[0].id);
  });

  it('retorna lista vacía cuando no hay ausencias', async () => {
    const res = await request(app).get('/api/reportes/ausentismo');
    expect(res.status).toBe(200);
    expect(res.body.reporte).toEqual([]);
  });
});
