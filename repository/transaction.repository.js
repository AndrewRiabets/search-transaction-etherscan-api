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
    const lookingTransaction = await Transaction.findOne({
      transactionId: query,
    });
    return lookingTransaction;
  }
  async getTransactionsByBlock(query, { page, limit }) {
    const lookingTransaction = await Transaction.find({ blockNumber: query })
      .skip((page - 1) * limit)
      .limit(limit);
    return lookingTransaction;
  }
  async getTransactionsBySender(query, { page, limit }) {
    const lookingTransaction = await Transaction.find({ senderAddress: query })
      .skip((page - 1) * limit)
      .limit(limit);
    return lookingTransaction;
  }
  async getTransactionByRecipient(query, { page, limit }) {
    const lookingTransaction = await Transaction.find({
      recipientsAddress: query,
    })
      .skip((page - 1) * limit)
      .limit(limit);
    return lookingTransaction;
  }
}

export default new TransactionOperations();
