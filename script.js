document.querySelector("form").addEventListener("submit", async function(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const tournament = document.getElementById("tournament").value;
  const participants = document.getElementById("participants").value;
  const winner = document.getElementById("winner").value;
  const deck = document.getElementById("deck").value;
  const imageInput = document.getElementById("image"); // <input type="file" id="image">

  const message = `
本日の #${title} #${tournament} は
${participants}名様にて開催🎉

優勝は
🏆${winner} さん
【#${deck}】

おめでとうございます！
  `;

  const formData = new FormData();
  formData.append("message", message);

  if (imageInput.files.length > 0) {
    formData.append("image", imageInput.files[0]);
  }

  try {
    const res = await fetch("/post", { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) alert("投稿成功！");
    else alert("投稿失敗: " + JSON.stringify(data.error));
  } catch (err) {
    alert("投稿エラー: " + err);
  }
});
