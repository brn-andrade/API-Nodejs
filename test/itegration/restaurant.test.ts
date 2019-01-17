import 'jest';
import * as request from 'supertest';

const url: string = (<any>global).url;
const token: string = (<any>global).token;

test('[GET] /restaurants', () => {
    return request(url)
        .get('/restaurants')
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        }).catch(fail);
});

test('[GET] /restaurants/aaaaaaaaaaaa - Not Found', () => {
    return request(url)
        .get('/restaurants/aaaaaaaaaa')
        .then(response => {
            expect(response.status).toBe(404);
        }).catch(fail);
});

test('[POST] /restaurants', () => {
    return request(url)
        .post('/restaurants')
        .set('Authorization', token)
        .send({
            name: 'Burger House',
            menu: [{ name: 'coke', price: 4.5 }]
        })
        .then(response => {
            expect(response.status).toBe(201);
            expect(response.body.name).toBe('Burger House');
            expect(response.body.menu[0].name).toBe('coke');
            expect(response.body.menu[0].price).toBe(4.5);
        }).catch(fail);
});

test('[GET] /restaurants/:id', () => {
    return request(url)
        .post('/restaurants')
        .set('Authorization', token)
        .send({
            name: 'Burger House',
            menu: [{ name: 'coke', price: 4.5 }]
        })
        .then(response => request(url)
            .get(`/restaurants/${response.body._id}`)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.body.name).toBe('Burger House');
            })
        ).catch(fail);
});