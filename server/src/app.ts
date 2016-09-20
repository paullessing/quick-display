import * as express from "express";
import * as bodyParser from "body-parser";
import * as methodOverride from "method-override";
import * as cors from "cors";

import {RootRouter} from "./root.router";

const app: express.Application = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
//app.use(express.static(__dirname + '/public'));

app.use(cors({ origin: 'http://localhost:4200' }));

app.use(new RootRouter().handler);

var env = process.env.NODE_ENV || 'dev';
const port = 9090;

app.listen(port, () => {
  console.log("Express server listening on port %d in %s mode", port, env);
});

export const App = app;
