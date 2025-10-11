import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname)); // ← index.html と CSS, JS を配信する

app.get("/templates", (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, "templates", "templates.json"), "utf8");
  res.setHeader("Content-Type", "application/json");
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
const app = express();

app.use(bodyParser.json());
app.use(express.static('.'));

const TEMPLATE_FILE = './templates.json';

// 定型文の取得
app.get('/templates', (req, res) => {
  fs.readFile(TEMPLATE_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send({ error: 'テンプレートを読み込めません。' });
    res.send(JSON.parse(data));
  });
});

// 定型文の保存
app.post('/save-template', (req, res) => {
  const newTemplates = req.body;
  fs.writeFile(TEMPLATE_FILE, JSON.stringify(newTemplates, null, 2), (err) => {
    if (err) return res.status(500).send({ error: 'テンプレートを保存できません。' });
    res.send({ message: 'テンプレートを保存しました！' });
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
