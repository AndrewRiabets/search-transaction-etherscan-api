import Transaction from "../model/transaction.model.js";

class TransactionOperations {
  async checkDB() {
    const db = await Transaction.exists();
    return db ? true : false;
  }

  async addTransactionToDB(dataToDb) {
    const newTransaction = await Transaction.create(dataToDb);
    return newTransaction;
  }

  async getTransactionByHash(query) {
    const pages = 1;
    const transactions = await Transaction.findOne({
      transactionId: query,
    });
    if (!transactions) {
      return null;
    }
    return { transactions: [transactions], pages };
  }
  async getTransactionsByBlock(query, page, limit) {
    const amountTransactions = await Transaction.find({
      blockNumber: query,
    }).countDocuments();
    const pages = Math.ceil(amountTransactions / limit);
    const transactions = await Transaction.find({ blockNumber: query })
      .skip((page - 1) * limit)
      .limit(limit);

    return { transactions, pages };
  }
  async getTransactionsBySender(query, page, limit) {
    const amountTransactions = await Transaction.find({
      senderAddress: query,
    }).countDocuments();
    const pages = Math.ceil(amountTransactions / limit);
    const transactions = await Transaction.find({ senderAddress: query })
      .skip((page - 1) * limit)
      .limit(limit);
    return { transactions, pages };
  }
  async getTransactionByRecipient(query, page, limit) {
    const amountTransactions = await Transaction.find({
      recipientsAddress: query,
    }).countDocuments();
    console.log(amountTransactions);
    const pages = Math.ceil(amountTransactions / limit);
    const transactions = await Transaction.find({
      recipientsAddress: query,
    })
      .skip((page - 1) * limit)
      .limit(limit);
    return { transactions, pages };
  }
}

export default new TransactionOperations();
