// collection of listeners

import loanModel from '../model/loanModel'
import userModel from '../model/userModel'
import loanUserModel from '../model/loanUserModel'
const listenLoansIssued = (io: any, channel: String) => {
    const loans = loanUserModel.watch();
    loans.on("change", async (data: any) => {
        const docCount = await loanUserModel.countDocuments().exec();
        io.to(channel, docCount)
    });
}

// collect sum of all loan pa
const listenOutstandingLoan = (io: any, channel: String) => {
    const loans = loanUserModel.watch();
    loans.on("change", async (data: any) => {
        // collect all user outstanding balance

        const outstandingBalance = await loanUserModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$outstandingBalance" }
                }
            }
        ]);
        io.to(channel, outstandingBalance[0].total)
    });
}

const listenDefaultLoans = (io: any, channel: String) => {
    const loans = loanUserModel.watch();
    loans.on("change", async (data: any) => {
        // to get default loans we need to get the sum of all loans applied by users
        const defaultLoans = await loanUserModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        io.to(channel, defaultLoans[0].total)
    })}

const listenDefaultRate = (io: any, channel: String) => {
    const loans = loanModel.watch();
    loans.on("change", async (data: any) => {
        // watch for loan interest rate
        const defaultRate = await loanModel.find({}, { interestRate: 1, _id: 0 }).exec();
        io.to(channel, defaultRate)
    })}


const listenActiveLoanRequests = (io: any, channel: String) => {
    const loans = loanModel.watch();
    loans.on("change", async (data: any) => {
        // watch for loan status
        const activeLoanRequests = await loanModel.find({ status: "pending" }).countDocuments().exec();
        io.to(channel, activeLoanRequests)
    })}

const listenRegisteredUsers = (io: any, channel: String) => {
    const users = userModel.watch();
    users.on("change", async (data: any) => {
        // watch for user model
        const registeredUsers = await userModel.countDocuments().exec();
        io.to(channel, registeredUsers)
    })}

const listenTotalRevenueGenerated = (io: any, channel: String) => {
    const loans = loanUserModel.watch();
    loans.on("change", async (data: any) => {
        // collect all user outstanding balance
         const totalRevenueGenerated = await loanUserModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$outstanding_loan" }
                }
            }
        ]);


        io.to(channel, totalRevenueGenerated[0].total)
    });
}

export {
    listenLoansIssued,
    listenOutstandingLoan,
    listenDefaultLoans,
    listenDefaultRate,
    listenActiveLoanRequests,
    listenRegisteredUsers,
    listenTotalRevenueGenerated
}