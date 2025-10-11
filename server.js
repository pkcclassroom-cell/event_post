import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 静的ファイルを配信（index.html, style.css, script.jsなど）
app.use(express.static(__dirname));
app.use(bodyParser.json());

// 定型文ファイルのパス
const TEMPLATE_FILE = path.join(__dirname, "templates.json");

// 定型文の取得
app.get("/templates", (req, res) => {
  fs.readFile(TEMPLATE_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send({ error: "テンプレートを読み込めません。" });
    res.send(JSON.parse(data));
  });
});

// 定型文の保存
app.post("/save-template", (req, res) => {
  const newTemplates = req.body;
  fs.writeFile(TEMPLATE_FILE, JSON.stringify(newTemplates, null, 2), (err) => {
    if (err) return res.status(500).send({ error: "テンプレートを保存できません。" });
    res.send({ message: "テンプレートを保存しました！" });
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
