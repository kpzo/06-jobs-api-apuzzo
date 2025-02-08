require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// connectDB
const connectDB = require('./db/connect')

const authenticateUser = require('./middleware/authentication')

// routers
const authRouter = require('./routes/auth')
const equipmentRouter = require('./routes/equipment')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

// routes
app.use('/api/v1/auth', authRouter)
// might need to remove 'authenticateUser' from equipmentRouter so all users can see all equipment edits/changes
app.use('/api/v1/equipment', authenticateUser, equipmentRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
