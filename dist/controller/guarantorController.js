"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllGuarantors = exports.deleteManyGuarantors = exports.deleteGuarantor = exports.updateGuarantor = exports.getGuarantorById = exports.getGuarantors = exports.handleUploads = exports.createOrUpdateGuarantors = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const guarantorModel_1 = __importDefault(require("../model/guarantorModel")); // Import GuarantorDocument if defined
const formModel_1 = __importDefault(require("../model/formModel"));
// Create or update guarantors
const createOrUpdateGuarantors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId, guarantors } = req.body;
        if (!formId || !guarantors.length) {
            return res.status(400).json({ message: 'Invalid request body' });
        }
        // Find the form by ID
        const form = yield formModel_1.default.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        // Check for a maximum of 3 guarantors
        if (guarantors.length > 3) {
            return res.status(400).json({ message: 'Maximum of 3 guarantors allowed' });
        }
        const existingGuarantor = yield guarantorModel_1.default.findOne({ form: formId });
        // Create or update guarantors
        //     
        res.status(200).json({ message: 'Guarantors updated successfully' });
    }
    catch (error) {
        console.error('Error creating or updating guarantors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createOrUpdateGuarantors = createOrUpdateGuarantors;
const handleUploads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // {
    //     "formId": "667fb0c48ac9fd25a97c9e11",
    //     "uploads": [
    //         {
    //             "nationalIdFront": "path/to/Jack_nationalIdFrontView.jpeg",
    //             "nationalIdBack": "path/to/Jack_nationalIdBackView.jpeg",
    //             "letterPdf": "path/to/Jack_letter.jpeg",
    //         },
    //         {
    //             "nationalIdFront": "path/to/John_nationalIdFrontView.jpeg",
    //             "nationalIdBack": "path/to/John_nationalIdBackView.jpeg",
    //             "letterPdf": "path/to/John_letter.jpeg",
    //         },
    //         {
    //             "nationalIdFront": "path/to/Enock_nationalIdFrontView.jpeg",
    //             "nationalIdBack": "path/to/Enock_nationalIdBackView.jpeg",
    //             "letterPdf": "path/to/Enock_letter.jpeg",
    //         }
    //     ]
    // }
    try {
        const { formId, uploads } = req.body;
        const form = yield guarantorModel_1.default.findOne({ form: formId });
        if (!form) {
            return res.status(404).json({ message: "Form not found!" });
        }
        // make sure we have the same number of uploads as guarantors
        const guarantors = yield form.guarantors;
        if (guarantors.length !== req.body.uploads.length) {
            return res.status(400).json({ message: 'Number of uploads does not match number of guarantors' });
        }
        // handle the reset of logic to update files on each guarantors
        // Update each guarantor with the respective file paths
        // form.guarantors = form.guarantors.map((guarantor, index) => ({
        //     ...guarantor,
        //     files: {
        //         national_id_front: uploads[index].nationalIdFront,
        //         national_id_back: uploads[index].nationalIdBack,
        //         letter_pdf: uploads[index].letterPdf,
        //     }
        // }));
        yield form.save();
        res.status(200).json({ status: "Ok", message: 'Uploads successfully saved', });
    }
    catch (error) {
        console.error('Error handling uploads:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.handleUploads = handleUploads;
// Get all guarantors
const getGuarantors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guarantors = yield guarantorModel_1.default.find();
        res.status(200).json(guarantors);
    }
    catch (error) {
        console.error('Error fetching guarantors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getGuarantors = getGuarantors;
// Get a guarantor by ID
const getGuarantorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const guarantor = yield guarantorModel_1.default.findById(id);
        if (!guarantor) {
            return res.status(404).json({ message: 'Guarantor not found' });
        }
        res.status(200).json(guarantor);
    }
    catch (error) {
        console.error('Error fetching guarantor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getGuarantorById = getGuarantorById;
// Update a guarantor
const updateGuarantor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const guarantor = yield guarantorModel_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!guarantor) {
            return res.status(404).json({ message: 'Guarantor not found' });
        }
        res.status(200).json(guarantor);
    }
    catch (error) {
        console.error('Error updating guarantor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateGuarantor = updateGuarantor;
// Delete a guarantor
const deleteGuarantor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const guarantor = yield guarantorModel_1.default.findByIdAndDelete(id);
        if (!guarantor) {
            return res.status(404).json({ message: 'Guarantor not found' });
        }
        res.status(200).json({ message: 'Guarantor deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting guarantor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteGuarantor = deleteGuarantor;
// handle delete multiple guarantors
const deleteManyGuarantors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!ids) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const guarantors = yield guarantorModel_1.default.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Guarantors deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting guarantors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteManyGuarantors = deleteManyGuarantors;
// handle delete all guarantors
const deleteAllGuarantors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guarantors = yield guarantorModel_1.default.deleteMany({});
        res.status(200).json({ message: 'Guarantors deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting guarantors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteAllGuarantors = deleteAllGuarantors;
