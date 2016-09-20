import * as express from "express";
import * as bodyParser from "body-parser";
import * as methodOverride from "method-override";

const app: express.Application = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
//app.use(express.static(__dirname + '/public'));

const router = express.Router();
router.get('/transport', (req, res) => {
  res.json({ tube: 'broken', bus: 'slow', cycle: 'yes' }).end();
});

app.use(router);

var env = process.env.NODE_ENV || 'dev';
const port = 9090;

app.listen(port, () => {
  console.log("Express server listening on port %d in %s mode", port, env);
});

export const App = app;
