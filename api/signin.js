import pool from "./db.js";

const allowedOrigin = "https://deparmentmanagementwebsite.shailimanamperi2002.workers.dev";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // =========================
  // POST: Add User
  // =========================
  if (req.method === "POST") {
    try {
      const {
        name,email,password} = req.body;

      const sql = `INSERT INTO user (name,email,password) VALUES (?, ?, ?)`;

      const [result] = await pool.execute(sql, [
       name,email,password
      ]);

      return res.status(200).json({
        success: true,
        id: result.insertId
      });

    } catch (err) {
      console.error("DB Error:", err);

      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

  // =========================
  // GET: Fetch Users
  // =========================
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM user ORDER BY id DESC"
      );

      return res.status(200).json({
        success: true,
        data: rows
      });

    } catch (err) {
      console.error("GET Error:", err);

      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}