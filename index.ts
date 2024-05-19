const { WebClient } = require('@slack/web-api');

(async () => {
  // OAuth トークン
  const token  = 'xoxb-6600661338418-7142231146308-WOzQWYz9kdW8Y0gl2DgbhWs9';
  // #チャンネル名 of @ユーザー名
  const channel = '#エンジニアリング';
  // メッセージ
  const text = '*Hello World*';

  const client = new WebClient(token);
  const response = await client.chat.postMessage({ channel, text });

  // 投稿に成功すると `ok` フィールドに `true` が入る。
  console.log(response.ok);
  // => true
})();
