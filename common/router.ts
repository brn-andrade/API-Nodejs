import * as restify from 'restify';
import { EventEmitter } from 'events';
import { NotFoundError } from 'restify-errors';

export abstract class Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server);

    envelope(document: any): any {
        return document;
    }

    envelopePaginate(documents: any[], options: any = {}): any {
        return documents;
    }

    render(response: restify.Response, next: restify.Next, options: any = {}) {
        return (document) => {

            if (document) {
                this.emit('beforeRender', document);

                response.json(this.envelope(document));
            } else {
                throw new NotFoundError('Documento não encontrado.');
            }
            return next(false);
        };
    }

    renderAll(response: restify.Response, next: restify.Next) {

        return (documents: any[]) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document);
                });
                response.json(documents);
            } else {
                response.json([]);
            }
            return next(false);
        };
    }

    renderPaginate(response: restify.Response, next: restify.Next, options: any = {}) {

        return (documents: any[]) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document);
                });
                response.json(this.envelopePaginate(documents, options));
            } else {
                response.json(this.envelopePaginate([]));
            }
            return next(false);
        };
    }
}
