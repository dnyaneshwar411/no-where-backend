import { requestLogger } from "./utils/logger";
import express, { Express } from "express";
import cors from "cors";
import routes from "./route";
import { errorConverter, errorHandler } from "./middleware/error.middleware";
// import compression from "compression";
// import { ApiError } from "./utils/ApiError";
// import { errorConverter, errorHandler } from "./middlewares/error";
import "./socket"

const app: Express = express();


app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/", requestLogger);

app.use(cors());
app.use("/", routes);

app.use(errorConverter);

app.use(errorHandler);

export { app };

// app.use(helmet());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(xss())
// app.use(mongoSanitize())

// app.use(compression());

// app.use("/v1", v1Routes);

// app.use((req, res, next) => {
//   next(new ApiError(404, "Not found"));
// });

// app.use(errorConverter);
//
// app.use(errorHandler);
