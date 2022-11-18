import transactionsService from "../service/transactions.service.js";

class TransactionController {
  async getTransaction(req, res) {
    const transaction = await transactionsService.getTransactions(
      req.body,
      req.query
    );
    return res.status(201).json(transaction);
  }
}

export default new TransactionController();
