import mongoose, { Schema, Document } from 'mongoose';

const UserSchema: Schema = new Schema({
    // auth staff
    email: {
        type: String,
        required: false,
        // unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 8, 
    },
    phone: {
        type: String,
        required: true,
        trim: true, 
        unique: true, 
    },
    name: {
        type: String,
        required: false,
        trim: true
    },
    status: {
        type: String,
        default: "InActive",
    },
    profile_picture: {
        type: String,
         required: false,
    },
    is_form_submitted: {
        type: Boolean,
        default: false
    },
    send_sms_notifications: {
        type: Boolean,
        default: true
    } ,
    otp: {
        type: String,
        required: false,
    },
    otpExpiresAt: {
        type: Date,
        required: false,
    },
    account_verified: {
        type: Boolean,
        default: false,
    },
    
    deleted_account: {
        type: Boolean,
        default: false,
    }
},{
    timestamps: true,
    versionKey: false
});

export default mongoose.model('User', UserSchema);