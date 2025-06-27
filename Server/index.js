import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'; // optional logging

import ConnectDB from './Database/dbConfig.js';
import authRouter from './Routes/authRoute.js';
import postRouter from './Routes/postRoute.js';
import interactRoute from './Routes/likeAndComntRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect to MongoDB
ConnectDB();

// ✅ Conditional Logging (only in dev)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ✅ Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ✅ Dynamic CORS Setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://gleeful-faloodeh-558367.netlify.app' // 🔁 Replace after deploying frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || process.env.NODE_ENV === 'development') {
        // Allow requests with no origin or from localhost in dev
        callback(null, true);
      } else if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ✅ API Routes
app.use('/api/user', authRouter);
app.use('/api/userpost', postRouter);
app.use('/api/interact', interactRoute);

// ✅ Optional root route
app.get('/', (req, res) => {
  res.send('✅ Backend server is running...');
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});
