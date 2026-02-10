import express from "express";
import { router as channelRoutes } from "./channel.route";

const router: express.Router = express.Router();

const routes = [{ path: "/channel", endpoints: channelRoutes }];

router.get("/", function(_, res: express.Response) {
  return res.status(200).json({
    status: 200,
    message: "Successfull",
  });
});

routes.forEach((route) => {
  router.use(route.path, route.endpoints);
});

export default router;
