# slack-rss-tech

## 初期インストール

1. npm init
2. npm install bun
3. package.jsonのscripsに`"bun": "bun"`を追加
4. npm run bun init
- index.ts
- tsconfig.json
5. ngrok(Docker)準備
6. ngrok.ymlと.env作成
```shell
cp docker/ngrok.yml.example docker/ngrok.yml
cp .env.example .env
```
7. ngrok.ymlの`NGROK_AUTH_TOKEN`にngrokのトークンを設定

Your Authtoken: https://dashboard.ngrok.com/get-started/your-authtoken

8. コンテナ立ち上げ

`docker compose up -d`

9. localhost:4040にアクセスしてhttpsのエンドポイントURLを取得

10. エンドポイントのURLを以下のSlack Appのページに設定

https://api.slack.com/apps/A06HKQ009TP/event-subscriptions

設定URLの例: https://9b57-210-194-190-35.ngrok-free.app/slack/events

11. Slackアプリの設定

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

## TODO

- 使用技術・やっていることを深いところで理解
- secretをあげてしまったので新しくリポジトリ作って今のは消す