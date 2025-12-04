import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRouter } from "./modules/user/user.routes";
import { todoRouter } from "./modules/todo/todo.routers";

const app = express();
const port = config.port;

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //form data use

// initializing db
initDB();

// '/' --> local host 5000
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello World next level developer!");
});

// user get
app.get("/users");

// users CRUD post api
app.use("/users", userRouter);

// TODO CRUD
app.use("/todos", todoRouter); 



// not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// LISTEN PORT
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
