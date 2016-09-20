import * as express from "express";
import * as winston from "winston";

import {Response} from "./response.model";

type PathArgument = string | RegExp | (string | RegExp)[];
type NextFunction = (err?: any) => void;
type ResponseRequestHandler = (req: express.Request, res: express.Response, next: NextFunction) => Promise<Response>;

export abstract class RouterProvider {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
  }

  public get handler(): express.RequestHandler {
    return this.router;
  }

  public use(path: PathArgument, handler: ResponseRequestHandler | RouterProvider): void {
    let responseHandler: ResponseRequestHandler;
    if (handler instanceof RouterProvider) {
      responseHandler = handler.handler;
    } else {
      responseHandler = handler as ResponseRequestHandler;
    }
    this.router.use(path, this.wrapRequestHandler(responseHandler));
  }

  public get(path: PathArgument, handler: ResponseRequestHandler): void {
    this.router.get(path, this.wrapRequestHandler(handler));
  }

  public post(path: PathArgument, handler: ResponseRequestHandler): void {
    this.router.post(path, this.wrapRequestHandler(handler));
  }

  public delete(path: PathArgument, handler: ResponseRequestHandler): void {
    this.router.delete(path, this.wrapRequestHandler(handler));
  }

  public put(path: PathArgument, handler: ResponseRequestHandler): void {
    this.router.put(path, this.wrapRequestHandler(handler));
  }

  public options(path: PathArgument, handler: ResponseRequestHandler): void {
    this.router.options(path, this.wrapRequestHandler(handler));
  }

  public patch(path: PathArgument, handler: ResponseRequestHandler): void {
    this.router.patch(path, this.wrapRequestHandler(handler));
  }

  private wrapRequestHandler(handler: ResponseRequestHandler): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: NextFunction) => {
      let result = handler(req, res, next);
      if (!this.isPromise(result)) {
        // If the handler does not return a promise, we assume that it has handled the request successfully.
        // We don't need to call next() because we passed it to the handler, and not returning a Promise implies that
        // next() has already been called.
        return;
      }
      result
        .then((value: Response) => {
          if (value instanceof Response) {
            this.sendResponse(res, value);
          } else {
            winston.warn('Response not valid:', value);
            res.status(500).end();
          }
        })
        .catch((err: any) => {
          if (err instanceof Response) {
            this.sendResponse(res, err);
          } else {
            winston.warn('Uncaught error:', err);
            res.status(500).end();
          }
        });
    };
  }

  private sendResponse(res: express.Response, response: Response) {
    res.status(response.responseCode);
    if (response.body) {
      if (typeof response.body === 'object') {
        res.json(response.body);
      } else {
        res.send(response.body as string);
      }
    }
    res.end();
  }

  private isPromise(obj): boolean {
    if (!obj) {
      return false;
    }
    if (typeof obj !== 'object') {
      return false;
    }
    return typeof obj.then === 'function'
  }
}
