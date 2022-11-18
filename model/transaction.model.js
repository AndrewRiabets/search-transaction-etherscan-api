import mongoose from "mongoose";
const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    blockNumber: {
      type: Number,
      required: true,
    },

    transactionId: {
      type: String,
      required: true,
    },
    senderAddress: {
      type: String,
      required: true,
    },
    recipientsAddress: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    transactionFee: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

const Transaction = model("Transaction", transactionSchema);
export default Transaction;
