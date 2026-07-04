import pool from "./db.js";

const allowedOrigin = "https://parkinglotmanagementsystem.shailimanamperi2002.workers.dev";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // =====================
  // GET ALL TYPES
  // =====================
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM VehicleType ORDER BY id DESC"
      );

      return res.status(200).json({
        success: true,
        data: rows
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

  // =====================
  // CREATE TYPE
  // =====================
  if (req.method === "POST") {
    try {
      const { type, amount } = req.body;

      const sql = `
        INSERT INTO VehicleType (type, amount)
        VALUES (?, ?)
      `;

      const [result] = await pool.execute(sql, [
        type,
        amount
      ]);

      return res.status(200).json({
        success: true,
        id: result.insertId
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

  // =====================
  // UPDATE TYPE
  // =====================
  if (req.method === "PUT") {
    try {
      const id = req.query.id;
      const { amount } = req.body;

      const sql = `
        UPDATE VehicleType
        SET amount = ?
        WHERE id = ?
      `;

      await pool.execute(sql, [amount, id]);

      return res.status(200).json({
        success: true
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