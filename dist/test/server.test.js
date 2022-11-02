"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("../src"));
const bun_test_1 = require("bun:test");
const router_test_1 = __importDefault(require("./router.test"));
const app = (0, src_1.default)();
app.get('/', (req, res) => {
    res.status(200).send('GET /');
});
app.put('/', (req, res) => {
    res.status(200).send('PUT /');
});
app.post('/', (req, res) => {
    res.status(200).send('POST /');
});
app.delete('/', (req, res) => {
    res.status(200).send('DELETE /');
});
app.options('/', (req, res) => {
    res.status(200).send('OPTIONS /');
});
app.use('/route', router_test_1.default);
app.use((req, res, next) => {
    next();
});
app.use((req, res, next) => {
    next();
});
app.get('/mid', (req, res, next) => {
    res.status(200).send('Middleware /mid');
}, (req, res) => { });
app.get('/err', (req, res) => {
    throw new Error('Err');
});
//add error handler 
app.use((req, res, next, err) => {
    res.status(500).send('Err /err');
});
const BASE_URL = 'http://localhost:3000';
(0, bun_test_1.describe)('http test', () => {
    (0, bun_test_1.it)('GET', async () => {
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
        });
        try {
            const res = await fetch(BASE_URL);
            (0, bun_test_1.expect)(res.status).toBe(200);
            (0, bun_test_1.expect)(await res.text()).toBe('GET /');
        }
        catch (e) {
            throw e;
        }
        finally {
            server.stop();
        }
    });
    (0, bun_test_1.it)('POST', async () => {
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
        });
        try {
            const res = await fetch(BASE_URL, { method: 'POST' });
            (0, bun_test_1.expect)(res.status).toBe(200);
            (0, bun_test_1.expect)(await res.text()).toBe('POST /');
        }
        catch (e) {
            throw e;
        }
        finally {
            server.stop();
        }
    });
    (0, bun_test_1.it)('PUT', async () => {
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
        });
        try {
            const res = await fetch(BASE_URL, { method: 'PUT' });
            (0, bun_test_1.expect)(res.status).toBe(200);
            (0, bun_test_1.expect)(await res.text()).toBe('PUT /');
        }
        catch (e) {
            throw e;
        }
        finally {
            server.stop();
        }
    });
    // Delete is not working for bun, check (issues-667)[https://github.com/oven-sh/bun/issues/677]
    // it('DELETE', async () => {
    //     const server = app.listen(3000, () => {
    //         console.log('App is listening on port 3000');
    //     });
    //     try {
    //         const res = await fetch(BASE_URL, { method: 'DELETE' });
    //         expect(res.status).toBe(200);
    //         expect(await res.text()).toBe('DELETE /')
    //     } catch (e) {
    //         throw e;
    //     } finally {
    //         server.stop();
    //     }
    // });
    (0, bun_test_1.it)('OPTIONS', async () => {
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
        });
        try {
            const res = await fetch(BASE_URL, { method: 'OPTIONS' });
            (0, bun_test_1.expect)(res.status).toBe(200);
            (0, bun_test_1.expect)(await res.text()).toBe('OPTIONS /');
        }
        catch (e) {
            throw e;
        }
        finally {
            server.stop();
        }
    });
});
(0, bun_test_1.describe)('router-test', () => {
    const url = BASE_URL + '/route';
    (0, bun_test_1.it)('/route', () => {
        (0, bun_test_1.it)('GET', async () => {
            const server = app.listen(3000, () => {
                console.log('App is listening on port 3000');
            });
            try {
                const res = await fetch(url);
                (0, bun_test_1.expect)(res.status).toBe(200);
                (0, bun_test_1.expect)(await res.text()).toBe('GET /route');
            }
            catch (e) {
                throw e;
            }
            finally {
                server.stop();
            }
        });
        (0, bun_test_1.it)('POST', async () => {
            const server = app.listen(3000, () => {
                console.log('App is listening on port 3000');
            });
            try {
                const res = await fetch(url, { method: 'POST' });
                (0, bun_test_1.expect)(res.status).toBe(200);
                (0, bun_test_1.expect)(await res.text()).toBe('POST /route');
            }
            catch (e) {
                throw e;
            }
            finally {
                server.stop();
            }
        });
        (0, bun_test_1.it)('PUT', async () => {
            const server = app.listen(3000, () => {
                console.log('App is listening on port 3000');
            });
            try {
                const res = await fetch(url, { method: 'PUT' });
                (0, bun_test_1.expect)(res.status).toBe(200);
                (0, bun_test_1.expect)(await res.text()).toBe('PUT /route');
            }
            catch (e) {
                throw e;
            }
            finally {
                server.stop();
            }
        });
        // Delete is not working for bun, check (issues-667)[https://github.com/oven-sh/bun/issues/677]
        // it('DELETE', async () => {
        //     const server = app.listen(3000, () => {
        //         console.log('App is listening on port 3000');
        //     });
        //     try {
        //         const res = await fetch(BASE_URL, { method: 'DELETE' });
        //         expect(res.status).toBe(200);
        //         expect(await res.text()).toBe('DELETE /')
        //     } catch (e) {
        //         throw e;
        //     } finally {
        //         server.stop();
        //     }
        // });
        (0, bun_test_1.it)('OPTIONS', async () => {
            const server = app.listen(3000, () => {
                console.log('App is listening on port 3000');
            });
            try {
                const res = await fetch(url, { method: 'OPTIONS' });
                (0, bun_test_1.expect)(res.status).toBe(200);
                (0, bun_test_1.expect)(await res.text()).toBe('OPTIONS /route');
            }
            catch (e) {
                throw e;
            }
            finally {
                server.stop();
            }
        });
    });
});
(0, bun_test_1.describe)('middleware test', () => {
    (0, bun_test_1.it)('middleware /', async () => {
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
        });
        try {
            const res = await fetch(BASE_URL + '/mid', { method: 'GET' });
            (0, bun_test_1.expect)(res.status).toBe(200);
            (0, bun_test_1.expect)(await res.text()).toBe('Middleware /mid');
        }
        catch (e) {
            throw e;
        }
        finally {
            server.stop();
        }
    });
});
(0, bun_test_1.describe)('Error test', () => {
    (0, bun_test_1.it)('error /err', async () => {
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
        });
        try {
            const res = await fetch(BASE_URL + '/err', { method: 'GET' });
            (0, bun_test_1.expect)(res.status).toBe(500);
            (0, bun_test_1.expect)(await res.text()).toBe('Err /err');
        }
        catch (e) {
            //throw e;
        }
        finally {
            server.stop();
        }
    });
});
