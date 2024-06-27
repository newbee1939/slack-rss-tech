import * as fs from "node:fs/promises";

const ARTICLE_LIMIT = 6; 

// NOTE: ローカルではローカルファイルパスを、PROではvolumeのマウントパスを見る
const rssDirectoryPath = Bun.env.RSS_DIRECTORY_PATH ?? "/rss" 
const PUBLICKEY_FILE_PATH = `${rssDirectoryPath}/publickey.json`;
const ITMEDIA_FILE_PATH = `${rssDirectoryPath}/itmedia.json`;

const makeZennArticleList = async () => {
  // Zennの記事を取得
  const zennTitle = '【<https://zenn.dev/|Zenn>のトレンド記事】\n'
  const zennArticles = await (await fetch("https://zenn.dev/api/articles/")).json();
  const zennArticleList = zennArticles.articles.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
    return prev + ' ' + `${index + 1}.<https://zenn.dev${current.path}|${Bun.escapeHTML(current.title)}>\n` 
  }, zennTitle);

  return zennArticleList;
}

const makePublickeyArticleList = async () => {
  // Publickeyの新着記事を取得
  const publickeyTitle = '【<https://www.publickey1.jp/|Publickey>の新着記事】\n'
  const publickeyArticles = (await(await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.publickey1.jp/atom.xml')).json()).items 

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

  const publickeyArticleList = requiredPublickeyArticleList.length !== 0 ? requiredPublickeyArticleList.reduce((prev: any, current: any, index: any) => {
    return prev + ' ' + `${index + 1}.<${current.link}|${Bun.escapeHTML(current.title)}>\n` 
  }, publickeyTitle) : `${publickeyTitle}新着記事はありません\n`;

  // 今回のPublickeyの記事リンクリストで上書き
  const currentPublickeyArticleLinks = slicedPublickeyArticles.map((item: any) => {
    return item.link;
  })
  await fs.writeFile(PUBLICKEY_FILE_PATH, JSON.stringify(currentPublickeyArticleLinks, null, 2), 'utf8');

  return publickeyArticleList;
}

const makeQiitaArticleList = async () => {
  // Qiitaのトレンド記事を取得
  const qiitaTitle = '【<https://qiita.com/trend|Qiita>のトレンド記事】\n'
  const qiitaArticles = await (await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://qiita.com/popular-items/feed')).json();
  const qiitaArticleList = qiitaArticles.items.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
    return prev + ' ' + `${index + 1}.<${current.link}|${Bun.escapeHTML(current.title)}>\n` 
  }, qiitaTitle);

  return qiitaArticleList;
}

const makeHatenaArticleList = async () => {
  // はてなブックマークテクノロジーのトレンド記事を取得
  const hatenaTitle = '【<https://b.hatena.ne.jp/hotentry/it|はてなブックマーク(テクノロジー)>のトレンド記事】\n'
  const hatenaArticles = await (await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://b.hatena.ne.jp/hotentry/it.rss')).json();
  const hatenaArticleList = hatenaArticles.items.slice(0, ARTICLE_LIMIT).reduce((prev: any, current: any, index: any) => {
    return prev + ' ' + `${index + 1}.<${current.link}|${Bun.escapeHTML(current.title)}>\n` 
  }, hatenaTitle);

  return hatenaArticleList;
}

const makeItmediaArticleList = async () => {
  // ITmediaの新着記事を取得
  const itMediaTitle = '【<https://www.itmedia.co.jp/|ITmedia>の新着記事】\n';
  const itMediaArticles = await (await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://rss.itmedia.co.jp/rss/2.0/topstory.xml')).json();

  // ITmediaの前回の新着記事リンクリスト（6件）を取得
  let prevItMediaArticleLinks: any;
  try {
    prevItMediaArticleLinks = await fs.readFile(ITMEDIA_FILE_PATH, "utf8");
  } catch(error) {
    // 対象のディレクトリが存在しない場合、最初の投稿ということなので空でいい
    prevItMediaArticleLinks = [];
  }

  const slicedItMediaArticles = itMediaArticles.items.slice(0, ARTICLE_LIMIT);
  const requiredItMediaArticleList = slicedItMediaArticles.filter((item: any) => {
    // NOTE: "新着"記事なので、前回の新着記事は除外する
    return !prevItMediaArticleLinks.includes(item.link);
  });

  const itMediaArticleList = requiredItMediaArticleList.length !== 0 ? requiredItMediaArticleList.reduce((prev: any, current: any, index: any) => {
    return prev + ' ' + `${index + 1}.<${current.link}|${Bun.escapeHTML(current.title)}>\n` 
  }, itMediaTitle) : `${itMediaTitle}新着記事はありません\n`;

  // 今回のITMediaの記事リンクリストで上書き
  const currentItMediaArticleLinks = slicedItMediaArticles.map((item: any) => {
    return item.link;
  })
  await fs.writeFile(ITMEDIA_FILE_PATH, JSON.stringify(currentItMediaArticleLinks, null, 2), 'utf8');

  return itMediaArticleList;
}

const postTechArticleList = async () => {
  const zennArticleList = await makeZennArticleList(); 

  const publickeyArticleList = await makePublickeyArticleList();

  const qiitaArticleList = await makeQiitaArticleList();

  const hatenaArticleList = await makeHatenaArticleList();

  const itMediaArticleList = await makeItmediaArticleList();

  const articles = ':sunny:*おはようございます！今日の技術記事です！*' + "```" + `${hatenaArticleList}\n${publickeyArticleList}\n${zennArticleList}\n${qiitaArticleList}\n${itMediaArticleList}` + "```";

  const postData = new URLSearchParams();

  postData.append('token', Bun.env.SLACK_BOT_TOKEN || "");
  postData.append('channel', '#エンジニアリング');
  // postData.append("channel", "#times_hide");
  postData.append('text', `${articles}`);

  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: postData.toString()
  })
  console.log(await response.json());
}

try {
  postTechArticleList();
} catch (e) {
  console.log(e);
}