# サンプルアプリ

## できること

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Server as サーバー
    participant Bing as Bing検索

    Client->>Server: 質問を送信
    Server->>Bing: 関連情報を検索
    Bing-->>Server: 検索結果を返却
    Server->>Server: 回答を生成
    Server-->>Client: 回答を返却
```

## 実行手順

### 1. 環境変数を設定

`server`ディレクトリに`.env`ファイルを作成し、`.env.sample`の内容をコピーし、それぞれの値をセット。

### 2. ローカル実行

サーバーを起動。

```
cd ./server/assistant_manager_sample
docker build -t agent:0.0.1 .
docker run -p 8000:8000 agent:0.0.1
```

クライアントを起動。

```
cd client 
npm run dev
```