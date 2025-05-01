import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import User from '../models/User';

const testUser = {
  username: 'shyam5',
  email: 'shyam@gmail.com',
  password: 'shyam@123',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
});

afterAll(async () => {
await User.deleteMany({});
  await mongoose.disconnect();
});

describe('Authentication Flow', () => {
  it('create new user registration', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('user login sccessfully', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: testUser.username,
      password: testUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('write incorrect password during login time', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: testUser.username,
      password: 'WrongPassword123!',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('reset password ', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({
      email: testUser.email
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('reset password wrong email', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({
      email: "shyamgupta@gmail.com"
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
