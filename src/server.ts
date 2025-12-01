import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const app = express();
const port = 5000;

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //form data use

// DB
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

// table create neon console
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    age INT,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `);

  await pool.query(`
      CREATE TABLE IF NOT EXISTS todos(
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE, 
      title VARCHAR(200) NOT NULL,
      description TEXT, 
      completed BOOLEAN DEFAULT false,
      due_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
};
initDB();

// logger middleware

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
  next();
};

// normal get method
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello World next level developer!");
});

// users CRUD post api
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO users(name, email)
      VALUES($1, $2)
      RETURNING *
      `,
      [name, email]
    );
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
});

// user get
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
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
});

// single user crud get
app.get("/users/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id)
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);

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
});

//put method crud
app.put("/users/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id)
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users 
       SET name=$1, email=$2, updated_at=NOW() 
       WHERE id=$3 
       RETURNING *`,
      [name, email, req.params.id]
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
});

//deleted crud
app.delete("/users/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id)
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

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
});

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
