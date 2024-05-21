# slack-rss-tech

## 初期インストール

1. Bunのインストール
2. bun install

Slackアプリの設定

以下の手順を参考に。

https://slack.dev/bolt-js/ja-jp/tutorial/getting-started

Bot Tokenを発行するには、`App Home`で`App Display Name`とかを設定する必要がある。

12. slack/boltをインストール

```shell
npm install @slack/bolt
```

13. SlackのDMでアプリにメッセージを送ったら返ってくるはず

w1707316441-wp8500715.slack.com

## 関連リンク

- 「技術メモ」SlackワークスペースのURL
    - w1707316441-wp8500715.slack.com
- Slackのアプリケーション一覧画面
    - https://api.slack.com/apps

## 参考記事

- Bolt 入門ガイド（HTTP）
    - https://slack.dev/bolt-python/ja-jp/tutorial/getting-started-http
- ZennをRSSフィードで購読する
    - https://zenn.dev/zenn/articles/zenn-feed-rss
    - https://zenn.dev/feed
    - こっちの方がいいか？
        - https://zenn.dev/api/articles/
- 『rss to json』 というサービスを使って RSS フィードを JSON として取得して表示してみよう
    - https://zenn.dev/rabee/articles/js-fetch-rss-feed-as-json
- はてなブックマークのRSSフィードのURLと確認方法
    - https://sprint-life.hatenablog.com/entry/2014/01/15/203535
- Slack API を使用してメッセージを投稿する
    - https://zenn.dev/kou_pg_0131/articles/slack-api-post-message
- スケジュールに従ってジョブを実行する
    - https://cloud.google.com/run/docs/execute/jobs-on-schedule?hl=ja

## TODO

- 使用技術・やっていることを深いところで理解
- secretをあげてしまったので新しくリポジトリ作って今のは消す
- resumeのポートフォリオと使用技術に追加
- わかったこと、学んだことをmemoに追記

## memo

- push
    - `git push origin HEAD:main`

## Bunの感想メモ

- 環境変数を`Bun.env`で読める
    - dotenv不要
- bun installが速い
- `bun run index.ts`について、Node.jsより速い？実際に試す
- TypeScriptのコンパイル不要？
    - Node.jsは必要？
    - 内部的にトランスパイルする
    - tsの実行が簡単
- package.lock.jsonではなくbun.lockbで管理する？パフォーマンスのため
