import express from "express";
import TwitterLite from "twitter-lite";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(express.json());
app.use(express.static(path.join(process.cwd())));

const PORT = process.env.PORT || 10000;

// --- Twitter APIクライアント ---
// ここに自分のトークンを入れてください
const client = new TwitterLite({
  consumer_key: "huJecw8eGMmHYlKmza2adYwQt",
  consumer_secret: "D1Rn9e4b8Z2lQg4R4qpaLHX6H8SJ5nL9AAHj5w81gIuo3jW2Pb",
  access_token_key: "1638795375023902720-tJ4mhTTPWkMrHoXMRM57LU6iUTDxum",
  access_token_secret: "9KMyGrpBmYeYC3x8oaA95n8h1V6L47Mi7JPUH0vT4ouQK",
});

// --- 投稿エンドポイント ---
app.post("/post", upload.single("image"), async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).send({ error: "message が必要です" });

    let mediaId = null;

    // 画像がある場合はアップロード
    if (req.file) {
      const b64content = fs.readFileSync(req.file.path, { encoding: "base64" });
      const mediaResponse = await client.post("media/upload", { media_data: b64content });
      mediaId = mediaResponse.media_id_string;
      fs.unlinkSync(req.file.path); // アップロード後に削除
    }

    const params = { status: message };
    if (mediaId) params.media_ids = mediaId;

    const tweet = await client.post("statuses/update", params);
    res.send({ success: true, tweet });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
