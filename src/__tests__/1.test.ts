import { IUser, server } from '..';
import supertest from 'supertest';

const testServer = supertest(server);

const user: Partial<IUser> = {
    username: 'username',
    age: 100500,
    hobbies: [
        'hobbies',
        'for',
        'test'
    ]
}
let id = '';

describe('test scenario 1', () => {
    test('I. GET', async () => {
        await testServer.get('/api/users/')
            .then((data) => {
                expect(data.statusCode).toEqual(200);
                expect(data.body).toEqual([]);
            });
    })

    test('II. POST', async () => {
        await testServer.post('/api/users/')
            .send(user)
            .then((data) => {
                id = data.body.id;
                expect(data.statusCode).toEqual(201);
                expect(data.body.username).toEqual(user.username);
                expect(data.body.age).toEqual(user.age);
                expect(data.body.hobbies).toEqual(user.hobbies);
            });
    })

    test('III. GET', async () => {
        await  testServer.get('/api/users/' + id)
            .then((data) => {
                expect(data.statusCode).toEqual(200);
                expect(data.body.username).toEqual(user.username);
                expect(data.body.age).toEqual(user.age);
                expect(data.body.hobbies).toEqual(user.hobbies);
            });
    })

    test('IV. PUT', async () => {
        user.username = 'New Name';
        user.age = 20;
        await testServer.put('/api/users/' + id)
            .send(user)
            .then((data) => {
                id = data.body.id;
                expect(data.statusCode).toEqual(200);
                expect(data.body.username).toEqual(user.username);
                expect(data.body.age).toEqual(user.age);
                expect(data.body.hobbies).toEqual(user.hobbies);
            });
    })

    test('V. DELETE', async () => {
        await  testServer.delete('/api/users/' + id)
            .then((data) => {
                expect(data.statusCode).toEqual(204);
            });
    })

    test('VI. GET', async () => {
        await  testServer.get('/api/users/' + id)
            .then((data) => {
                expect(data.statusCode).toEqual(404);
            });
    })
})