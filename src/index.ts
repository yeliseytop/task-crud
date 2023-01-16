import http from 'http';
import { v4 as uuid, validate as uuidValidate } from 'uuid';

interface IUser {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}

const db: IUser[] = [];

const port = +process.env.PORT || 4000;
http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
        res.setHeader('Content-type', 'application/json');
        console.log(req.url, req.url.length);
        if ((req.url.length === 10 && req.url !== '/api/users') 
            || (req.url.length > 10 && req.url.substring(0, 11) !== '/api/users/') ) {
            show404();
        } else {
            switch(req.method) {
                case 'GET': get(req.url);
                break;
                case 'POST': 
                    let resData = '';
                    req.on('data', (chunk) => resData += chunk);
                    req.on('end', () => {
                        try {
                            const data = JSON.parse(resData) as Partial<IUser>;
                            post(req.url, data);
                        } catch {
                            show500();
                        }
                    })
                    req.on('error', show500);
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

    function post(url: string, user: Partial<IUser>) {
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
        return user ? true : false
    }
}).listen(port, 'localhost', () => {
    console.dir(`Sterted on port: ${port}`);
});
