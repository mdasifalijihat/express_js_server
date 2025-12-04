import express from "express";
import { todoController } from "./todo.controller";

const router = express.Router();

router.post("/", todoController.createdTodo);
// todo get crud all
router.get("/", todoController.todoGetAll);

// todo single crud get 
router.get("/:id", todoController.todoSingleGet)

// todos update 
router.put("/:id", todoController.todoUpdates)

// todos deleted 

router.delete("/:id", todoController.todoDeletes)

export const todoRouter = router;
