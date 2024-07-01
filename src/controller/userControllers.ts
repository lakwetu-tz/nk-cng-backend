import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../model/userModel';
import { JWT_SECRET } from '../utils/jwtUtils';
import { generatePassword } from '../utils/generatePassword';
import AfricasTalking from 'africastalking';


const africasTalking = AfricasTalking({
    apiKey: "8ee049d80e558be1680fddf90fd4683e016d9ef98be04fbbc6e2e6f41f869cee",
    username: "MIKE001"
});

const sms = africasTalking.SMS;

// Utility function to generate OTP
const generateOTP = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
};

const sendOTP = async (phone: string, otp: string) => {
    const message = `Your verification code is ${otp}`;
    try {
        const response = await sms.send({
            to: phone,
            message: message,
            from: ''
        });
        console.log(response);
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

export const register = async (req: Request, res: Response) => {
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes
    try {
        const { name, password, phone } = req.body;

        if (!name || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUser = await userModel.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const existingPhone = await userModel.findOne({ phone })
        if (existingPhone) {
            return res.status(401).json({ message: "Phone Number already taken" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({ name, password: hashedPassword, phone, otp, otpExpiresAt });
        await newUser.save();
        await sendOTP(phone, otp);

        res.status(201).json({ status: 'Ok', message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const verify = async (req: Request, res: Response) => {
    const { phone, otp } = req.body;

    try {
        const user = await userModel.findOne({ phone, otp });

        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        user.account_verified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const resendOtp = async (req: Request, res: Response) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ status: 'error', message: 'Phone number is required' });
    }

    try {
        const user = await userModel.findOne({ phone });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);  // OTP expires in 10 minutes
        await user.save();

        // Send OTP via SMS
        const result = await sms.send({
            to: [phone],
            message: `Your OTP code is ${otp}`,
            from: ''
        });

        res.status(200).json({ status: 'success', message: 'OTP resent successfully', result });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { phone, password } = req.body;

        // Find the user by email and select the password field
        const user = await userModel.findOne({ phone }).select('+password');

        // If no user is found, return an error
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }


        const isPasswordValid = await bcrypt.compare(password as string, user.password as string);


        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userModel.find()

        res.status(200).json({ users })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error!" })
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const { name, email, phone, address, city, state, country, zipcode } = req.body;

        const user = await userModel.findByIdAndUpdate(userId, {
            name,
            email,
            phone,
            address,
            city,
            state,
            country,
            zipcode
        }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        console.log(userId);

        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user._id);

        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
            

export const handleProfileImageUpload = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const imageUrl = req.body.imageUrl;

        // check if user exist 
        const user = userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // save image to the database
        // user.profile_picture = imageUrl;
        // await user.save();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const handleResetPassword = async (req: Request, res: Response) => {
    const { phone } = req.body;
    try {

        // Validate phone number format here if needed
        if (!phone) {
            return res.status(400).json({ status: 'error', message: 'Phone number is required' });
        }

        // Find the user by phone number
        const user = await userModel.findOne({ phone });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Generate a new password
        const newPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();


        // Send the new password via SMS
        const result = await sms.send({
            to: [phone],
            message: `Your new password is ${newPassword}`,
            from: ''
        });
        res.status(200).json({ status:'Ok', message: 'Password reset successfully', result });


    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}