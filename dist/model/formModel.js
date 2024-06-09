"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const FormSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        unique: true,
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
    Guarantor_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Guarantor',
        required: false
    },
    vehicle_id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    id_front_face: {
        type: String,
    },
    id_back_face: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});
exports.default = mongoose_1.default.model('Form', FormSchema);
