import ContainDatabase from "../containDatabase/containDatabase.js";
import ApiError from "../error-hendling/api.error.js";
import TransactionOperations from "../repository/transaction.repository.js";

class TransactionsService {
  async getTransactions({ query, queryType, page = 1, limit = 10 }) {
    const latestBlock = await ContainDatabase.getLastBlockNumber();
    let transactions;
    switch (queryType) {
      case "getByHash":
        transactions = await TransactionOperations.getTransactionByHash(query);
        if (!transactions) {
          await ContainDatabase.getTransactionByHashFromAPI(query);
          transactions = await TransactionOperations.getTransactionByHash(
            query
          );
        }
        break;
      case "getByBlock":
        transactions = await TransactionOperations.getTransactionsByBlock(
          query,
          page,
          limit
        );
        if (transactions.transactions.length == 0) {
          await ContainDatabase.getBlockByNumberFromAPI(query, true);
          transactions = await TransactionOperations.getTransactionsByBlock(
            query,
            page,
            limit
          );
        }
        break;
      case "getBySender":
        transactions = await TransactionOperations.getTransactionsBySender(
          query,
          page,
          limit
        );
        if (transactions.length == 0) {
          throw ApiError.NotAcceptable("Транзакции не найдены");
        }
        break;
      case "getByRecipient":
        transactions = await TransactionOperations.getTransactionByRecipient(
          query,
          page,
          limit
        );
        if (transactions.length == 0) {
          throw ApiError.NotAcceptable("Транзакции не найдены");
        }
        break;
    }
    const data = {
      transactions: transactions.transactions,
      pages: transactions.pages,
      latestBlock,
    };
    return data;
  }
}

export default new TransactionsService();
