import express from 'express';
import bodyParser from 'body-parser';
import { errorHandler } from './middleware/error-handler';
import cors from "cors";
import { createParseLinkRoutes } from './routes/parse-link-routes';

function createServer() {
  const app = express();

  app.use(cors({
    origin: [
      '*'
    ]
  }));

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('uploads'));

  // routes
  app.use('/link', createParseLinkRoutes());

  // error handler
  app.use(errorHandler);

  return app;
}

export { createServer };