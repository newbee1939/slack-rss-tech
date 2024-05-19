import axios from "axios";

// Zennの記事を取得
const zennArticles = await axios.get("https://zenn.dev/api/articles/");
const zennArticlesList = zennArticles.data.articles.slice(0, 5).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<https://zenn.dev${current.path}|${current.title}>\n` 
}, '```') + '```';

const postData = new URLSearchParams();

postData.append('token', Bun.env.SLACK_BOT_TOKEN || "");
postData.append('channel', '#エンジニアリング');
postData.append(
  'text',
  `${zennArticlesList}`
);

axios.post('https://slack.com/api/chat.postMessage', postData)
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
