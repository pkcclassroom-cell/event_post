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
