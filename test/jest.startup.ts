import * as jestCli from 'jest-cli';
import * as mongoose from 'mongoose';

import { Server } from '../server/server';
import { environment } from '../common/environment';

import { reviewsRouter } from '../reviews/reviews.router';
import { usersRouter } from '../users/users.router';
import { restaurantsRouter } from '../restaurants/restaurants.router';

import { Review } from '../reviews/reviews.model';
import { User } from '../users/users.model';
import { Restaurant } from '../restaurants/restaurants.model';

let server: Server;

const beforeAllTests = () => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test';
    environment.server.port = process.env.SERVER_PORT || 3001;
    server = new Server();
    return server.bootstrap([
        usersRouter,
        reviewsRouter,
        restaurantsRouter
    ])
        .then(() => User.deleteMany({}).exec())
        .then(() => Review.deleteMany({}).exec())
        .then(() => Restaurant.deleteMany({}).exec())
        .then(() => mocks());
};
const afterAllTests = () => {
    return server.shutdown();
};

beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

const mocks = () => {

    //User Test
    let user = new User({
        _id: mongoose.Types.ObjectId('5c3a35c08af40f4170f230ec'),
        name: 'admin',
        email: 'admin@email.com',
        password: '123456',
        cpf: '866.302.860-14',
        rules: ['OWNER', 'ADMIN', 'USER']
    });

    user.save();

    //Restaurant and menu test

    let restaurant = new Restaurant({
        _id: mongoose.Types.ObjectId('5be8bc605d80fc0cc8dfba33'),
        name: 'Burger House',
        menu: [
            {
                _id: mongoose.Types.ObjectId('5be8c05531e52f2b34e937d1'),
                name: 'Pork Burger',
                price: 21.9
            },
            {
                _id: mongoose.Types.ObjectId('5be8c05531e52f2b34e937d0'),
                name: 'X Burger',
                price: 16.9
            }
        ],
    });

    restaurant.save();
};
