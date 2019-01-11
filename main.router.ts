import * as restify from 'restify';
import { Router } from './common/router';

class MainRouter extends Router {
    applyRoutes(application: restify.Server) {
        application.get('/', (req, resp, next) => {
            resp.json({
                users: '/users',
                restarant: '/restaurants',
                reviews: '/reviews'
            });
        });
    }
}

export const mainRouter = new MainRouter();