import * as restify from 'restify';
import { ForbiddenError } from 'restify-errors';

export const authorize: (...rules: string[]) => restify.RequestHandler = (...rules) => {
    return (req, res, next) => {
        if ((<any>req).authenticated !== undefined && (<any>req).authenticated.hasRule(...rules)) {
            req.log.debug('User %s. - [%s.] Authozired',
            req.authenticated._id, req.authenticated.name);
            next();
        } else {
            if (req.authenticated) {
                req.log.debug('Permission denied for %s. - [%s.] Required profiles: %j. User rules? %j.',
                    req.authenticated._id, req.authenticated.name, rules, req.authenticated.rules);
            }
            next(new ForbiddenError('Permission denied'));
        }
    };
};