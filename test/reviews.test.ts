import 'jest';
import * as request from 'supertest';

let url: string = (<any>global).url;

test('[GET] /reviews', () => {
    return request(url)
        .get('/reviews')
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        }).catch(fail);
});
