import pool from "./db.js";

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query("SELECT 1 + 2 AS result");

    res.status(200).json({
      success: true,
      message: "Backend connected to MySQL",
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}