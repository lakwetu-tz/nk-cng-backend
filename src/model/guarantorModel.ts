import mongoose from 'mongoose';

const guarantorSchema = new mongoose.Schema({
    form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: false,
    },
    guarantors: [
        {
            first_name: { type: String, trim: true, required: false },
            last_name: { type: String, trim: true, required: false },
            phone: { type: String, trim: true, required: false },
            email: { type: String, trim: true, required: false },
            address: {
                ward: { type: String, trim: true, required: false },
                city: { type: String, trim: true, required: false },
                postalCode: { type: String, trim: true, required: false },
            },
            files: 
                {
                    national_id_front: { type: String, trim: true, required: false },
                    national_id_back: { type: String, trim: true, required: false },
                    letter_pdf: { type: String, required: false },
                },
           
        },
    ],
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
});

export default mongoose.model('Guarantor', guarantorSchema);
