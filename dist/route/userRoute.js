"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controller/userControllers");
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const router = express_1.default.Router();
router.post('/register', userControllers_1.register);
router.post('/login', userControllers_1.login);
router.post('/verify-otp', userControllers_1.verify);
router.post('/resend-otp', userControllers_1.resendOtp);
router.get('/logout', authenticate_1.default, (req, res) => {
    // Clear the token or do any other logout operations
    res.json({ message: 'Logged out successfully' });
});
router.get('/users', userControllers_1.getUsers);
router.post('/reset-password', userControllers_1.handleResetPassword);
router.delete('/delete/:id', userControllers_1.deleteUser);
router.put('/update/:id', userControllers_1.updateUser);
exports.default = router;
