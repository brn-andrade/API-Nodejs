import * as restify from 'restify';
import * as jwt from 'jsonwebtoken';

import { User } from '../users/users.model';
import { NotAuthorizedError } from 'restify-errors';
import { environment } from './../common/environment';

export const authenticate: restify.RequestHandler = (req, res, next) => {
    const { email, password } = req.body;

    User.findByEmail(email, '+password').then(user => {
        if (user && user.matches(password)) {

            //gerar token
            const token = jwt.sign({ sub: user.email, iss: 'meat-api' }, environment.security.jwt_secret);

            res.json({ name: user.name, email: user.email, token: token });
            return next(false);
        } else {
            return next(new NotAuthorizedError('Invalid Credentials'));
        }
    }).catch(next);
};
