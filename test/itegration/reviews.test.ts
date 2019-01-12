import 'jest';
import * as request from 'supertest';
import * as mongoose from 'mongoose';

let url: string = (<any>global).url;

test('[GET] /reviews', () => {
    return request(url)
        .get('/reviews')
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        }).catch(fail);
});

test('[GET] /reviews/:id', () => {
    return request(url)
        .post('/reviews')
        .send({
            date: new Date(),
            rating: 3,
            comments: 'testando',
            user: mongoose.Types.ObjectId('5c3a35c08af40f4170f230ec'),
            restaurant: mongoose.Types.ObjectId('5be8bc605d80fc0cc8dfba33'),
        })
        .then(response => request(url)
            .get(`/reviews/${response.body._id}`)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.body.rating).toBe(3);
                expect(response.body.comments).toBe('testando');
                expect(response.body.user._id).toBe('5c3a35c08af40f4170f230ec');
                expect(response.body.restaurant._id).toBe('5be8bc605d80fc0cc8dfba33');
            })
        ).catch(fail);
});

test('[GET] /reviews/aaaaaaaaaaaa - Not Found', () => {
    return request(url)
        .get('/reviews/aaaaaaaaaa')
        .then(response => {
            expect(response.status).toBe(404);
        }).catch(fail);
});

test('[POST] /reviews', () => {
    return request(url)
        .post('/reviews')
        .send({
            date: new Date(),
            rating: 3,
            comments: 'Ok',
            user: mongoose.Types.ObjectId('5c3a35c08af40f4170f230ec'),
            restaurant: mongoose.Types.ObjectId('5be8bc605d80fc0cc8dfba33'),
        })
        .then(response => {
            expect(response.status).toBe(201);
            expect(response.body.rating).toBe(3);
            expect(response.body.comments).toBe('Ok');
            expect(response.body.user).toBe('5c3a35c08af40f4170f230ec');
            expect(response.body.restaurant).toBe('5be8bc605d80fc0cc8dfba33');
        }).catch(fail);
});