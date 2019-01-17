import * as restify from 'restify';
import { ForbiddenError } from 'restify-errors';

export const authorize: (...rules: string[]) => restify.RequestHandler = (...rules) => {
    return (req, res, next) => {
        if (req.authenticated !== undefined && req.authenticated.hasRule(...rules)) {
            next();
        } else {
            next(new ForbiddenError('Permission denied'));
        }
    };
};