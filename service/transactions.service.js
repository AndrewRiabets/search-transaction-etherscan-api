import ContainDatabase from "../containDatabase/containDatabase.js";
import ApiError from "../error-hendling/api.error.js";
import TransactionOperations from "../repository/transaction.repository.js";

class TransactionsService {
  async getTransactions({ query, queryType }, params) {
    let transactions;
    switch (queryType) {
      case "getByHash":
        transactions = await TransactionOperations.getTransactionByHash(query);
        if (!transactions) {
          transactions = await ContainDatabase.getTransactionByHashFromAPI(
            query
          );
        }
        break;
      case "getByBlock":
        transactions = await TransactionOperations.getTransactionsByBlock(
          query,
          params
        );
        if (transactions.length == 0) {
          await ContainDatabase.getBlockByNumberFromAPI(query, true);
          transactions = await TransactionOperations.getTransactionsByBlock(
            query,
            params
          );
        }
        break;
      case "getBySender":
        transactions = await TransactionOperations.getTransactionsBySender(
          query,
          params
        );
        if (transactions.length == 0) {
          throw ApiError.NotAcceptable("Транзакции не найдены");
        }
        break;
      case "getByRecipient":
        transactions = await TransactionOperations.getTransactionByRecipient(
          query,
          params
        );
        if (transactions.length == 0) {
          throw ApiError.NotAcceptable("Транзакции не найдены");
        }
        break;
    }
    const latestBlock = await ContainDatabase.getLastBlockNumber();
    return { transactions, latestBlock };
  }
}

export default new TransactionsService();
