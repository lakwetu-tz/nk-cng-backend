import { Request, Response } from 'express';
import mongoose from 'mongoose';
import guarantorModel from '../model/guarantorModel';
import multer, { StorageEngine } from 'multer';
import formModel from '../model/formModel';

// Configure multer storage
const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Multer middleware
export const upload = multer({ storage });

// Create a new guarantor
export const createGuarantor = async (req: Request, res: Response) => {
    // {
    //     "formId": "3nn09no2390nc03023",
    //     "guarantors": [
    //         {
    //             "firstName": "John",
    //             "lastName": "Doe",
    //             "email": "john.doe@example.com",
    //             "phone": "1234567890"
    //         },
    //         {
    //             "firstName": "Jane",
    //             "lastName": "Smith",
    //             "email": "jane.smith@example.com",
    //             "phone": "9876543210"
    //         },
    //         {
    //             "firstName": "Jane",
    //             "lastName": "Smith",
    //             "email": "jane.smith@example.com",
    //             "phone": "9876543210"
    //         }
    //     ]
    // }
    try {
        const { formId, guarantors } = req.body;

        // Find the form by ID
        const form = await formModel.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // Validate that the form is not submitted
        if (form.isSubmitted) {
            return res.status(400).json({ message: 'Form is already submitted' });
        }

        // Validate that the form has not reached the maximum number of guarantors (3)
        if (guarantors.length >= 3) {
            return res.status(400).json({ message: 'Maximum number of guarantors reached' });
        }

        // Save guaranter information on the guarantorModel
        const newGuarantors = guarantors.map((guarantor: any) => {
            const { firstName, lastName, email, phone } = guarantor;
            return new guarantorModel({
                Form: formId,
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
            });
        });

        // Save the new guarantors to the database
        const savedGuarantors = await guarantorModel.insertMany(newGuarantors);

        // Update the form's guarantors array with the new guarantor IDs
        guarantors.push(...savedGuarantors.map(guarantor => guarantor._id));
        await form.save();

        res.status(201).json({ status: "Ok", message: "Form Submitted", data: savedGuarantors });
    } catch (error) {
        console.error('Error creating guarantor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// export const uploads = async (req: Request, res: Response) => {
//     // {
//     //     "formId": "3nn09no2390nc03023",
//     //     "uploads": [
//     //         {
//     //             "nationalIdFront": "path/to/front_national_id.jpg",
//     //             "nationalIdBack": "path/to/back_national_id.jpg",
//     //             "letterFile": "path/to/letter.pdf",
//     //            
//     //         },
//     //         {
//     //             "nationalIdFront": "path/to/front_national_id.jpg",
//     //             "nationalIdBack": "path/to/back_national_id.jpg",
//     //             "letterFile": "path/to/letter.pdf",
//     //       
//     //         },
//     //         {
//     //             "nationalIdFront": "path/to/front_national_id.jpg",
//     //             "nationalIdBack": "path/to/back_national_id.jpg",
//     //             "letterFile": "path/to/letter.pdf",
//     //          
//     //         }
//     //     ]
//     // }
//     try {
//         const { formId, uploads } = req.body;

//         // Find the form by ID
//         const form = await formModel.findById(formId);
//         if (!form) {
//             return res.status(404).json({ message: 'Form not found' });
//         }
     
//         // Validate that the form has not reached the maximum number of guarantors (3)
//         if (uploads.length >= 3) {
//             return res.status(400).json({ message: 'Maximum number of guarantors reached' });
//         }
//         // Get the uploaded files from the request
//         const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//         // Validate file existence for each guarantor
//         const hasAllFiles = guarantors.every((guarantor: any, index: number) => {
//             return (
//                 files[`nationalIdFront_${index}`] &&
//                 files[`nationalIdBack_${index}`] &&
//                 files[`letterFile_${index}`]
//             );
//         });
//         if (!hasAllFiles) {
//             return res.status(400).json({ message: 'Missing required files' });
//         }
//         // Prepare an array to hold the new guarantor documents
//         const uploadGuarantor = guarantors.map((guarantor: any, index: number) => {
//             const { nationalIdFrontPath,  } = guarantor;
//             return new guarantorModel({
//                 nationalIdFrontPath: files[`nationalIdFront_${index}`][0].path,
//                 nationalIdBackPath: files[`nationalIdBack_${index}`][0].path,
//                 letterFilePath: files[`letterFile_${index}`][0].path,
//             });
//         });
//         // Save all guarantor documents to the database
//         const savedGuarantors = await guarantorModel.insertMany(newGuarantors);
//         // Update the form's guarantors array with the new guarantor IDs
//         form.guarantors.push(...savedGuarantors.map(guarantor => guarantor._id));
//         await form.save();
//         res.status(201).json({ status: "Ok", message: "Form Submitted", data: savedGuarantors });
//     } catch (error) {
//         console.error('Error creating guarantor:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };



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
