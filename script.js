document.querySelector("form").addEventListener("submit", function(event) {
  event.preventDefault(); // ページリロード防止

  const title = document.getElementById("title").value;
  const tournament = document.getElementById("tournament").value;
  const participants = document.getElementById("participants").value;
  const winner = document.getElementById("winner").value;
  const deck = document.getElementById("deck").value;

  const message = `
本日の #${title} #${tournament} は
${participants}名様にて開催🎉

優勝は
🏆${winner} さん
【#${deck}】

おめでとうございます！
  `;

  console.log(message);
  alert("生成された文章:\n" + message);
});
