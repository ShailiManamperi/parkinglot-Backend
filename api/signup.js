import pool from "./db.js";

const allowedOrigin = "https://parkinglotmanagementsystem.shailimanamperi2002.workers.dev";

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
  // GET: Fetch User
  // =========================
  if (req.method === "GET") {
    try {
      const { email } = req.query;

      const [user] = await pool.query(
        "SELECT * FROM user WHERE email = ?",
        [email]
      );

      return res.status(200).json({
        success: true,
        user: user[0]
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}