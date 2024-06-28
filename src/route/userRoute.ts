import express from 'express';
import {register, login, getUsers, verify, resendOtp, handleResetPassword} from '../controller/userControllers';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/register', register);
router.post('/login', login );
router.post('/verify-otp', verify)
router.post('/resend-otp', resendOtp);
router.get('/logout', authenticate, (req, res) => {
    // Clear the token or do any other logout operations
    res.json({ message: 'Logged out successfully' });
});
router.get('/users', getUsers);
router.post('/reset-password', handleResetPassword)

export default router;