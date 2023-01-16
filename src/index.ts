import http from 'http';
import { v4 as uuid, validate as uuidValidate } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config()

export interface IUser {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}

let db: IUser[] = [];

const port = +process.env.PORT || 4000;
export const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
        res.setHeader('Content-type', 'application/json');
        if ((req.url.length <= 10 && req.url !== '/api/users') 
            || (req.url.length > 10 && req.url.substring(0, 11) !== '/api/users/') ) {
            show404();
        } else {
            let resData = '';
            switch(req.method) {
                case 'GET':
                    try {
                        get(req.url);
                    } catch {
                        show400();
                    }
                break;
                case 'POST': 
                    resData = '';
                    req.on('data', (chunk) => resData += chunk);
                    req.on('end', () => {
                        try {
                            if(req.url.length > 11) {
                                show400();
                            } else {
                                const data: Partial<IUser> = JSON.parse(resData);
                                post(data);
                            }
                        } catch {
                            show400();
                        }
                    })
                    req.on('error', show500);
                break;
                case 'PUT': 
                    resData = '';
                    req.on('data', (chunk) => resData += chunk);
                    req.on('end', () => {
                        try {
                            const data: Partial<IUser> = JSON.parse(resData);
                            put(req.url, data);
                        } catch {
                            show400();
                        }
                    })
                    req.on('error', show500);
                break;
                case 'DELETE':
                    try {
                        del(req.url);
                    } catch {
                        show400();
                    }
                break;
                default: show400();
            }
        }
    } catch {
        show500();
    }

    // Methods handlers
    function get(url: string) {
        if (url == '/api/users' || url == '/api/users/') {
            res.statusCode = 200;
            res.end(JSON.stringify(db));
            return
        }
        if (url.substring(11, url.length - 1).split('').includes('/')) {
            return show404();
        }
        const id = url[url.length - 1] == '/' 
            ? url.substring(11, url.length - 1) 
            : url.substring(11);
        if (uuidValidate(id)) {
            const user = db.find(el => el.id === id);
            if (!user) {
                show404();
            } else {
                res.statusCode = 200;
                res.end(JSON.stringify(user));
            }
        } else {
            show400();
        }
    }

    function post(user: Partial<IUser>) {
        if (!checkForValid(user)) {
            return show400();
        }
        const newUser: IUser = {
            id: uuid(),
            username: user.username,
            age: user.age,
            hobbies: user.hobbies
        }
        db.push(newUser);
        res.statusCode = 201;
        res.end(JSON.stringify(newUser));
    }

    function put(url: string, user: Partial<IUser>) {
        const id = url[url.length - 1] == '/' 
            ? url.substring(11, url.length - 1) 
            : url.substring(11);
        if (uuidValidate(id)) {
            const index = db.findIndex(el => el.id === id);
            if (index == -1) {
                return show404();
            }
            const newUser: IUser = {
                id: id,
                username: user.username,
                age: user.age,
                hobbies: user.hobbies
            }
            if (!checkForValid(newUser)) {
                return show400();
            }
            db[index] = newUser;
            res.statusCode = 200;
            res.end(JSON.stringify(newUser));
        } else {
            show400();
        }
    }

    function del(url: string) {
        const id = url[url.length - 1] == '/' 
            ? url.substring(11, url.length - 1) 
            : url.substring(11);
        if (!uuidValidate(id)) {
            return show400()
        }
        const index = db.findIndex(el => el.id === id);
        if (index == -1) {
            return show404();
        }
        db = db.filter((_, i) => i != index);
        res.statusCode = 204;
        res.end();
    }

    // Answers
    function show404 () {
        res.statusCode = 404;
        res.statusMessage = 'Not Found!';
        res.end(JSON.stringify({statusCode: 404, statusMessage: 'Not Found!'})) 
    }

    function show400 () {
        res.statusCode = 400;
        res.statusMessage = 'Wrong input!';
        res.end(JSON.stringify({statusCode: 400, statusMessage: 'Wrong input! Please check input data!'}))
    }

    function show500 () {
        res.statusCode = 500;
        res.statusMessage = 'Internal server error!';
        res.end(JSON.stringify({statusCode: 500, statusMessage: 'Internal server error!'})) 
    }

    // Other
    function checkForValid(user: Partial<IUser>): Boolean {
        const isCorrectName = user.username && typeof user.username === 'string';
        const isCorrectAge = user.age && typeof user.age === 'number';
        const isCorrectHobbies = user.hobbies && user.hobbies instanceof Array
            && user.hobbies.length === 0 || user.hobbies.every(el => typeof el === 'string');
        return isCorrectName && isCorrectAge && isCorrectHobbies;
    }
}).listen(port, 'localhost', () => {
    console.dir(`Sterted on port: ${port}`);
});
