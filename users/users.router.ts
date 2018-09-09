import { Router } from "../common/router";
import * as restify from 'restify';
import { User } from "./users.model";

class UsersRouter extends Router {
    applyRoutes(aplication: restify.Server) {

        aplication.get('/users', (req, resp, next) => {
            User.findAll().then(users => {
                resp.json(users);
                return next();
            })
        });

        aplication.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id).then(user => {
                if (user) {
                    resp.json(user);
                    return next();
                }

                resp.send(404)
                return next();
            });
        });
    }
}

export const usersRouter = new UsersRouter();
