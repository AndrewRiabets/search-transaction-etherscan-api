import { Router } from "express";
import tryCatchWrapper from "../helpers/try.wrapper.js";
import TransactionsController from "../controllers/transactionController.js";
import { queryValidation } from "../middleware/query.validation.js";

const router = new Router();

router.get(
  "/get-transactions",
  queryValidation,
  tryCatchWrapper(TransactionsController.getTransaction)
);
export default router;
