# slack-rss-tech

## setup

以下の記事に従ってトークン等を発行する。

https://zenn.dev/kou_pg_0131/articles/slack-api-post-message

※Bot Tokenを発行するには、`App Home`で`App Display Name`とかを設定する必要がある。

## 関連リンク

- 「技術メモ」SlackワークスペースのURL
    - w1707316441-wp8500715.slack.com
- Slackのアプリケーション一覧画面
    - https://api.slack.com/apps

## 参考記事

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
    - 今回は手動設定した

## memo

- `git push origin main`ができない場合
    - `git push origin HEAD:main`
