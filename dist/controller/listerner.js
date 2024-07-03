"use strict";
// collection of listeners
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenTotalRevenueGenerated = exports.listenRegisteredUsers = exports.listenActiveLoanRequests = exports.listenDefaultRate = exports.listenDefaultLoans = exports.listenOutstandingLoan = exports.listenLoansIssued = void 0;
const loanModel_1 = __importDefault(require("../model/loanModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const loanUserModel_1 = __importDefault(require("../model/loanUserModel"));
const listenLoansIssued = (io, channel) => {
    const loans = loanUserModel_1.default.watch();
    loans.on("change", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const docCount = yield loanUserModel_1.default.countDocuments().exec();
        io.to(channel, docCount);
    }));
};
exports.listenLoansIssued = listenLoansIssued;
// collect sum of all loan pa
const listenOutstandingLoan = (io, channel) => {
    const loans = loanUserModel_1.default.watch();
    loans.on("change", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // collect all user outstanding balance
        const outstandingBalance = yield loanUserModel_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$outstandingBalance" }
                }
            }
        ]);
        io.to(channel, outstandingBalance[0].total);
    }));
};
exports.listenOutstandingLoan = listenOutstandingLoan;
const listenDefaultLoans = (io, channel) => {
    const loans = loanUserModel_1.default.watch();
    loans.on("change", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // to get default loans we need to get the sum of all loans applied by users
        const defaultLoans = yield loanUserModel_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        io.to(channel, defaultLoans[0].total);
    }));
};
exports.listenDefaultLoans = listenDefaultLoans;
const listenDefaultRate = (io, channel) => {
    const loans = loanModel_1.default.watch();
    loans.on("change", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // watch for loan interest rate
        const defaultRate = yield loanModel_1.default.find({}, { interestRate: 1, _id: 0 }).exec();
        io.to(channel, defaultRate);
    }));
};
exports.listenDefaultRate = listenDefaultRate;
const listenActiveLoanRequests = (io, channel) => {
    const loans = loanModel_1.default.watch();
    loans.on("change", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // watch for loan status
        const activeLoanRequests = yield loanModel_1.default.find({ status: "pending" }).countDocuments().exec();
        io.to(channel, activeLoanRequests);
    }));
};
exports.listenActiveLoanRequests = listenActiveLoanRequests;
const listenRegisteredUsers = (io, channel) => {
    const users = userModel_1.default.watch();
    users.on("change", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // watch for user model
        const registeredUsers = yield userModel_1.default.countDocuments().exec();
        io.to(channel, registeredUsers);
    }));
};
exports.listenRegisteredUsers = listenRegisteredUsers;
const listenTotalRevenueGenerated = (io, channel) => {
    const loans = loanUserModel_1.default.watch();
    loans.on("change", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // collect all user outstanding balance
        const totalRevenueGenerated = yield loanUserModel_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$outstanding_loan"
                    }
                }
            }
        ]);
        io.to(channel, totalRevenueGenerated[0].total);
    }));
};
exports.listenTotalRevenueGenerated = listenTotalRevenueGenerated;
