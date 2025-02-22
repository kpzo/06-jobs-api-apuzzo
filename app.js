require('dotenv').config();
require('express-async-errors');
const express = require('express');
const path = require('path');
const app = express();

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// connectDB
const connectDB = require('./db/connect');


// routers
const authRouter = require('./routes/auth');
const equipmentRouter = require('./routes/equipment');

// middleware
app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000", // Allow frontend requests
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));
app.use(xss());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/equipment', equipmentRouter);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();