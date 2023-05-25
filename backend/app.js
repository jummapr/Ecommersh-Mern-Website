import express from 'express';
import {config} from 'dotenv'
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middlewares/error.js';

config({
    path: "./data/config.env"
});

export const app = express();

app.use(express.json());
app.use(cookieParser())

//! Route Import
import productRoute from './routes/productRoute.js';

import userRoute from './routes/userRoute.js';

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);

//! middleware for Error

app.use(ErrorMiddleware)

