import QRCode from "qrcode";
import pool from "./db.js";

const allowedOrigin = "https://parkinglotmanagementsystem.shailimanamperi2002.workers.dev";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

export default async function handler(req, res) {
  setCors(res);

  // 🔥 IMPORTANT: must return early for preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // =====================
  // POST VEHICLE
  // =====================
  if (req.method === "POST") {
    try {
      const {
        vehicleNo,
        ownerName,
        contact,
        nic,
        vehicleType,
        paymentType
      } = req.body;

      const qrData = JSON.stringify({
        vehicleNo,
        vehicleType,
        paymentType
      });

      const qrImage = await QRCode.toDataURL(qrData);

      const sql = `
        INSERT INTO Vehicle
        (
          vehicleNo,
          ownerName,
          contact,
          nic,
          vehicleType,
          paymentType,
          qrCode
        )
        VALUES (?,?,?,?,?,?,?)
      `;

      const [result] = await pool.execute(sql, [
        vehicleNo,
        ownerName,
        contact,
        nic,
        vehicleType,
        paymentType,
        qrImage
      ]);

      return res.status(200).json({
        success: true,
        id: result.insertId,
        qr: qrImage
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