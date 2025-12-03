import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await userService.createUser(name, email);
    // console.log(result.rows[0]);
    res.status(201).json({
      success: false,
      message: "User inserted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all users
const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUser();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

// single user

const getSingleUser = async (req: Request, res: Response) => {
  // console.log(req.params.id)
  try {
    const result = await userService.getSingleUser(req.params.id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "users not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

// update users
const updateUser = async (req: Request, res: Response) => {
  // console.log(req.params.id)
  const { name, email } = req.body;
  try {
    const result = await userService.updateUser(
      name,
      email,
      req.params.id as string
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "users not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User Updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

// delete users
const userDeleted = async (req: Request, res: Response) => {
  async (req: Request, res: Response) => {
    // console.log(req.params.id)
    try {
      const result = await userService.userDeleted(req.params.id as string);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "users not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "User deleted successfully",
          data: null,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        details: error,
      });
    }
  };
};

export const userController = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  userDeleted,
};
