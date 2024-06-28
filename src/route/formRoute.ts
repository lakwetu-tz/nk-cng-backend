import express from 'express';
import { personalForm, getForm, getForms, acceptLoanTerms, handleImageUpload, handleFormDelete, handleMultipleDelete } from '../controller/formController';
import { uploadMiddleware } from '../middlewares/storage'

const router = express.Router();

router.post('/personal', personalForm );
router.post('/personal/upload', 
    uploadMiddleware.fields([
        { name: 'frontId', maxCount: 1 },
        { name: 'backId', maxCount: 1 },
]), handleImageUpload)
router.get('/getAll', getForms);
router.get('/getById/', getForm);
router.delete('/delete/:id', handleFormDelete);
// handle multiple delete
router.post('/delete-multiple', handleMultipleDelete);
router.post("/accept-terms", acceptLoanTerms);
// router.get('/user/:userId', getUserImage);


export default router;
