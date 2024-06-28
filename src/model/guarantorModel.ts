import mongoose, { Document, Schema } from "mongoose";

const GuarantorSchema: Schema = new Schema({
    Form: {
        type: Schema.Types.ObjectId,
        ref: 'Form',
        required: false
    },
    // personal data
    first_name: {
        type: String,
        required: false,
        trim: true,
    },
    last_name: {
        type: String,
        required: false,
        trim: true,
    },
    phone: {
        type: String,
        required: false,
        trim: true,
    },
    email: {
        type: String,
        required: false,
        trim: true,
    },
    address: {
        ward: {
            type: String,
            required: false,
            trim: true,
        },
        city: {
            type: String,
            required: false,
            trim: true,
        },
        postal_code: {
            type: String,
            required: false,
            trim: true
        },
    },
    national_id: {
        type: String,
        require: false,
        trim: true
    },
    relationship: {
        type: String,
        required: false,
        trim: true
    },
    barua: {
        type: String,
        require: false
    },

    id_front_face: {
        type: String,
        required: false

    },
    id_back_face: {
        type: String,
        require: false,

    },

    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Guarantor', GuarantorSchema)