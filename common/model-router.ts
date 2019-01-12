import { Router } from './router';
import * as mongoose from 'mongoose';
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {

    basePath: string;
    pageSize: number = 5;

    constructor(protected model: mongoose.Model<D>) {
        super();
        this.basePath = `/${model.collection.name}`;
    }

    protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
        return query;
    }
    envelope(document: any): any {
        let resource = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }

    envelopePaginate(documents: any[], options: any = {}): any {

        let last_page = Math.ceil(options.count / options.pageSize);

        const resource: any = {
            _links: {
                current_page: `${options.url}`,
                first_page: `${this.basePath}?_page=1`,
                last_page: `${this.basePath}?_page=${last_page}`
            },
            total: options.count,
            per_page: options.pageSize,
            current_page: options.page,
            last_page: last_page,
            items: documents,
        };
        if (options.page && options.count && options.pageSize) {
            if (options.page > 1) {
                resource._links.previous_page = `${this.basePath}?_page=${options.page - 1}`;
            } else {
                resource._links.previous_page = null;
            }

            if (last_page === options.page) {
                resource._links.next_page = null;
            } else {
                resource._links.next_page = `${this.basePath}?_page=${options.page + 1}`;
            }
        }
        return resource;
    }

    validateId = (req, resp, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Document not found'));
        } else {
            next();
        }
    }

    findAll = (req, resp, next) => {
        this.model.find()
            .then(this.renderAll(resp, next))
            .catch(next);
    }

    paginate = (req, resp, next) => {
        let page = parseInt(req.query._page || 1);
        page = page > 0 ? page : 1;

        const skip = (page - 1) * this.pageSize;

        this.model.countDocuments({}).exec()
            .then(count => this.model.find()
                .skip(skip)
                .limit(this.pageSize)
                .then(this.renderPaginate(resp, next, {
                    page,
                    count,
                    pageSize: this.pageSize,
                    url: req.url
                })))
            .catch(next);
    }

    findById = (req, resp, next) => {
        this.prepareOne(this.model.findById(req.params.id))
            .then(this.render(resp, next))
            .catch(next);
    }

    save = (req, resp, next) => {
        let model = new this.model(req.body);
        resp.status(201);
        model.save()
            .then(this.render(resp, next))
            .catch(next);
    }

    replace = (req, resp, next) => {
        const options = { runValidators: true, overwrite: true };
        this.model.update({ _id: req.params.id }, req.body, options)
            .exec().then(result => {
                if (result.n) {
                    this.model.findById(req.params.id);
                } else {
                    throw new NotFoundError('Documento não encontrado.');
                }
            }).then(this.render(resp, next))
            .catch(next);
    }

    update = (req, resp, next) => {
        const options = { runValidators: true, new: true };
        this.model.findByIdAndUpdate(req.params.id, req.body, options)
            .then(this.render(resp, next))
            .catch(next);
    }

    delete = (req, resp, next) => {
        this.model.deleteOne({ _id: req.params.id })
            .exec().then(cmdResult => {
                if (cmdResult.n) {
                    resp.send(204);
                } else {
                    throw new NotFoundError('Documento não encontrado.');
                }
                return next();
            }).catch(next);
    }
}