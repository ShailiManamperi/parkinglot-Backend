import QRCode from "qrcode";
import pool from "./db.js";

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