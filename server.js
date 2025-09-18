import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = "./uploads";

// Tạo thư mục uploads nếu chưa có
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Middleware
app.use(express.static("."));
app.use(express.json());
app.use(cors());

// Multer: lưu file với tên timestamp + đuôi gốc
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// Upload ảnh
app.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const file = req.file;
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.headers.host;

    const link = `${protocol}://${host}/uploads/${file.filename}`;
    res.json({ link });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Serve folder uploads
app.use("/uploads", express.static(UPLOAD_DIR));

app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
