const mongoose = require('mongoose');
const assert = require('assert');
const axios = require('axios');
require('dotenv').config();

const api = axios.create({
    baseURL: 'http://localhost:'+process.env.PORT
});

describe('Async Test', () => {
    it('should resolve the promise', async () => {
        const promise = new Promise((resolve) => setTimeout(resolve, 100));
        await promise;
        assert.strictEqual(true, true);
    });
});

describe('App API', () => {
    const globalOptions = {};
    const user = {
        name: 'Ivan Strelkov',
        email: 'strelok@justcoders.ru',
        password: 'password123'
    };
    const task = {
        title: 'Test Task',
        description: 'This is a test task'
    };

    // Тесты для аутентификации
    describe('Auth API', () => {
        describe('POST /api/auth/register', () => {
            it('Регистрация пользователя (400 если пользователь существует)', async () => {
                const res = await api.post('/api/auth/register', user);
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.data, 'object');
                assert.ok(res.data.token);
                globalOptions.token = res.data.token; // Токен для дальнейшего тестирования
            });

            it('Регистрация пользователя должна НЕ пройти', async () => {
                const res = await api.post('/api/auth/register', user).catch(err=>err.response);
                assert.strictEqual(res.status, 400);
                assert.strictEqual(typeof res.data, 'object');
                assert.strictEqual(res.data.msg, 'User already exists');
            });
        });

        describe('POST /api/auth/login', () => {
            it('Должна пройти авторизация', async () => {
                const res = await api.post('/api/auth/login', user).catch(err=>err.response);
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.data, 'object');
                assert.ok(res.data.token);
                globalOptions.token = res.data.token; // Обновляем токен для дальнейшего тестирования
            });

            it('Авторизация НЕ должна пройти', async () => {
                const res = await api.post('/api/auth/login', { ...user, password: 'точноНеКорректен' }).catch(err=>err.response);
                assert.strictEqual(res.status, 400);
                assert.strictEqual(typeof res.data, 'object');
                assert.strictEqual(res.data.msg, 'Invalid credentials');
            });
        });
    });

    // Тесты для записей
    describe('Task API', () => {

        describe('POST /api/tasks', () => {
            it('Должен создасться новый таск', async () => {
                const res = await api.post('/api/tasks', task, {
                    headers: { "x-auth-token": globalOptions.token }
                });
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.data, 'object');
                assert.strictEqual(res.data.title, 'Test Task');
            });
        });

        describe('GET /api/tasks', () => {
            it('Все таски для пользователя (должна быть хотя-бы одна)', async () => {
                const res = await api.get('/api/tasks', {
                    headers: { "x-auth-token": globalOptions.token }
                });
                assert.strictEqual(res.status, 200);
                assert.strictEqual(Array.isArray(res.data), true);
                globalOptions.taskId = res.data[0]._id;
            });
        });

        describe('PUT /api/tasks/:id', () => {

            it('Таска должна обновиться', async () => {
                const updatedTask = {
                    title: 'Updated Task',
                    description: 'This task has been updated',
                    completed: true
                };
                const res = await api.put(`/api/tasks/${globalOptions.taskId}`, updatedTask, {
                    headers: { "x-auth-token": globalOptions.token }
                }).catch(err=>err.response);
                
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.data, 'object');
                assert.strictEqual(res.data.title, 'Updated Task');
                assert.strictEqual(res.data.completed, true);
            });
        });

        describe('DELETE /api/tasks/:id', () => {

            it('Таска должна удалиться', async () => {
                const res = await api.delete(`/api/tasks/${globalOptions.taskId}`, {
                    headers: { "x-auth-token": globalOptions.token }
                }).catch(err=>err.response);
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.data, 'object');
                assert.strictEqual(res.data.msg, 'Task removed');
            });
        });
    });

    after(async () => {
        //Не обязательно, но желательно
        await mongoose.connection.close();
    });
});
