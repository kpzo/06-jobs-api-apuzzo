// Description: Main file to start the server
// Used by: server.js
// Requires: dotenv, express, path, helmet, cors, xss-clean, express-rate-limit, db/connect, routes/auth, routes/equipment, middleware/not-found, middleware/error-handler
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const path = require('path');
const app = express();

// secutiry middlware
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// connectDB
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/auth');
const equipmentRouter = require('./routes/equipment');


// set security middleware
app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// static assets
app.use(express.static(path.join(__dirname, "public")));


app.use((req, res, next) => {
  if (req.path.endsWith(".js")) {
      res.type("application/javascript");
  }
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/equipment', equipmentRouter);


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


// start server
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