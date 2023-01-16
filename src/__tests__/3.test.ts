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
    });

    test('II. GET wrong id', async () => {
        await testServer.get('/api/users/wrong-id')
            .then((data) => {
                expect(data.statusCode).toEqual(400);
            });
    });

    test('II. POST 10 users', async () => {
        for (let i = 0; i < 10; i++) {
            await testServer.post('/api/users/')
                .send(user)
                .then((data) => {
                    ids.push(data.body.id);
                    expect(data.statusCode).toEqual(201);
                    expect(data.body.username).toEqual(user.username);
                    expect(data.body.age).toEqual(user.age);
                    expect(data.body.hobbies).toEqual(user.hobbies);
                });
        }
    });

    test('III. GET users', async () => {
        await  testServer.get('/api/users/')
            .then((data) => {
                expect(data.body.length).toEqual(10);
            });
    });

    test('IV. GET 10 users', async () => {
        for (let i = 0; i < ids.length; i++) {
            await  testServer.get('/api/users/' + ids[i])
                .then((data) => {
                    expect(data.statusCode).toEqual(200);
                    expect(data.body.username).toEqual(user.username);
                    expect(data.body.age).toEqual(user.age);
                    expect(data.body.hobbies).toEqual(user.hobbies);
                });
        }
    });

    test('V. PUT 10 users', async () => {
        for (let i = 0; i < ids.length; i++) {
            user.username = `New Name ${i}`;
            user.age = i + 1;
            await testServer.put('/api/users/' + ids[i])
                .send(user)
                .then((data) => {
                    expect(data.statusCode).toEqual(200);
                    expect(data.body.username).toEqual(`New Name ${i}`);
                    expect(data.body.age).toEqual(i + 1);
                });
        }
    });

    test('VI. GET 10 users', async () => {
        for (let i =0; i < ids.length; i++) {
            await  testServer.get('/api/users/' + ids[i])
                .then((data) => {
                    expect(data.statusCode).toEqual(200);
                    expect(data.body.username).toEqual(`New Name ${i}`);
                    expect(data.body.age).toEqual(i + 1);
                });
        }
    });

    test('VII. DELETE 10 users', async () => {
        for (let i = 0; i < ids.length; i++) {
            await  testServer.delete('/api/users/' + ids[i])
                .then((data) => {
                    expect(data.statusCode).toEqual(204);
                });
        }
    });

    test('VII. DELETE 10 users again', async () => {
        for (let i = 0; i < ids.length; i++) {
            await  testServer.delete('/api/users/' + ids[i])
                .then((data) => {
                    expect(data.statusCode).toEqual(404);
                });
        }
    });

    test('VIII. GET users', async () => {
        await  testServer.get('/api/users/')
            .then((data) => {
                expect(data.statusCode).toEqual(200);
                expect(data.body.length).toEqual(0);
                expect(data.body).toEqual([]);
            });
    });

    test('IX. GET 10 users', async () => {
        for (let i = 0; i < ids.length; i++) {
            await  testServer.get('/api/users/' + ids[i])
                .then((data) => {
                    expect(data.statusCode).toEqual(404);
                });
        }
    });

    test('X. Wrong ways', async () => {
        await testServer.get('/wrong-way/')
            .then((data) => {
                expect(data.statusCode).toEqual(404);
            });
        await testServer.post('/wrong-way/')
            .then((data) => {
                expect(data.statusCode).toEqual(404);
            });
        await testServer.put('/wrong-way/')
            .then((data) => {
                expect(data.statusCode).toEqual(404);
            });
        await testServer.patch('/wrong-way/')
            .then((data) => {
                expect(data.statusCode).toEqual(404);
            });
        await testServer.head('/wrong-way/')
            .then((data) => {
                expect(data.statusCode).toEqual(404);
            });
        await testServer.options('/wrong-way/')
            .then((data) => {
                expect(data.statusCode).toEqual(404);
            });
    });
})