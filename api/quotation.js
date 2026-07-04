import pool from "./db.js";

const allowedOrigin = "https://deparmentmanagementwebsite.shailimanamperi2002.workers.dev";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  // ✅ MUST apply CORS on EVERY request
  setCors(res);

  // ✅ FIX: preflight request (this is what browser sends first)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // =========================
  // POST: Save quotation
  // =========================
  if (req.method === "POST") {
    try {
      const {
        quote_ref,project_name,client_name,scope,sale_center,sales_person,value_amount,gp_amount,status,date,revision_count,remark,profit
      } = req.body;

      const sql = `
        INSERT INTO quotations
        (quote_ref, project_name, client_name, scope, sale_center, sales_person, value_amount, gp_amount, status,quotation_date, revision_count, remark,profit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
      `;

      const [result] = await pool.execute(sql, [
        quote_ref,project_name,client_name, scope,sale_center,sales_person,value_amount,gp_amount,status,date,revision_count,remark,profit
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

  if (req.method === "GET") {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM quotations ORDER BY id DESC"
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