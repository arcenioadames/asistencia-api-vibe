'use strict';

const request = require('supertest');
const app = require('../src/app');
const attendanceModel = require('../src/models/attendanceModel');
const studentModel = require('../src/models/studentModel');
const courseModel = require('../src/models/courseModel');

beforeEach(() => {
  attendanceModel._reset();
  studentModel._reset();
  courseModel._reset();
});

function seedData() {
  const student = studentModel.create({ nombre: 'Ana', apellido: 'Pérez', matricula: 'A001', email: 'ana@test.com' });
  const course = courseModel.create({ nombre: 'Matemáticas', codigo: 'MAT101' });
  return { student, course };
}

describe('GET /api/attendance', () => {
  it('devuelve lista vacía cuando no hay registros', async () => {
    const res = await request(app).get('/api/attendance');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('devuelve todos los registros de asistencia', async () => {
    const { student, course } = seedData();
    attendanceModel.create({ estudianteId: student.id, cursoId: course.id, fecha: '2024-03-01', presente: true });
    attendanceModel.create({ estudianteId: student.id, cursoId: course.id, fecha: '2024-03-02', presente: false });

    const res = await request(app).get('/api/attendance');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('GET /api/attendance/:id', () => {
  it('devuelve el registro con el id indicado', async () => {
    const { student, course } = seedData();
    const record = attendanceModel.create({ estudianteId: student.id, cursoId: course.id, fecha: '2024-03-01', presente: true });

    const res = await request(app).get(`/api/attendance/${record.id}`);
    expect(res.status).toBe(200);
    expect(res.body.fecha).toBe('2024-03-01');
    expect(res.body.presente).toBe(true);
  });

  it('devuelve 404 si el registro no existe', async () => {
    const res = await request(app).get('/api/attendance/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/no encontrado/);
  });
});

describe('GET /api/attendance/student/:studentId', () => {
  it('devuelve los registros del estudiante indicado', async () => {
    const { student, course } = seedData();
    const otherStudent = studentModel.create({ nombre: 'Luis', apellido: 'Gómez', matricula: 'A002', email: 'luis@test.com' });

    attendanceModel.create({ estudianteId: student.id, cursoId: course.id, fecha: '2024-03-01', presente: true });
    attendanceModel.create({ estudianteId: student.id, cursoId: course.id, fecha: '2024-03-02', presente: false });
    attendanceModel.create({ estudianteId: otherStudent.id, cursoId: course.id, fecha: '2024-03-01', presente: true });

    const res = await request(app).get(`/api/attendance/student/${student.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    res.body.forEach((r) => expect(r.estudianteId).toBe(student.id));
  });

  it('devuelve lista vacía si el estudiante no tiene asistencia registrada', async () => {
    const res = await request(app).get('/api/attendance/student/999');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/attendance/course/:courseId', () => {
  it('devuelve los registros del curso indicado', async () => {
    const { student, course } = seedData();
    const otherCourse = courseModel.create({ nombre: 'Física', codigo: 'FIS101' });

    attendanceModel.create({ estudianteId: student.id, cursoId: course.id, fecha: '2024-03-01', presente: true });
    attendanceModel.create({ estudianteId: student.id, cursoId: otherCourse.id, fecha: '2024-03-01', presente: true });

    const res = await request(app).get(`/api/attendance/course/${course.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].cursoId).toBe(course.id);
  });
});

describe('POST /api/attendance', () => {
  it('crea un registro de asistencia con datos válidos', async () => {
    const { student, course } = seedData();
    const payload = { estudianteId: student.id, cursoId: course.id, fecha: '2024-03-01', presente: true, observaciones: 'Puntual' };

    const res = await request(app).post('/api/attendance').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.estudianteId).toBe(student.id);
    expect(res.body.cursoId).toBe(course.id);
    expect(res.body.presente).toBe(true);
    expect(res.body.observaciones).toBe('Puntual');
  });

  it('presente es true por defecto si no se envía', async () => {
    const { student, course } = seedData();
    const res = await request(app).post('/api/attendance').send({ estudianteId: student.id, cursoId: course.id, fecha: '2024-03-01' });
    expect(res.status).toBe(201);
    expect(res.body.presente).toBe(true);
  });

  it('devuelve 400 si faltan campos requeridos', async () => {
    const res = await request(app).post('/api/attendance').send({ estudianteId: 1 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/requeridos/);
  });
});

describe('PUT /api/attendance/:id', () => {
  it('actualiza un registro de asistencia existente', async () => {
    const { student, course } = seedData();
    const record = attendanceModel.create({ estudianteId: student.id, cursoId: course.id, fecha: '2024-03-01', presente: true });

    const res = await request(app).put(`/api/attendance/${record.id}`).send({ presente: false, observaciones: 'Ausente por enfermedad' });
    expect(res.status).toBe(200);
    expect(res.body.presente).toBe(false);
    expect(res.body.observaciones).toBe('Ausente por enfermedad');
  });

  it('devuelve 404 si el registro no existe', async () => {
    const res = await request(app).put('/api/attendance/999').send({ presente: false });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/attendance/:id', () => {
  it('elimina el registro de asistencia existente', async () => {
    const { student, course } = seedData();
    const record = attendanceModel.create({ estudianteId: student.id, cursoId: course.id, fecha: '2024-03-01', presente: true });

    const res = await request(app).delete(`/api/attendance/${record.id}`);
    expect(res.status).toBe(204);

    const check = await request(app).get(`/api/attendance/${record.id}`);
    expect(check.status).toBe(404);
  });

  it('devuelve 404 si el registro no existe', async () => {
    const res = await request(app).delete('/api/attendance/999');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/health', () => {
  it('devuelve status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
