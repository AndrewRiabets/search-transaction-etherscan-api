import axios from "axios";
import ApiError from "../error-hendling/api.error.js";
import TransactionOperations from "../repository/transaction.repository.js";

const BASE_URL = process.env.API_SERVICE;
const API_KEY = process.env.API_KEY;

let counter = 0;

class ContainDatabase {
  async checkDB() {
    const isDbExist = await TransactionOperations.checkDB();
    if (!isDbExist) {
      this.populateDB();
    }
  }

  async getLastBlockNumber() {
    const { data } = await axios.get(BASE_URL, {
      params: {
        module: "proxy",
        action: "eth_blockNumber",
        apikey: API_KEY,
      },
    });
    if (data.result) {
      const lastBlockNumber = parseInt(data.result);
      return lastBlockNumber;
    } else {
      throw ApiError.NotAcceptable("Номер блоке не найден в API");
    }
  }

  async getTransactionByHashFromAPI(transactionHash) {
    const { data } = await axios.get(BASE_URL, {
      params: {
        module: "proxy",
        action: "eth_getTransactionByHash",
        txhash: transactionHash,
        apikey: API_KEY,
      },
    });
    const transactionData = data.result;
    if (!transactionData) {
      throw ApiError.NotAcceptable(
        "Транзакция не найдена, проверьте правильность вводимых данных"
      );
    }
    const blockData = await this.getBlockByNumberFromAPI(
      transactionData.blockNumber
    );
    const newTransactions = await this.pushTransactionToDB(
      blockData,
      transactionData
    );
    return newTransactions;
  }

  async getBlockByNumberFromAPI(number, reserch) {
    const { data } = await axios.get(BASE_URL, {
      params: {
        module: "proxy",
        action: "eth_getBlockByNumber",
        tag: Number(number).toString(16),
        boolean: true,
        apikey: API_KEY,
      },
    });
    if (!data.result) {
      throw ApiError.NotAcceptable("Не найден блок");
    }
    if (reserch) {
      const newTransactions = await this.pushTransactionToDB(data.result);
      return newTransactions;
    }
    return data.result;
  }
  async pushTransactionToDB(blockData, transactionData) {
    let dataToDb = [];
    if (transactionData) {
      dataToDb.push({
        blockNumber: parseInt(blockData.number),
        date: new Date(parseInt(blockData.timestamp) * 1000),
        transactionId: transactionData.hash,
        senderAddress: transactionData.from,
        recipientsAddress: transactionData.to,
        value: parseInt(transactionData.value) / 1e18,
        transactionFee:
          (parseInt(blockData.gasUsed) *
            (parseInt(blockData.baseFeePerGas) +
              parseInt(transactionData.gas))) /
          1e18,
      });
    } else {
      const transactionsFromBlock = blockData.transactions;
      transactionsFromBlock.map((t) => {
        console.log("hash", t.hash);
        dataToDb.push({
          blockNumber: parseInt(blockData.number),
          date: new Date(parseInt(blockData.timestamp) * 1000),
          transactionId: t.hash,
          senderAddress: t.from,
          recipientsAddress: t.to,
          value: parseInt(t.value) / 1e18,
          transactionFee:
            (parseInt(blockData.gasUsed) *
              (parseInt(blockData.baseFeePerGas) + parseInt(t.gas))) /
            1e18,
        });
      });
    }
    const newTransactions = await TransactionOperations.addTransactionToDB(
      dataToDb
    );
    return newTransactions;
  }

  async populateDB() {
    const newBlockNumber = await this.getLastBlockNumber();

    const newBlock = await this.getBlockByNumberFromAPI(newBlockNumber);
    await this.pushTransactionToDB(newBlock);
    if (counter <= 1000) {
      await this.sleep(5000);
      counter++;
      console.log(counter);
      this.populateDB();
    }
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

export default new ContainDatabase();
