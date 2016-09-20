import * as express from 'express';

import {RouterProvider} from "../routes/router.provider";
import {TransportService} from "./transport.service";
import {Response} from "../routes/response.model";

export class TransportRouter extends RouterProvider {
  private transportService: TransportService;

  constructor() {
    super();

    this.transportService = new TransportService();

    this.use('/latest', this.getLatest.bind(this));
  }

  public getLatest(req: express.Request, res: express.Response): Promise<Response> {
    return this.transportService.getLatestTimes();
  }
}
