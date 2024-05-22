import axios from "axios";

const ARTICLE_LIMIT = 5; 

// Zennの記事を取得
const zennTitle = '【<https://zenn.dev/|Zenn>のトレンド記事】\n'
const zennArticles = await axios.get("https://zenn.dev/api/articles/");
const zennArticlesList = zennArticles.data.articles.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<https://zenn.dev${current.path}|${current.title}>\n` 
}, zennTitle);

// Publickeyの新着記事を取得
const publickeyTitle = '【<https://www.publickey1.jp/|Publickey>の新着記事】\n'
const publickeyArticles = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://www.publickey1.jp/atom.xml') 
const publickeyArticlesList = publickeyArticles.data.items.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<${current.link}|${current.title}>\n` 
}, publickeyTitle);

// Qiitaのトレンド記事を取得
const qiitaTitle = '【<https://qiita.com/trend|Qiita>のトレンド記事】\n'
const qiitaArticles = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://qiita.com/popular-items/feed') 
const qiitaArticlesList = qiitaArticles.data.items.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<${current.link}|${current.title}>\n` 
}, qiitaTitle);

// はてなブックマークテクノロジーのトレンド記事を取得
const hatenaTitle = '【<https://b.hatena.ne.jp/hotentry/it|はてなブックマーク(テクノロジー)>のトレンド記事】\n'
const hatenaArticles = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://b.hatena.ne.jp/hotentry/it.rss') 
const hatenaArticlesList = hatenaArticles.data.items.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<${current.link}|${current.title}>\n` 
}, hatenaTitle);

// ITmediaの新着記事を取得
const itMediaTitle = '【<https://www.itmedia.co.jp/|ITmedia>の新着記事】\n'
const itMediaArticles = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://rss.itmedia.co.jp/rss/2.0/topstory.xml') 
const itMediaArticlesList = itMediaArticles.data.items.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<${current.link}|${current.title}>\n` 
}, itMediaTitle);

// TechCrunchの新着記事を取得
const techCrunchTitle = '【<https://techcrunch.com/|TechCrunch>の新着記事】\n'
const techCrunchArticles = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://techcrunch.com/feed/') 
const techCrunchArticlesList = techCrunchArticles.data.items.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<${current.link}|${current.title}>\n` 
}, techCrunchTitle);

const articles = ':robot_face:*本日の技術記事*' + "```" + `${hatenaArticlesList}\n${publickeyArticlesList}\n${zennArticlesList}\n${qiitaArticlesList}\n${itMediaArticlesList}\n${techCrunchArticlesList}` + "```";

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
