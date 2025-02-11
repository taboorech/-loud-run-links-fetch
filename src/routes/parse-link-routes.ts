import { Router } from "express";
import { itsWork, parseLink } from "../controllers/parse-link-controller";

const createParseLinkRoutes = () => {
  const router = Router();

  router.get('/', itsWork);
  router.post('/', parseLink);

  return router;
}

export { createParseLinkRoutes };