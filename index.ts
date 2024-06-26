import axios from "axios";
import * as fs from "node:fs/promises";

const ARTICLE_LIMIT = 6; 

// NOTE: ローカルではローカルファイルパスを、PROではvolumeのマウントパスを見る
const rssDirectoryPath = Bun.env.RSS_DIRECTORY_PATH ?? "/rss" 
const PUBLICKEY_FILE_PATH = `${rssDirectoryPath}/publickey.json`;
const ITMEDIA_FILE_PATH = `${rssDirectoryPath}/itmedia.json`;

// Zennの記事を取得
const zennTitle = '【<https://zenn.dev/|Zenn>のトレンド記事】\n'
const zennArticles = await axios.get("https://zenn.dev/api/articles/");
const zennArticlesList = zennArticles.data.articles.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<https://zenn.dev${current.path}|${Bun.escapeHTML(current.title)}>\n` 
}, zennTitle);

// Publickeyの新着記事を取得
const publickeyTitle = '【<https://www.publickey1.jp/|Publickey>の新着記事】\n'
const publickeyArticles = (await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://www.publickey1.jp/atom.xml')).data.items 

// Publickeyの前回の新着記事リンクリスト（6件）を取得
let prevPublickeyArticleLinks: any;
try {
  prevPublickeyArticleLinks = await fs.readFile(PUBLICKEY_FILE_PATH, "utf8");
} catch(error) {
  // 対象のディレクトリが存在しない場合、最初の投稿ということなので空でいい
  prevPublickeyArticleLinks = [];
}

const slicedPublickeyArticles = publickeyArticles.slice(0, ARTICLE_LIMIT);
const requiredPublickeyArticleList = slicedPublickeyArticles.filter((item: any) => {
  // NOTE: "新着"記事なので、前回の新着記事は除外する
  return !prevPublickeyArticleLinks.includes(item.link);
});

const publickeyArticlesList = requiredPublickeyArticleList.length !== 0 ? requiredPublickeyArticleList.reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<${current.link}|${Bun.escapeHTML(current.title)}>\n` 
}, publickeyTitle) : `${publickeyTitle}新着記事はありません\n`;

// 今回のPublickeyの記事リンクリストで上書き
const currentPublickeyArticleLinks = slicedPublickeyArticles.map((item: any) => {
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

// ITmediaの前回の新着記事リンクリスト（6件）を取得
let prevItMediaArticleLinks: any;
try {
  prevItMediaArticleLinks = await fs.readFile(ITMEDIA_FILE_PATH, "utf8");
} catch(error) {
  // 対象のディレクトリが存在しない場合、最初の投稿ということなので空でいい
  prevItMediaArticleLinks = [];
}

const slicedItMediaArticles = itMediaArticles.data.items.slice(0, ARTICLE_LIMIT);
const requiredItMediaArticleList = slicedItMediaArticles.filter((item: any) => {
  // NOTE: "新着"記事なので、前回の新着記事は除外する
  return !prevItMediaArticleLinks.includes(item.link);
});

const itMediaArticlesList = requiredItMediaArticleList.length !== 0 ? requiredItMediaArticleList.reduce((prev: any, current: any, index: any) => {
  return prev + ' ' + `${index + 1}.<${current.link}|${Bun.escapeHTML(current.title)}>\n` 
}, itMediaTitle) : `${itMediaTitle}新着記事はありません\n`;

// 今回のITMediaの記事リンクリストで上書き
const currentItMediaArticleLinks = slicedItMediaArticles.map((item: any) => {
  return item.link;
})
await fs.writeFile(ITMEDIA_FILE_PATH, JSON.stringify(currentItMediaArticleLinks, null, 2), 'utf8');

const articles = ':sunny:*おはようございます！今日の技術記事です！*' + "```" + `${hatenaArticlesList}\n${publickeyArticlesList}\n${zennArticlesList}\n${qiitaArticlesList}\n${itMediaArticlesList}` + "```";

const postData = new URLSearchParams();

postData.append('token', Bun.env.SLACK_BOT_TOKEN || "");
postData.append('channel', '#エンジニアリング');
// postData.append("channel", "#times_hide");
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
