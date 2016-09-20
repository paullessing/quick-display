import {RouterProvider} from "./routes/router.provider";
import {TransportRouter} from "./transport/transport.router";

export class RootRouter extends RouterProvider {
  constructor() {
    super();

    this.use('/transport', new TransportRouter());
  }
}
