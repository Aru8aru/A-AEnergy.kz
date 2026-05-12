import Code from "./models/Code.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Простое подключение без лишних опций
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB подключена'))
  .catch(err => console.error('❌ MongoDB ошибка:', err.message));

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    await Code.creaыte({
  email,
  code
});

    if (!email || !code) {
      return res.status(400).json({
        error: "Email or code missing",
      });
    }

    const data = await resend.emails.send({
      from: "SCADA Security <onboarding@resend.dev>",
      to: email,
      subject: "🔐 SCADA KZ-01: Код двухфакторной аутентификации",
      html: `
      <div style="
        background:#020817;
        color:white;
        padding:40px;
        font-family:Arial;
      ">
        <h1 style="color:#00ffd5;">
          SCADA KZ-01
        </h1>

        <p>
          Для входа в систему используйте код:
        </p>

        <div style="
          font-size:42px;
          letter-spacing:8px;
          font-weight:bold;
          color:#00ffd5;
          margin:30px 0;
        ">
          ${code}
        </div>

        <p>
          Код действует 5 минут.
        </p>

        <p style="color:#ffcc00;">
          Никому не сообщайте этот код.
        </p>
      </div>
      `,
    });

    res.json({
      success: true,
      data,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Email sending failed",
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});