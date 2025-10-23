// server.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Twitter = require('twitter-lite');

// Node.js v18+ の組み込み fetch ではなく node-fetch 2.x を使う
global.fetch = require("node-fetch");

const app = express();
const upload = multer({ dest: 'uploads/' });

// ← ここにあなたのアプリ用トークンを貼る
const client = new Twitter({
  consumer_key: "huJecw8eGMmHYlKmza2adYwQt",          // Consumer Key
  consumer_secret: "D1Rn9e4b8Z2lQg4R4qpaLHX6H8SJ5nL9AAHj5w81gIuo3jW2Pb",    // Consumer Secret
  access_token_key: "1638795375023902720-tJ4mhTTPWkMrHoXMRM57LU6iUTDxum",      // Access Token
  access_token_secret: "9KMyGrpBmYeYC3x8oaA95n8h1V6L47Mi7JPUH0vT4ouQK", // Access Token Secret
});

// フロント配信
app.use(express.static('.'));

// 投稿処理
app.post('/post', upload.array('images', 4), async (req, res) => {
  try {
    const text = req.body.text;
    const mediaIds = [];

    // 画像アップロード（Base64対応）
    for (const file of req.files) {
      const mediaData = fs.readFileSync(file.path, { encoding: 'base64' });
      const mediaResp = await client.post("media/upload", { media: mediaData });
      mediaIds.push(mediaResp.media_id_string);
      fs.unlinkSync(file.path); // 一時ファイル削除
    }

    // 投稿本体
    const tweetParams = { status: text };
    if (mediaIds.length > 0) {
      tweetParams.media_ids = mediaIds.join(',');
    }

    const tweet = await client.post("statuses/update", tweetParams);
    res.json({ message: "投稿成功！", data: tweet });

  } catch (err) {
    console.error(err);
    res.json({ message: "投稿失敗", error: err.toString() });
  }
});

// サーバー起動
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
