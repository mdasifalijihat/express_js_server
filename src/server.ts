import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRouter } from "./modules/user/user.routes";


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
app.get("/users", )

// users CRUD post api
app.use("/users", userRouter)

// single user crud get

//put method crud


//deleted crud
app.delete("/users/:id", );

// TODO CRUD

// todo post crud
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title]
    );

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
});

// todo get crud
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);
    res.status(200).json({
      success: true,
      message: "Todos retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
});

// todo single crud get
app.get("/todos/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id)
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [
      req.params.id,
    ]);

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
});

//todos put method crud
app.put("/todos/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id)
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `UPDATE todos 
       SET user_id=$1, title=$2, updated_at=NOW() 
       WHERE id=$3 
       RETURNING *`,
      [user_id, title, req.params.id]
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
});

// todo deleted crud
app.delete("/todos/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id)
  try {
    const result = await pool.query(
      `DELETE FROM todos WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

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
});

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
