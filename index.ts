import axios from "axios";

// Zennの記事を取得
const zennTitle = '【Zennのトレンド】\n'
const zennArticles = await axios.get("https://zenn.dev/api/articles/");
const zennArticlesList = zennArticles.data.articles.slice(0, 5).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<https://zenn.dev${current.path}|${current.title}>\n` 
}, zennTitle);

// Publickeyの新着記事を取得
const publickeyTitle = '【publickeyの新着記事】\n'
const publickeyArticles = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://www.publickey1.jp/atom.xml') 
const publickeyArticlesList = publickeyArticles.data.items.slice(0, 5).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<https://zenn.dev${current.link}|${current.title}>\n` 
}, publickeyTitle);

// Qiitaのトレンド記事を取得
const qiitaTitle = '【Qiitaのトレンド記事】\n'
const qiitaArticles = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://qiita.com/popular-items/feed') 
const qiitaArticlesList = qiitaArticles.data.items.slice(0, 5).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<https://zenn.dev${current.link}|${current.title}>\n` 
}, qiitaTitle);

const articles = ':robot_face:*今日の技術記事*' + "```" + `${zennArticlesList}\n${publickeyArticlesList}\n${qiitaArticlesList}` + "```";

const postData = new URLSearchParams();

postData.append('token', Bun.env.SLACK_BOT_TOKEN || "");
postData.append('channel', '#エンジニアリング');
postData.append(
  'text',
  `${articles}`
);

axios.post('https://slack.com/api/chat.postMessage', postData)
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
