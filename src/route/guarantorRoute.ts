import express from 'express';
import { upload, createGuarantor, getGuarantors, getGuarantorById, updateGuarantor, deleteGuarantor } from '../controller/guarantorController';

const router = express.Router();

router.post('/guarantors', upload.fields([
    { name: 'nationalIdFront', maxCount: 1 },
    { name: 'nationalIdBack', maxCount: 1 },
    { name: 'letterFile', maxCount: 1 }
]), createGuarantor);

// router.get('/guarantors', getGuarantors);
router.get('/guarantors/:id', getGuarantorById);
router.put('/guarantors/:id', updateGuarantor);
router.delete('/guarantors/:id', deleteGuarantor);

export default router;
