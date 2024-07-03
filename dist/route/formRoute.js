"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const formController_1 = require("../controller/formController");
const storage_1 = require("../middlewares/storage");
const router = express_1.default.Router();
router.post('/personal', formController_1.personalForm);
router.post('/personal/upload', storage_1.uploadMiddleware.fields([
    { name: 'frontId', maxCount: 1 },
    { name: 'backId', maxCount: 1 },
]), formController_1.handleImageUpload);
router.get('/all', formController_1.getForms);
router.get('/getById/', formController_1.getForm);
router.delete('/delete/:id', formController_1.handleFormDelete);
// handle multiple delete
router.post('/delete-multiple', formController_1.handleMultipleDelete);
router.post("/accept-terms", formController_1.acceptLoanTerms);
// router.get('/user/:userId', getUserImage);
exports.default = router;
