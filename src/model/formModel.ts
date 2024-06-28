import mongoose, { Document, Schema } from "mongoose";

const FormSchema: Schema = new Schema({
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    national_id: {
        type: String,
        require: false,
        trim: true
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
    vehicle_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: false
    },
    loan_type: {
        type: String,
        required: false,
        trim: true
    },
    cylinderSize: {
        type: String,
        require: false,
        
    },
    status: {
        type: String,
        required: false,
        trim: true
    },
    validated: {
        type: Boolean,
         default: false
    },
    id_front_face: {
        type: String,
        required: false

    },
    id_back_face: {
        type: String,
        required: false

    },
    agreed_terms: {
        type: Boolean,
        default: false
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

export default mongoose.model('Form', FormSchema)