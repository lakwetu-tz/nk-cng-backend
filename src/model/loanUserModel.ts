import mongoose, { Schema, Document } from 'mongoose';

const LoanUserSchema: Schema = new Schema({
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
    Form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
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
    outstanding_loan: {
        type: Number,
         required: false,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    monthlyPayment: {
        type: Number,
        required: true,
    },
    totalPayment: {
        type: Number,
        required: true,
    },
    // list of terms
    terms: [
        {
            type: String,
            required: false,
        },


    ],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, 
     {
        timestamps: true,
        versionKey: false
    });

export default mongoose.model('LoanUser', LoanUserSchema)