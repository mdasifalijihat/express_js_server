import { pool } from "../../config/db";

// create todo
const todoUserCreated = async (user_id: number, title: string) => {
  const result = await pool.query(
    `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
    [user_id, title]
  );
  return result;
};

// todo get CRUD
const todoGetAll = async () => {
  const result = await pool.query(`SELECT * FROM todos`);
  return result;
};

// todo single CRUD
const todoSingleGet = async (id: string) => {
  const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);
  return result;
};

// todos put method CRUD
const todoUpdate = async (user_id: string, title: string, id: string) => {
  const result = await pool.query(
    `UPDATE todos 
       SET user_id=$1, title=$2, updated_at=NOW() 
       WHERE id=$3 
       RETURNING *`,
    [user_id, title, id]
  );
  return result;
};

// todos deleted method CRUD

const todoDeleted = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM todos WHERE id = $1 RETURNING *`,
    [id]
  );
  return result;
};


export const todoServices = {
  todoUserCreated,
  todoGetAll,
  todoSingleGet,
  todoUpdate,
  todoDeleted,
};
