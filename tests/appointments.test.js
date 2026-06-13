import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import '../src/config/env.js';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Appointments', () => {
  let adminToken;
  let pacienteToken;
  let professionalId;
  let appointmentId;

  beforeAll(async () => {
    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    });
    adminToken = adminRes.body.data.token;

    const pacienteRes = await request(app).post('/api/auth/register').send({
      name: 'Paciente',
      email: 'paciente@test.com',
      password: 'password123',
      role: 'paciente',
    });
    pacienteToken = pacienteRes.body.data.token;

    const profRes = await request(app)
      .post('/api/professionals')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Dr. Smith', specialty: 'Cardiología', email: 'dr.smith@test.com' });
    professionalId = profRes.body.data._id;
  });

  it('POST /api/appointments - paciente crea turno', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${pacienteToken}`)
      .send({ professionalId, date: '2026-08-15', time: '10:00' });
    expect(res.statusCode).toBe(201);
    appointmentId = res.body.data._id;
  });

  it('POST /api/appointments - rechaza conflicto de horario', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${pacienteToken}`)
      .send({ professionalId, date: '2026-08-15', time: '10:00' });
    expect(res.statusCode).toBe(409);
  });

  it('GET /api/appointments/me - paciente ve sus turnos', async () => {
    const res = await request(app)
      .get('/api/appointments/me')
      .set('Authorization', `Bearer ${pacienteToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/appointments - admin ve todos los turnos', async () => {
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('PATCH /api/appointments/:id/status - admin cambia estado', async () => {
    const res = await request(app)
      .patch(`/api/appointments/${appointmentId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmado' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('confirmado');
  });

  it('GET /api/appointments - admin filtra por especialidad', async () => {
    const res = await request(app)
      .get('/api/appointments?specialty=Cardiología')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});
