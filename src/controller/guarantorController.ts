import { Request, Response } from 'express';
import mongoose from 'mongoose';
import guarantorModel from '../model/guarantorModel'; // Import GuarantorDocument if defined
import formModel from '../model/formModel';

// Interface for guarantor data expected in the request body
interface GuarantorRequestBody {
    formId: string;
    guarantors: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        address?: {
            ward?: string;
            city?: string;
            postalCode?: string;
        };
    }[];
}

// Create or update guarantors
export const createOrUpdateGuarantors = async (req: Request, res: Response) => {
    try {
        const { formId, guarantors }: GuarantorRequestBody = req.body;

        if (!formId || !guarantors.length) {
            return res.status(400).json({ message: 'Invalid request body' });
        }

        // Find the form by ID
        const form = await formModel.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // Check for a maximum of 3 guarantors
        if (guarantors.length > 3) {
            return res.status(400).json({ message: 'Maximum of 3 guarantors allowed' });
        }
        const existingGuarantor = await guarantorModel.findOne({ form: formId });

        // Create or update guarantors
    //     

        res.status(200).json({ message: 'Guarantors updated successfully' });
    } catch (error) {
        console.error('Error creating or updating guarantors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const handleUploads = async (req: Request, res: Response) => {

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
        const { formId, uploads }: { formId: string, uploads: { nationalIdFront: string, nationalIdBack: string, letterPdf: string }[] } = req.body;

        const form = await guarantorModel.findOne({ form: formId });
        if (!form) {
            return res.status(404).json({ message: "Form not found!" });
        }

        // make sure we have the same number of uploads as guarantors
        const guarantors = await form.guarantors;
        if (guarantors.length!== req.body.uploads.length) {
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

        await form.save();

        res.status(200).json({ status: "Ok", message: 'Uploads successfully saved',  });

    }catch(error) {
        console.error('Error handling uploads:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get all guarantors
export const getGuarantors = async (req: Request, res: Response) => {
    try {
        const guarantors = await guarantorModel.find();
        res.status(200).json(guarantors);
    } catch (error) {
        console.error('Error fetching guarantors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a guarantor by ID
export const getGuarantorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const guarantor = await guarantorModel.findById(id);
        if (!guarantor) {
            return res.status(404).json({ message: 'Guarantor not found' });
        }
        res.status(200).json(guarantor);
    } catch (error) {
        console.error('Error fetching guarantor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update a guarantor
export const updateGuarantor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const guarantor = await guarantorModel.findByIdAndUpdate(id, updates, { new: true });
        if (!guarantor) {
            return res.status(404).json({ message: 'Guarantor not found' });
        }

        res.status(200).json(guarantor);
    } catch (error) {
        console.error('Error updating guarantor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a guarantor
export const deleteGuarantor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        } 

        const guarantor = await guarantorModel.findByIdAndDelete(id);
        if (!guarantor) {
            return res.status(404).json({ message: 'Guarantor not found' });
        }

        res.status(200).json({ message: 'Guarantor deleted successfully' });
    } catch (error) {
        console.error('Error deleting guarantor:', error);  
        res.status(500).json({ message: 'Internal server error' });
    }
};

// handle delete multiple guarantors

export const deleteManyGuarantors = async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;
        if (!ids) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const guarantors = await guarantorModel.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Guarantors deleted successfully' });
    } catch (error) {
        console.error('Error deleting guarantors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// handle delete all guarantors
export const deleteAllGuarantors = async (req: Request, res: Response) => {
    try {
        const guarantors = await guarantorModel.deleteMany({});
        res.status(200).json({ message: 'Guarantors deleted successfully' });
    } catch (error) {
        console.error('Error deleting guarantors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

