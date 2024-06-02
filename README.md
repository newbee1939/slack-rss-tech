# slack-rss-tech

## 構成図

![構成図](./draw.png)

## setup

以下の記事に従ってトークン等を発行する。

https://zenn.dev/kou_pg_0131/articles/slack-api-post-message

※Bot Tokenを発行するには、`App Home`で`App Display Name`とかを設定する必要がある。

## デプロイ後にCloud Storageを使ってRSSデータを永続化

1. Cloud Storageのバケットを作成する

tech-rss

2. job.ymlにvolumeの設定を追加

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
- Dockerコンテナイメージをファイルに保存、読み込み( save, load )
    - https://qiita.com/loftkun/items/2238cc238dd9c55b7514
- ジョブの Cloud Storage ボリュームのマウント
    - https://cloud.google.com/run/docs/configuring/jobs/cloud-storage-volume-mounts?hl=ja#yaml

## Dockerイメージの配布

1. `docker build . -t slack-rss-tech -f ./docker/Dockerfile`
2. `docker save slack-rss-tech > slack-rss-tech.tar`
3. `docker load < slack-rss-tech.tar` # 利用側の手順はここから
4. `docker images` # 読み込んだイメージを確認

## memo

- `git push origin main`ができない場合
    - `git push origin HEAD:main`
- 頻度は以下の通り
    - `0 9 * * 1-5`
    - 平日の朝9:30
