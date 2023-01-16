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
const ids: string[] = [];

describe('test scenario 2', () => {
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
                ids.push(data.body.id);
                expect(data.statusCode).toEqual(201);
                expect(data.body.username).toEqual(user.username);
                expect(data.body.age).toEqual(user.age);
                expect(data.body.hobbies).toEqual(user.hobbies);
            });
    })

    test('III. POST', async () => {
        await testServer.post('/api/users/')
            .send(user)
            .then((data) => {
                ids.push(data.body.id);
                expect(data.statusCode).toEqual(201);
                expect(data.body.username).toEqual(user.username);
                expect(data.body.age).toEqual(user.age);
                expect(data.body.hobbies).toEqual(user.hobbies);
            });
    })

    test('IV. GET', async () => {
        await  testServer.get('/api/users/')
            .then((data) => {
                expect(data.body.length).toEqual(2);
            });
    })

    test('V. GET', async () => {
        await  testServer.get('/api/users/' + ids[0])
            .then((data) => {
                expect(data.statusCode).toEqual(200);
                expect(data.body.username).toEqual(user.username);
                expect(data.body.age).toEqual(user.age);
                expect(data.body.hobbies).toEqual(user.hobbies);
            });
    })

    test('VI. GET', async () => {
        await  testServer.get('/api/users/' + ids[1])
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
        await testServer.put('/api/users/' + ids[0])
            .send(user)
            .then((data) => {
                expect(data.statusCode).toEqual(200);
                expect(data.body.username).toEqual(user.username);
                expect(data.body.age).toEqual(user.age);
                expect(data.body.hobbies).toEqual(user.hobbies);
            });
    })


    test('VI. GET', async () => {
        await  testServer.get('/api/users/' + ids[1])
            .then((data) => {
                expect(data.statusCode).toEqual(200);
                expect(data.body.username).not.toEqual(user.username);
                expect(data.body.age).not.toEqual(user.age);
                expect(data.body.hobbies).toEqual(user.hobbies);
            });
    })


    test('VI. GET', async () => {
        await  testServer.get('/api/users/' + ids[0])
            .then((data) => {
                expect(data.statusCode).toEqual(200);
                expect(data.body.username).toEqual(user.username);
                expect(data.body.age).toEqual(user.age);
                expect(data.body.hobbies).toEqual(user.hobbies);
            });
    })

    test('VII. DELETE', async () => {
        await  testServer.delete('/api/users/' + ids[0])
            .then((data) => {
                expect(data.statusCode).toEqual(204);
            });
    })

    test('VIII. GET', async () => {
        await  testServer.get('/api/users/')
            .then((data) => {
                expect(data.statusCode).toEqual(200);
                expect(data.body.length).toEqual(1);
            });
    })

    test('IX. GET', async () => {
        await  testServer.get('/api/users/' + ids[0])
            .then((data) => {
                expect(data.statusCode).toEqual(404);
            });
    })

    test('X. GET', async () => {
        await  testServer.get('/api/users/' + ids[1])
            .then((data) => {
                expect(data.statusCode).toEqual(200);
            });
    })

    test('XI. DELETE', async () => {
        await  testServer.delete('/api/users/' + ids[1])
            .then((data) => {
                expect(data.statusCode).toEqual(204);
            });
    })

    test('XII. GET', async () => {
        await  testServer.get('/api/users/')
            .then((data) => {
                expect(data.statusCode).toEqual(200);
                expect(data.body).toEqual([]);
                expect(data.body.length).toEqual(0);
            });
    })

    test('XIII. GET', async () => {
        await  testServer.get('/api/users/' + ids[0])
            .then((data) => {
                expect(data.statusCode).toEqual(404);
            });
    })

    test('XIII. GET', async () => {
        await  testServer.get('/api/users/' + ids[1])
            .then((data) => {
                expect(data.statusCode).toEqual(404);
            });
    })
})