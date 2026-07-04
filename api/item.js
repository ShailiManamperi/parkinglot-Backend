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
  // POST: Add Item
  // =========================
  if (req.method === "POST") {
    try {
      const {
        type, name, brand, wattage,lumen,ip,cct,other,supplier, price} = req.body;

      const sql = `
        INSERT INTO items
        (type, name, brand, wattage, lumen, ip, cct, other, supplier, price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await pool.execute(sql, [
        type,name,brand,wattage,lumen,ip,cct,other, supplier,price
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
  // GET: Fetch Items
  // =========================
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM items ORDER BY id DESC"
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