import express from 'express';
import { createOrUpdateGuarantors, getGuarantors, getGuarantorById, updateGuarantor, deleteGuarantor, handleUploads, deleteManyGuarantors, deleteAllGuarantors } from '../controller/guarantorController';
import { uploadMiddleware } from '../middlewares/storage';
const router = express.Router();

router.post('/create', createOrUpdateGuarantors),
router.post('/upload', uploadMiddleware.fields([
    { name: 'nationalIdFront', maxCount: 1 },
    { name: 'nationalIdBack', maxCount: 1 },
    { name: 'letterFile', maxCount: 1 },
]), handleUploads);

// router.get('/guarantors', getGuarantors);
router.get('/get/:id', getGuarantorById);
router.put('/update/:id', updateGuarantor);
router.delete('/delete/:id', deleteGuarantor);
router.get('/all', getGuarantors);

router.delete('/deleteMany/:ids', deleteManyGuarantors);

router.delete('/deleteAll', deleteAllGuarantors);

export default router;
