// controllers/formController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Form from '../model/formModel';
import User from '../model/userModel';
import Loan from "../model/loanModel";

import multer from 'multer';

export const uploadMiddleware = multer({ dest: 'user_id/' });

export const personalForm = async (req: Request, res: Response) => {
    try {
        const {
            formId,
            firstName,
            lastName,
            phone,
            nationalId,
            ward,
            city,
            postalCode,
            cylinderSize,
            email,
            loanType,
        } = req.body;

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form was not found!" });
        }

        // Update form details
        form.first_name = firstName;
        form.last_name = lastName;
        form.phone = phone;
        form.national_id = nationalId;
        form.address = {
            ward,
            city,
            postal_code: postalCode,
        };
        form.cylinderSize = cylinderSize;
        form.email = email;
        form.loanType = loanType;
        form.status = "submitted";

        // Save the updated form
        await form.save();

        res.status(201).json(form);
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({ status: "Ok", message: 'Internal server error' });
    }
};

export const handleImageUpload = async (req: Request, res: Response) => {
    try {
        const { formId } = req.body;

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found!" });
        }

        // Check if image files are uploaded 
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (!files || !files.frontId || !files.backId) {
            return res.status(400).json({ message: 'Front and back ID images are required' });
        }

        // Update the form with image paths
        form.id_front_face = files.frontId[0].path;
        form.id_back_face = files.backId[0].path;
        await form.save();

        res.status(200).json({ status: "Ok", message: 'Images Uploaded Successfully' });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Retrieve form details including image paths
export const getForm = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params;

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found!" });
        }

        // Send form details along with image paths
        res.status(200).json({
            form,
            front_id_image: form.front_id_image,
            back_id_image: form.back_id_image,
        });
    } catch (error) {
        console.error('Error retrieving form:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Apply multer middleware to handle file uploads
export const upload_user_middleware = uploadMiddleware.fields([
    { name: 'frontId', maxCount: 1 },
    { name: 'backId', maxCount: 1 },
]);


export const getForms = async (req: Request, res: Response) => {
    try {

        const forms = await Form.find().sort({ createdAt: -1 });
        res.status(200).json(forms);
    } catch (error) {
        console.error('Error retrieving forms:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateForm = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate form ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid form ID' });
        }

        const updatedForm = await Form.findByIdAndUpdate(id, updateData, { new: true }).populate('user').populate('passport');

        if (!updatedForm) {
            return res.status(404).json({ message: 'Form not found' });
        }

        res.status(200).json(updatedForm);
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const handleFormDelete = async (req: Request, res: Response) => {
    try {
        const formId = req.params.id;
        const deletedForm = await Form.findByIdAndDelete(formId);
        if (!deletedForm) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Send a response to the client
        res.status(200).json({ message: 'Form deleted successfully' });

    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// handle multiple delete
export const handleMultipleDelete = async (req: Request, res: Response) => {
    try {
        const formIds = req.body.formIds;

        if (!formIds || !Array.isArray(formIds) || formIds.length === 0) {
            return res.status(400).json({ error: 'Invalid or missing formIds' });
        }

        const validObjectIds = formIds.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validObjectIds.length === 0) {
            return res.status(400).json({ error: 'No valid formIds provided' });
        }

        const deletedForms = await Form.deleteMany({ _id: { $in: validObjectIds } });

        if (deletedForms.deletedCount === 0) {
            return res.status(404).json({ error: 'No forms found for deletion' });
        }

        res.status(200).json({ message: 'Forms deleted successfully', deletedCount: deletedForms.deletedCount });
    } catch (error) {
        console.error('Error deleting forms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateLoanType = async (req: Request, res: Response) => {
    try {
        const { userId, loanType } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!loanType) {
            return res.status(400).json({ message: 'Loan type is required' });
        }

        const newForm = new Form({
            User: userId,
        })
        newForm.save()

        const newLoan = new Loan({
            Form: newForm._id,
            loan_type: loanType,
        })

        newLoan.save()

    }
    catch (error) {
        console.error('Error getting images:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const acceptLoanTerms = async (req: Request, res: Response) => {
    const { accepted, userId } = req.body;
    console.log(accepted, userId)

    try {
        // check for miss request
        if (!userId || !accepted) {
            console.log("Missing required fields");
            return res.status(400).json({ status: "Error", message: "Missing required fields" });
        }

        // check if the user exist
        const user = await User.findById(userId);
        if(!user){
            console.log("User not found");
            return res.status(404).json({ status: "Error", message: "User not found" });
        }

        // check if user has a form id
        const checkForm = await Form.findOne({ User: userId });
        if (checkForm) {
            console.log("User has form");
            return res.status(202).json({ status: "Ok", formId: `${checkForm._id}`, message: 'User has form' });
        }

        const newForm = new Form({
            agreed_terms: accepted,
            User: userId,
        });

        if(newForm){
            console.log("Form created");
        }

        const saved = await newForm.save();

        res.status(200).json({ status: "Ok", formId: `${saved._id}`, message: " Successful created form!" })
    } catch (error) {
        console.error('Error getting images:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

export const checkLoanStatus = async (req: Request, res: Response) => {
    const { formId } = req.body;

    try {
        const checkStatus = Form.find({ _id: formId, agreed_terms: true })
        if (!checkStatus) {
            return res.status(400).json({ message: "Terms not agreed" })
        }
    } catch (error) {
        console.error('Error getting images:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}