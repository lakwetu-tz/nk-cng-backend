// // collection of listeners
  
//     title: "Total Payments Received",

//     title: "Total Outstanding Loans",

//     title: "Total Loans in Default",

//     title: "Default Rate",

//     title: "Active Loan Requests",
   
//     title: "Registered Users",

//     title: "Total Revenue Generated",

// const listenLoansIssued = (io: any, channel: String) => {
//     const loans = loanModel.watch();
//     loans.on("change", async (data: any) => {
//         const docCount = await loanModel.countDocuments().exec();
//         io.to(channel, docCount)
//     });
// }

// // collect sum of all loan pa
// const listenOutstandingLoan = (io: any, channel: String) => {
//     const loans = loanModel.watch();
//     loans.on("change", async (data: any) => {
//         const docCount = await loanModel.aggregate([
//             {
//                 $match: {
//                     status: { $ne: "paid" }
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     total: { $sum: "$amount" }
//                 }
//             }
//         ]);
//         io.to(channel, docCount[0].total)
//     });