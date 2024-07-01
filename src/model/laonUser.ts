// this model linking between users and their loans 

const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
    },
    Loan: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Loan',
         required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
  interestRate: {
    type: Number,
    required: true,
  },
  term: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});