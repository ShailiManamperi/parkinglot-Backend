import QRCode from "qrcode";
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
  if(req.method==="POST"){

    try{

        const{
            vehicleNo,
            ownerName,
            contact,
            nic,
            vehicleType,
            paymentType
        }=req.body;

        const qrData=JSON.stringify({

            vehicleNo,
            vehicleType,
            paymentType

        });

        const qrImage=await QRCode.toDataURL(qrData);

        const sql=`
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
        VALUES(?,?,?,?,?,?,?)
        `;

        const[result]=await pool.execute(sql,[

            vehicleNo,
            ownerName,
            contact,
            nic,
            vehicleType,
            paymentType,
            qrImage

        ]);

        res.json({

            success:true,
            id:result.insertId,
            qr:qrImage

        });

    }catch(err){

        res.status(500).json({

            success:false,
            error:err.message

        });

    }

}

  return res.status(405).json({ message: "Method Not Allowed" });
}

