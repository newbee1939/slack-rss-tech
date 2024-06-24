import axios from "axios";
import * as fs from "node:fs/promises";

const ARTICLE_LIMIT = 5; 

// NOTE: ローカルではローカルファイルパスを、PROではvolumeのマウントパスを見る
const publickeyDirectoryPath = Bun.env.PUBLICKEY_DIRECTORY_PATH ?? "/rss" 
const PUBLICKEY_FILE_PATH = `${publickeyDirectoryPath}/publickey.json`;

// Zennの記事を取得
const zennTitle = '【<https://zenn.dev/|Zenn>のトレンド記事】\n'
const zennArticles = await axios.get("https://zenn.dev/api/articles/");
const zennArticlesList = zennArticles.data.articles.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<https://zenn.dev${current.path}|${Bun.escapeHTML(current.title)}>\n` 
}, zennTitle);

// Publickeyの新着記事を取得
const publickeyTitle = '【<https://www.publickey1.jp/|Publickey>の新着記事】\n'
const publickeyArticles = (await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://www.publickey1.jp/atom.xml')).data.items 

// Publickeyの前回の記事リンクリストを取得
let prevPublickeyArticleLinks: any;
try {
  prevPublickeyArticleLinks = await fs.readFile(PUBLICKEY_FILE_PATH, "utf8");
} catch(error) {
  // 対象のディレクトリが存在しない場合、作成する
  prevPublickeyArticleLinks = [];
  await fs.mkdir(publickeyDirectoryPath);
}

const requiredPublickeyArticleList = publickeyArticles.slice(0, ARTICLE_LIMIT).filter((item: any) => {
  // NOTE: "新着"記事なので、前回表示した記事は除外する
  return !prevPublickeyArticleLinks.includes(item.link);
});
const publickeyArticlesList = requiredPublickeyArticleList ? requiredPublickeyArticleList.reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<${current.link}|${Bun.escapeHTML(current.title)}>\n` 
}, publickeyTitle) : publickeyTitle;

// 今回のPublickeyの記事リンクリストで上書き
const currentPublickeyArticleLinks = requiredPublickeyArticleList.map((item: any) => {
  return item.link;
})
await fs.writeFile(PUBLICKEY_FILE_PATH, JSON.stringify(currentPublickeyArticleLinks, null, 2), 'utf8');

// Qiitaのトレンド記事を取得
const qiitaTitle = '【<https://qiita.com/trend|Qiita>のトレンド記事】\n'
const qiitaArticles = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://qiita.com/popular-items/feed') 
const qiitaArticlesList = qiitaArticles.data.items.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<${current.link}|${Bun.escapeHTML(current.title)}>\n` 
}, qiitaTitle);

// はてなブックマークテクノロジーのトレンド記事を取得
const hatenaTitle = '【<https://b.hatena.ne.jp/hotentry/it|はてなブックマーク(テクノロジー)>のトレンド記事】\n'
const hatenaArticles = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://b.hatena.ne.jp/hotentry/it.rss') 
const hatenaArticlesList = hatenaArticles.data.items.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<${current.link}|${Bun.escapeHTML(current.title)}>\n` 
}, hatenaTitle);

// ITmediaの新着記事を取得
const itMediaTitle = '【<https://www.itmedia.co.jp/|ITmedia>の新着記事】\n'
const itMediaArticles = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://rss.itmedia.co.jp/rss/2.0/topstory.xml') 
const itMediaArticlesList = itMediaArticles.data.items.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<${current.link}|${Bun.escapeHTML(current.title)}>\n` 
}, itMediaTitle);

const articles = ':robot_face:*本日の技術記事*' + "```" + `${hatenaArticlesList}\n${publickeyArticlesList}\n${zennArticlesList}\n${qiitaArticlesList}\n${itMediaArticlesList}` + "```";

const postData = new URLSearchParams();

postData.append('token', Bun.env.SLACK_BOT_TOKEN || "");
postData.append('channel', '#エンジニアリング');
postData.append(
  'text',
  `${articles}`
);

// TODO: 一旦コメントアウト
// axios.post('https://slack.com/api/chat.postMessage', postData)
//   .then(response => {
//     console.log('Response:', response.data);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
