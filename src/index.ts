import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import multer from "multer";
import cors from "cors";
import http from "http";
import SocketIO from "socket.io";
const cookieParser = require("cookie-parser");
import bodyParser from "body-parser";

import userRoute from './route/userRoute';
import superRoute from './route/superuserRoute';
import loanRoute from './route/loanRoute';
import formRoute from './route/formRoute';
import guarantorRoute from './route/guarantorRoute';
import vehicleRoute from './route/vehicleRoute';
import Form from './model/formModel';
import { listenActiveLoanRequests, listenDefaultLoans, listenDefaultRate, listenLoansIssued, listenOutstandingLoan, listenTotalRevenueGenerated } from './controller/listerner';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
// Middleware
app.use(bodyParser.json());
app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({origin: "*"}));
app.use(cookieParser());

const server = http.createServer(app);
const io = new SocketIO.Server(server, {
	cors: {
		origin: "*",
	},
});
app.set("io", io);

//routes 
app.use('/v1/user', userRoute);
app.use('/v1/superuser', superRoute);
app.use('/v1/loan', loanRoute);
// app.use('/api/v1/sms', smsRoute);
app.use('/v1/form', formRoute);
app.use('/v1/guarantor', guarantorRoute);
app.use('/v1/vehicle', vehicleRoute);

// Error handling middleware
app.use(
	(
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const statusCode = err.statusCode || 500;
		const message = err.message || "Internal Server Error";

// open up socket
io.on('connection', (socket) => {
    console.log('A user connected');

    //collection of listeners
    listenActiveLoanRequests(io, "active")
    listenDefaultLoans(io, "default")
    listenDefaultRate(io, "interest")
    listenTotalRevenueGenerated(io, "revenue")
    listenLoansIssued(io, "issue")
    listenOutstandingLoan(io, "outstanding")

    // Listen for disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI || "", {
    family: 4,
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
})
    .then(() => {
        app.listen(4000, () => {

            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error: any) => {
        console.error('Error connecting to MongoDB:', error);
    });
		res.status(statusCode).json({
			error: {
				status: statusCode,
				message: message,
			},
		});
	}
);

// Connect to MongoDB and start server
mongoose
	.connect(process.env.MONGO_URI || "", {
		family: 4,
		serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
	})
	.then(() => {
		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	})
	.catch((error: any) => {
		console.error("Error connecting to MongoDB:", error);
	});
