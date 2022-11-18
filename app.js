import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import transactionsRouter from "./routes/transactionsRouter.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());
app.use(morgan("short"));
app.use(cors({ credentials: true }));
app.use(express.json());

//Routing
app.use("/api", transactionsRouter);

app.use(errorMiddleware);

export default app;
