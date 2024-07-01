"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const guarantorController_1 = require("../controller/guarantorController");
const storage_1 = require("../middlewares/storage");
const router = express_1.default.Router();
router.post('/create', guarantorController_1.createOrUpdateGuarantors),
    router.post('/upload', storage_1.uploadMiddleware.fields([
        { name: 'nationalIdFront', maxCount: 1 },
        { name: 'nationalIdBack', maxCount: 1 },
        { name: 'letterFile', maxCount: 1 },
    ]), guarantorController_1.handleUploads);
// router.get('/guarantors', getGuarantors);
router.get('/get/:id', guarantorController_1.getGuarantorById);
router.put('/update/:id', guarantorController_1.updateGuarantor);
router.delete('/delete/:id', guarantorController_1.deleteGuarantor);
router.get('/all', guarantorController_1.getGuarantors);
router.delete('/deleteMany/:ids', guarantorController_1.deleteManyGuarantors);
router.delete('/deleteAll', guarantorController_1.deleteAllGuarantors);
exports.default = router;
