import express from "express";
import multer from "multer";
import fs from "fs";

const app = express();
const PORT = 3000;
const DATA_FILE = "./backend/data.json";

// Middleware
app.use(express.json());
app.use(express.static("frontend"));

// Dùng multer để nhận file upload (lưu vào RAM, không lưu ra ổ cứng)
const upload = multer({ storage: multer.memoryStorage() });

// Nếu chưa có data.json thì tạo mới
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ images: {} }, null, 2));
}

// Hàm load/save JSON
function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API upload ảnh
app.post("/upload", upload.single("image"), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      console.error("❌ Không nhận được file!");
      return res.status(400).send("No file uploaded");
    }

    console.log("✅ Nhận file:", file.originalname, file.mimetype);

    const data = loadData();
    const id = Date.now().toString();

    const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    data.images[id] = {
      mime: file.mimetype,
      data: base64
    };
    saveData(data);

    const link = `http://localhost:${PORT}/image/${id}`;
    console.log("📸 Link ảnh:", link);

    res.json({ link });
  } catch (err) {
    console.error("🔥 Lỗi upload:", err);
    res.status(500).send("Internal Server Error");
  }
});


// API xem ảnh qua link
app.get("/image/:id", (req, res) => {
  const { id } = req.params;
  const data = loadData();

  if (!data.images[id]) return res.status(404).send("Image not found");

  const img = data.images[id];
  const base64Data = img.data.split(",")[1];
  const buffer = Buffer.from(base64Data, "base64");

  res.set("Content-Type", img.mime);
  res.send(buffer);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
