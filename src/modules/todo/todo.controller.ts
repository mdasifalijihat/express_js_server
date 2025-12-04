import { Request, Response } from "express";
import { todoServices } from "./todo.services";

// todo crated CRUD
const createdTodo = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await todoServices.todoUserCreated(user_id, title);

    res.status(201).json({
      success: true,
      message: "Todos crate ",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// todo get crud all
const todoGetAll = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.todoGetAll();
    res.status(200).json({
      success: true,
      message: "Todos Res successfully",
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

// todo single crud

const todoSingleGet = async (req: Request, res: Response) => {
  // console.log(req.params.id)
  try {
    const result = await todoServices.todoSingleGet(req.params.id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todos fetch successfully",
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

// todos update crud
const todoUpdates = async (req: Request, res: Response) => {
  // console.log(req.params.id)
  const { user_id, title } = req.body;
  try {
    const result = await todoServices.todoUpdate(
      user_id,
      title,
      req.params.id as string
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "todos not founds",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "todos Updated successfully",
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

// todos deleted

const todoDeletes = async (req: Request, res: Response) => {
  // console.log(req.params.id)
  try {
    const result = await todoServices.todoDeleted(req.params.id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todos not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todos deleted successfully",
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

export const todoController = {
  createdTodo,
  todoGetAll,
  todoSingleGet,
  todoUpdates,
  todoDeletes,
};
