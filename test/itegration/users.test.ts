import 'jest';
import * as request from 'supertest';

const url: string = (<any>global).url;
const token: string = (<any>global).token;

test('[GET] /users', () => {
    return request(url)
        .get('/users')
        .set('Accept-Version', '1.0.0')
        .set('Authorization', token)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.header['api-version']).toBe('1.0.0');
            expect(response.body).toBeInstanceOf(Array);
        }).catch(fail);
});

test('[GET] /users/aaaaaaaaaaaaaa - Not Found', () => {
    return request(url)
        .get('/users/aaaaaaaaa')
        .set('Authorization', token)
        .then(response => {
            expect(response.status).toBe(404);
        }).catch(fail);
});

test('[POST] /users', () => {
    return request(url)
        .post('/users')
        .set('Authorization', token)
        .send({
            name: 'user1',
            email: 'user@user.com',
            password: '123456',
            cpf: '962.116.531-82'
        })
        .then(response => {
            expect(response.status).toBe(201);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('user1');
            expect(response.body.email).toBe('user@user.com');
            expect(response.body.cpf).toBe('962.116.531-82');
            expect(response.body.password).toBeUndefined();
        }).catch(fail);
});

test('[PATCH] /users/:id', () => {
    return request(url)
        .post('/users')
        .set('Authorization', token)
        .send({
            name: 'user2',
            email: 'user2@user.com',
            password: '123456'
        })
        .then(response => request(url)
            .patch(`/users/${response.body._id}`)
            .set('Authorization', token)
            .send({
                name: 'user2 - patch'
            })
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.body._id).toBeDefined();
                expect(response.body.name).toBe('user2 - patch');
                expect(response.body.email).toBe('user2@user.com');
                expect(response.body.password).toBeUndefined();
            })
        ).catch(fail);
});

test('[GET] /users - v2', () => {
    return request(url)
        .post('/users')
        .set('Authorization', token)
        .send({
            name: 'user3',
            email: 'user3@user.com',
            password: '123456'
        })
        .then(response => request(url)
            .get(`/users?email=${response.body.email}`)
            .set('Accept-Version', '2.0.0')
            .set('Authorization', token)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.header['api-version']).toBe('2.0.0');
                expect(response.body).toBeInstanceOf(Array);
            })
        ).catch(fail);
});

test('[GET] /users/:id', () => {
    return request(url)
        .post('/users')
        .set('Authorization', token)
        .send({
            name: 'user4',
            email: 'user4@user.com',
            password: '123456'
        })
        .then(response => request(url)
            .get(`/users/${response.body._id}`)
            .set('Authorization', token)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.body.name).toBe('user4');
                expect(response.body.email).toBe('user4@user.com');
                expect(response.body.password).toBeUndefined();
            })
        ).catch(fail);
});

test('[GET] /users - v3 Paginate', () => {
    return request(url)
        .get('/users')
        .set('Accept-Version', '3.0.0')
        .set('Authorization', token)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.header['api-version']).toBe('3.0.0');
            expect(response.body.items).toBeInstanceOf(Array);
        }).catch(fail);
});

test('[DELETE] /users/:id', () => {
    return request(url)
        .post('/users')
        .set('Authorization', token)
        .send({
            name: 'user5',
            email: 'user5@user.com',
            password: '123456'
        })
        .then(response => request(url)
            .delete(`/users/${response.body._id}`)
            .set('Authorization', token)
            .then(response => {
                expect(response.status).toBe(204);
            })
        ).catch(fail);
});