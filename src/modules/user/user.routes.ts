import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userController } from "./user.controller";
const router = express.Router();

// local host 5000/users
router.get("/", userController.getUser);

// user create/post
router.post("/", userController.createUser);

export const userRouter = router;
