import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userController } from "./user.controller";
const router = express.Router();

// local host 5000/users
router.get("/", userController.getUser);

// user create/post
router.post("/", userController.createUser);

// single user get
router.get("/:id", userController.getSingleUser);

// put method crud
router.put("/:id", userController.updateUser);

// deleted crud
router.delete("/:id", userController.userDeleted);

export const userRouter = router;
