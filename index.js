const { StatusCodes } = require("http-status-codes");
const express = require("express");
const dotenv = require("dotenv");
const indexRouter = require("./src/routes/indexRoutes");
const connectToDatabase = require("./src/config/database/connectToDataBase");
const ApiError = require("./src/utils/ApiError");
const globalErrorHandler = require("./src/middlewares/globalErrorHandler");

dotenv.config({ path: "./config.env" });

const createServer = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  // Routes
  app.use("/api/v1", indexRouter);

  // 404 handler
  app.use((req, res, next) => {
    next(new ApiError("Endpoint Not found", StatusCodes.NOT_FOUND));
  });

  // Error handler MIddleware
  app.use(globalErrorHandler);
  return app;
};

const startServer = async () => {
  const server = createServer();
  const port = process.env.PORT;

  try {
    await connectToDatabase();
    server.listen(port, () => {
      console.log(`App running on port : ${port}`);
    });
  } catch (error) {
    console.log("Failed to start server:", error.message);
  }
};

startServer();
