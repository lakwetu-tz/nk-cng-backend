"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResetPassword = exports.handleProfileImageUpload = exports.deleteUser = exports.updateUser = exports.getUsers = exports.getUserById = exports.login = exports.resendOtp = exports.verify = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const jwtUtils_1 = require("../utils/jwtUtils");
const generatePassword_1 = require("../utils/generatePassword");
const africastalking_1 = __importDefault(require("africastalking"));
const africasTalking = (0, africastalking_1.default)({
    apiKey: "8ee049d80e558be1680fddf90fd4683e016d9ef98be04fbbc6e2e6f41f869cee",
    username: "MIKE001",
});
const sms = africasTalking.SMS;
// Utility function to generate OTP
const generateOTP = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
};
const sendOTP = (phone, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const message = `Your verification code is ${otp}`;
    try {
        const response = yield sms.send({
            to: phone,
            message: message,
            from: "",
        });
        console.log(response);
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        throw error;
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes
    try {
        const { name, password, phone } = req.body;
        if (!name || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Validate phone number format
        const phoneNumberPattern = /^[0-9]{10,15}$/;
        if (!phoneNumberPattern.test(phone)) {
            return res
                .status(400)
                .json({ message: "Phone Number should start with +255" });
        }
        // Check if the user already exists
        const existingUser = yield userModel_1.default.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const existingPhone = yield userModel_1.default.findOne({ phone });
        if (existingPhone) {
            return res.status(401).json({ message: "Phone Number already taken" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new userModel_1.default({
            name,
            password: hashedPassword,
            phone,
            otp,
            otpExpiresAt,
        });
        yield newUser.save();
        yield sendOTP(phone, otp);
        res
            .status(201)
            .json({ status: "Ok", message: "User registered successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.register = register;
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, otp } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ phone, otp });
        if (!user) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }
        user.account_verified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        yield user.save();
        res.status(200).json({ message: "User verified successfully" });
    }
    catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.verify = verify;
const resendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.body;
    if (!phone) {
        return res
            .status(400)
            .json({ status: "error", message: "Phone number is required" });
    }
    try {
        const user = yield userModel_1.default.findOne({ phone });
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
        yield user.save();
        // Send OTP via SMS
        const result = yield sms.send({
            to: [phone],
            message: `Your OTP code is ${otp}`,
            from: "",
        });
        res
            .status(200)
            .json({ status: "success", message: "OTP resent successfully", result });
    }
    catch (error) {
        console.error("Error resending OTP:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});
exports.resendOtp = resendOtp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, password } = req.body;
        // Find the user by email and select the password field
        const user = yield userModel_1.default.findOne({ phone }).select("+password");
        // If no user is found, return an error
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, jwtUtils_1.JWT_SECRET, { expiresIn: "7d" });
        const _a = user.toObject(), { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
        res.json({ token, user: userWithoutPassword });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserById = getUserById;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        res.status(200).json({ users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error!" });
    }
});
exports.getUsers = getUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const { name, email, phone, address, city, state, country, zipcode } = req.body;
        const user = yield userModel_1.default.findByIdAndUpdate(userId, {
            name,
            email,
            phone,
            address,
            city,
            state,
            country,
            zipcode,
        }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        console.log(userId);
        const user = yield userModel_1.default.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(user._id);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteUser = deleteUser;
const handleProfileImageUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const imageUrl = req.body.imageUrl;
        // check if user exist
        const user = userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // save image to the database
        // user.profile_picture = imageUrl;
        // await user.save();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.handleProfileImageUpload = handleProfileImageUpload;
const handleResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.body;
    try {
        // Validate phone number format here if needed
        if (!phone) {
            return res
                .status(400)
                .json({ status: "error", message: "Phone number is required" });
        }
        // Find the user by phone number
        const user = yield userModel_1.default.findOne({ phone });
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        // Generate a new password
        const newPassword = (0, generatePassword_1.generatePassword)();
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        // Send the new password via SMS
        const result = yield sms.send({
            to: [phone],
            message: `Your new password is ${newPassword}`,
            from: "",
        });
        res
            .status(200)
            .json({ status: "Ok", message: "Password reset successfully", result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});
exports.handleResetPassword = handleResetPassword;
