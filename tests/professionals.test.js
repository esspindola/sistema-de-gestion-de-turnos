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

describe('Professionals', () => {
  let adminToken;
  let pacienteToken;
  let professionalId;

  beforeAll(async () => {
    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Admin',
      email: 'admin@prof.com',
      password: 'password123',
      role: 'admin',
    });
    adminToken = adminRes.body.data.token;

    const pacienteRes = await request(app).post('/api/auth/register').send({
      name: 'Paciente',
      email: 'paciente@prof.com',
      password: 'password123',
      role: 'paciente',
    });
    pacienteToken = pacienteRes.body.data.token;
  });

  it('POST /api/professionals - admin crea profesional', async () => {
    const res = await request(app)
      .post('/api/professionals')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Dra. López', specialty: 'Pediatría', email: 'dra.lopez@test.com' });
    expect(res.statusCode).toBe(201);
    professionalId = res.body.data._id;
  });

  it('POST /api/professionals - paciente no puede crear', async () => {
    const res = await request(app)
      .post('/api/professionals')
      .set('Authorization', `Bearer ${pacienteToken}`)
      .send({ name: 'Dr. X', specialty: 'Clínica', email: 'drx@test.com' });
    expect(res.statusCode).toBe(403);
  });

  it('GET /api/professionals - lista profesionales autenticado', async () => {
    const res = await request(app)
      .get('/api/professionals')
      .set('Authorization', `Bearer ${pacienteToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('GET /api/professionals?specialty=Pediatría - filtra por especialidad', async () => {
    const res = await request(app)
      .get('/api/professionals?specialty=Pediatría')
      .set('Authorization', `Bearer ${pacienteToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('PUT /api/professionals/:id - admin actualiza', async () => {
    const res = await request(app)
      .put(`/api/professionals/${professionalId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ phone: '1234567890' });
    expect(res.statusCode).toBe(200);
  });

  it('DELETE /api/professionals/:id - admin elimina', async () => {
    const res = await request(app)
      .delete(`/api/professionals/${professionalId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});
