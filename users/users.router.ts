import { authenticate } from './../security/auth.handler';
import { ModelRouter } from '../common/model-router';
import * as restify from 'restify';
import { User } from './users.model';
import { authorize } from '../security/authz.handler';

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User);
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }

    findByEmail = (req, res, next) => {
        if (req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => user ? [user] : [])
                .then(this.renderAll(res, next))
                .catch(next);
        } else {
            next();
        }
    }
    applyRoutes(application: restify.Server) {

        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            { version: '1.0.0', handler: [authorize('ADMIN', 'OWNER'), this.findAll] },
            { version: '2.0.0', handler: [authorize('ADMIN', 'OWNER'), this.findByEmail, this.findAll] },
            { version: '3.0.0', handler: [authorize('ADMIN', 'OWNER'), this.paginate] }
        ]));
        application.get(`${this.basePath}/:id`, [authorize('ADMIN', 'OWNER'), this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [authorize('ADMIN', 'OWNER', 'USER'), this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [authorize('ADMIN', 'OWNER', 'USER'), this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [authorize('ADMIN', 'OWNER'), this.validateId, this.delete]);
        application.post(`${this.basePath}/auth`, authenticate);
    }
}

export const usersRouter = new UsersRouter();
