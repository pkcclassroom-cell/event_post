import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import bodyParser from "body-parser";
import Twitter from "twitter-lite";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname)); // index.html, style.css, script.jsなど
app.use(bodyParser.json());

const TEMPLATE_FILE = path.join(__dirname, "templates.json");

// -----------------
// 定型文取得・保存
// -----------------
app.get("/templates", (req, res) => {
  fs.readFile(TEMPLATE_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send({ error: "テンプレートを読み込めません。" });
    res.send(JSON.parse(data));
  });
});

app.post("/save-template", (req, res) => {
  const newTemplates = req.body;
  fs.writeFile(TEMPLATE_FILE, JSON.stringify(newTemplates, null, 2), (err) => {
    if (err) return res.status(500).send({ error: "テンプレートを保存できません。" });
    res.send({ message: "テンプレートを保存しました！" });
  });
});

// -----------------
// X (Twitter) 投稿用
// -----------------
app.post("/post-tweet", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).send({ error: "status が必要です。" });

    const client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    const response = await client.post("statuses/update", { status });
    res.send({ success: true, tweet: response });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "ツイートに失敗しました", details: err });
  }
});

// -----------------
// サーバ起動
// -----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
