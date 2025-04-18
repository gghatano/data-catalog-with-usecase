# データカタログ モックアプリケーション

このアプリケーションはデータカタログのモックアップです。データ名称一覧と詳細表示画面を実装しています。

## 使用方法

### 確認用：Github Pages
- [Github](https://gghatano.github.io/data-catalog-with-usecase/)にアクセスします

### 開発用：サーバーを使用して実行する方法（推奨）

1. 以下のコマンドでローカルサーバーを起動します：

```
python server.py
```

2. ブラウザで `http://localhost:8000` にアクセスします。

### スタンドアロン版を使用する方法（代替手段）

サーバーを起動できない場合は、スタンドアロン版を使用します：

1. `index-standalone.html` ファイルをブラウザで直接開きます。

### アプリの使い方

1. データカード一覧から興味のあるデータをクリックすると詳細画面に遷移します。
2. 詳細画面では以下の情報が表示されます：
   - 左側: サンプルデータ（テーブル形式）
   - 右上: ユースケース案（箇条書き）
   - 右下: データの可視化グラフ
3. 「利用申請に進む」ボタンをクリックすると、実際のアプリケーションでは申請フォームに遷移します（モック版ではアラートが表示されます）。
4. 「一覧に戻る」ボタンで一覧画面に戻ります。
5. 検索ボックスを使用してデータをキーワードで検索できます。

## 実装内容

- HTMLとCSS、JavaScriptを使用したシンプルなウェブアプリケーション
- 画面1: データ名称一覧（キーワード検索機能付き）
- 画面2: データ詳細表示（サンプルデータ、ユースケース案、グラフ表示）
- Chart.jsを使用したデータの可視化（棒グラフ、折れ線グラフ、円グラフなど）
- JSONファイルを使用したダミーデータ
- レスポンシブデザイン対応

## ダミーデータについて

以下のようなデータセットを用意しています：
- 購買行動分析データ
- 工場設備稼働データ
- 医療健康記録データ
- 都市交通流データ
- 金融取引履歴データ
- ソーシャルメディア反応データ
- 農業生産データ
- 人材採用・離職データ

## 構成ファイル

- `index.html`: メインのHTMLファイル
- `index-standalone.html`: インラインJavaScriptを使用した自己完結版
- `styles.css`: スタイルシート
- `app.js`: アプリケーションロジック
- `data/data.json`: ダミーデータ
- `server.py`: 簡易Webサーバースクリプト

## トラブルシューティング

### データ読み込みエラーが発生する場合

以下の方法を試してください：

1. Pythonサーバーを使用する（推奨）: `python server.py` を実行し、`http://localhost:8000` にアクセス
2. 代替として `index-standalone.html` を使用する: このファイルはJSONファイルを外部から読み込まずに動作します

## 注意事項

- これはモックアプリケーションであり、実際の機能は制限されています。本番環境では、バックエンドサーバー、データベース、認証機能などが必要になります。
- 合成データ、ユースケースは全て仮想のものです。
