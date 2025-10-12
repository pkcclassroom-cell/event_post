// プレビュー更新は既存の関数を使う
function updatePreview() {
  const titleTab = document.querySelector(".tab-button.active").textContent;
  const eventName = eventSelect.value || "<未入力>";
  const participants = participantsInput.value || "<未入力>";

  let text = `本日の #${titleTab} #${eventName} は\n`;
  text += `${participants} 名様にて開催\n\n`;

  winners.forEach((w) => {
    const name = w.name.value;
    const deck = w.deck.value;
    if (name || deck) {
      text += `優勝は 🏆 ${name} さん\n【#${deck}】\n\n`;
    }
  });

  text += "おめでとうございます！\n大会は毎日開催中！次回もぜひご参加ください！";
  previewDiv.textContent = text;
}

// 送信ボタン作成（HTML に <button id="sendBtn">送信</button> を追加）
const sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener("click", async () => {
  const tweetText = previewDiv.textContent;

  try {
    const res = await fetch("/post-tweet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: tweetText })
    });

    const data = await res.json();
    if (res.ok) {
      alert("投稿成功！ID: " + data.id_str);
    } else {
      alert("投稿失敗: " + (data.error || JSON.stringify(data)));
    }
  } catch (err) {
    console.error(err);
    alert("エラーが発生しました。コンソールを確認してください。");
  }
});

// 既存の入力イベントにプレビュー更新を追加
participantsInput.addEventListener("input", updatePreview);
eventSelect.addEventListener("change", updatePreview);
winners.forEach(w => {
  w.name.addEventListener("input", updatePreview);
  w.deck.addEventListener("input", updatePreview);
});

// 初期表示
updatePreview();
