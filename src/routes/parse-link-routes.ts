import { Router } from "express";
import { parseLink } from "../controllers/parse-link-controller";

const createParseLinkRoutes = () => {
  const router = Router();

  router.post('/', parseLink);

  return router;
}

export { createParseLinkRoutes };