import { pool } from "../../config/db";

const createUser = async (name: string, email: string) => {
  const result = await pool.query(
    `
              INSERT INTO users(name, email)
              VALUES($1, $2)
              RETURNING *
              `,
    [name, email]
  );
  return result;
};

// get all users
const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

// single user
const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

// update user
const updateUser = async (name: string, email: string, id: string) => {
  const result = await pool.query(
    `UPDATE users 
       SET name=$1, email=$2, updated_at=NOW() 
       WHERE id=$3 
       RETURNING *`,
    [name, email, id]
  );
  return result;
};

// user delete

const userDeleted = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id]
  );
  return result;
};


export const userService = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  userDeleted
};
