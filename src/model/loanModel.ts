import mongoose, { Schema, Document } from 'mongoose';

const LoanSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    image: {
        type: String,
        required: false,
        trim: true
    },
    loan_reference: { //auto generate
        type: Number,
        required: false,
        unique: true,
        desc: "The reference of the loan"
    },
    loan_type: {
        type: String,
        enum: ['Maendeleo Bank Loan', 'NK CNG Automotive Loan']
    },
    total_loan_amount: {
        type: Number,
        default: 0,
        dec: "The total loan the user is applying for"
    },
    down_payment: {
        type: Boolean,
        default: false,
        desc: "The initial amount the user is required to pay"
    },
    weekly_payment: {
        type: Number,
        required: false,
        default: 0,
        desc: "The weekly payment the user is required to pay"
    },
    allowed_engine_cc: {
        type: String,
        required: false,
        default: 0,
        desc: "The allowed engine cc for the loan"
    }
},
    {
        timestamps: true,
        versionKey: false
    });

export default mongoose.model('Loan', LoanSchema);