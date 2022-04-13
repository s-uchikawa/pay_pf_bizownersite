# 開発環境

1. 開発中のnpmパッケージをローカルで確認するためにyalcをインストールします。  
   ```
   yarn global add yalc
   ```

1. npmパッケージのインストール

   package.jsonに記載された依存モジュールをインストールします。
   ※ 開発対象のモジュールのみでOK
   ```
   cd web-frontends/{各モジュール}
   yarn install
   ```

# デバッグ

1. ローカルデバッグ

   - web-frontendsの実行  
     1. web-frontendsの下の各フォルダのREADME.mdを参照して下さい。

     1. ログイン画面は用意されていないのでモバロケのメインWEBからCookieにトークンを格納して遷移しない場合は、次の手順を行い認証情報を格納します。
     
     1. https://localhost:1234 を開きます

     1. モバロケのトークンを取得します。  
        例. 日本のステージング環境
        ```
        curl -X POST "https://stg-ajt-mloca-eb.mcapps.jp/api/v1/Tokens" -H "accept: application/json" -H "Content-Type: application/json-patch+json" -d "{\"customerCd\":\"MCDEMO\",\"userId\":\"mc\",\"password\":\"mc\",\"gtfsFeedId\":0}"
        ```
     
     1. LocalStorageにモバロケのトークンを格納  
        ブラウザの開発者ツールのコンソールから次のコマンドを実行
        ```
        localStorage.setItem('mloca_token', '<取得したアクセストークン("accessToken":"(この部分)", "idToken":・・・)>');
        ```

# デプロイ

## mloca-bff

1. dockerイメージをECRへプッシュ
   1. 次のコマンドでコンテナイメージを作成します。
      ※ ルートパス(deploymentsフォルダの一つ上の階層)から実行します
      ```
      docker build -t mloca-bff:latest -f deployments/docker/Dockerfile .

      ```
   1. コンテナイメージのタグ付け
      ```
　    --　ステージング
      docker tag mloca-bff:latest 984452622757.dkr.ecr.us-west-1.amazonaws.com/mloca-bff:<バージョン>

　    --　本番
      docker tag mloca-bff:latest 128027848612.dkr.ecr.ap-northeast-1.amazonaws.com/mloca-bff:<バージョン>
      ```

   1. ECRにコンテナイメージをプッシュ
      ※ 事前にAWS ECRでリポジトリを選択し、URIを確認

      ```
　    --　ステージング
      docker push 984452622757.dkr.ecr.us-west-1.amazonaws.com/mloca-bff:<バージョン>

　    --　本番
      docker push 128027848612.dkr.ecr.ap-northeast-1.amazonaws.com/mloca-bff:<バージョン>
      ```

      Your Authorization Token has expired. Please run ‘aws ecr get-login’ to fetch a new one.
      や
      denied: Your authorization token has expired. Reauthenticate and try again.
      というメッセージが出た場合は、
      ```
      # AWS Cli 1の場合
      aws ecr get-login --region us-west-1
 
      # 取得した結果を打ち込む  
      docker login -u AWS -p トークン https://984452622757.dkr.ecr.us-west-1.amazonaws.com
      ※ -e none は不要！！

      # AWS Cli 2の場合
      -- ステージング
      aws ecr get-login-password | docker login --username AWS --password-stdin https://984452622757.dkr.ecr.us-west-1.amazonaws.com      

      -- 本番
      aws ecr get-login-password | docker login --username AWS --password-stdin https://128027848612.dkr.ecr.ap-northeast-1.amazonaws.com      
      ```
## paypf-bizowner-piral

1. paypf-bizowner-ui-elementsフォルダに移動し以下のコマンドを実行しアプリケーションをビルドします
   ```
   yarn build
   ```
   ※ 以前のデプロイから変更がある場合は、package.jsonのversionが更新されていることを確認してください

1. paypf-bizowner-piralフォルダに移動し以下のコマンドを実行しアプリケーションをビルドします
   ```
   yarn install

   -- ステージング
   yarn build:stg
   -- 本番
   yarn build:prod
   ```
   ※ 以前のデプロイから変更がある場合は、package.jsonのversionが更新されていることを確認してください

1. S3へアップロード
   ```
   aws s3 sync <ローカルパス> s3://<s3パケット> --delete --include "*" --acl public-read

   -- ステージング
   aws s3 sync ./dist/release s3://staging-mloca5-web --delete --include "*" --acl public-read --profile <AWSプロファイル名>

   -- 本番
   aws s3 sync ./dist/release s3://mloca5-web --delete --include "*" --acl public-read --profile <AWSプロファイル名>

   ```

1. CloudFrontのキャッシュをクリア
   ```
   aws cloudfront create-invalidation --distribution-id <distribution_ID> --paths "/*"
   
   -- ステージング
   aws cloudfront create-invalidation --distribution-id E2EM1GYPDH88YO --paths "/*" --profile <AWSプロファイル名>

   -- 本番
   aws cloudfront create-invalidation --distribution-id E1A5J8QB2TFYQJ --paths "/*" --profile <AWSプロファイル名>
   ```

## pilet

Piral Cloud Servicesを使います。
Freeプランだと10Piletまでしか登録できないようなので、超えそうな場合は[サンプル実装](https://github.com/smapiot/sample-pilet-service)を元に自前実装とする。
※ サンプル実装は設定がメモリに保持されてるっぽいのでDBに保持できるように改修が必要そうです。  
[参考サイト](https://docs.piral.io/guidelines/tutorials/03-publishing-pilets)

1. 事前条件
   - [piralフィードサービス](https://www.piral.cloud/)でフィードを作成済み. (内川のMicrosoft個人アカウントで作成してます。)  
     - フィード名: mloca5(ステージング),   mloca5_prod(本番)
     - 許可するホスト: mloca5.us-west.gmc-apps.com, v5.mloca.com  
   - paypf-bizowner-piral/index.tsxのfeedUrlに作成したフィードのURLが設定されている
     - フィードURL: https://feed.piral.cloud/api/v1/pilet/mloca5(ステージング), https://feed.piral.cloud/api/v1/pilet/mloca5_prod(本番)
   - フィードにアップロードするためのAPIキーが作成済み(APIキーの期限は1年) ※ 現在日=2021/12/14  
     - APIキー: 
       - 6db70430084df3ceec4bba54c0315ecba11a1fea323c1c43826500be4d8a4147(ステージング)
       - 8fe3c879c5155ab62f45ae1bd537a63f44369b634201ffd0547fa558c8c90d57(本番)

1. piletのフォルダで以下のコマンドを実行
   ```
   (ステージング)
   npx pilet publish --fresh --url https://feed.piral.cloud/api/v1/pilet/mloca5 --api-key 6db70430084df3ceec4bba54c0315ecba11a1fea323c1c43826500be4d8a4147

   (本番)
   npx pilet publish --fresh --url https://feed.piral.cloud/api/v1/pilet/mloca5_prod --api-key 8fe3c879c5155ab62f45ae1bd537a63f44369b634201ffd0547fa558c8c90d57
   ```
   ※ 以前のデプロイから変更がある場合は、package.jsonのversionが更新されていることを確認してください

# 開発ガイドライン

## アーキテクチャ

### 概要

次のような構成をとります。  
Piral (１) --> (＊) Pilets (＊) --> (１) API Gateway (１) --> (＊) BFF (＊) --> (＊) Microservers

[Piral](https://piral.io/), Piletsは、WEBフロントエンドを構成します。これはJavascriptフレームワークです。Piralはマイクロフロントエンドアーキテクチャを使ってポータルサイトを構築するのを支援するためのReactベースのフレームワークです。WEBフロントエンドの担当者は、コーディング前にガイドラインに一通り目を通すことをお勧めします。

API Gatewayより右はバックエンドの仕組みとなります。API Gatewayは省略可能です。  

BFFはBackends For Frontendsの略で、フロントエンドの要求に最適化されたAPIを提供します。PiletとBFFは多:1の関係となります。  
例えば、以下のような依存関係となります。  
- Pilet A -> BFF A  
- Pilet B -> BFF BC  
- Pilet C -> BFF BC  

PiletやBFFの分割方針は開発チーム単位だったり、機能グループ単位だったり、技術分野単位だったり、その時の状況に応じて適宜決定をして下さい。

### ユーザー認証

モバロケのメインWEBサイトで認証されたトークンがCookieで渡されます。(キーは"mcapps_shared_token")。
web-frontendsのURLドメインはモバロケのメインWEBサイトのURLドメインと同じである必要があります。

## 依存ライブラリ

開発時に主に利用するライブラリは以下。これらについて事前にある程度の学習を要する。
- ReactJS  
  https://ja.reactjs.org/

- Piral  
  マイクロフロントエンドアーキテクチャを使ってポータルサイトを構築するのを支援するためのReactベースのフレームワーク  
  https://piral.io/

- Tailwind CSS  
  CSSライブラリ。原則として独自のスタイルの定義は極力禁止し、Tailwind CSSで定義されたクラスを利用してスタイリングを行うこととする。  
  https://tailwindcss.com/  

- Formik  
  ReactでFormを扱う際に便利なライブラリ  
  https://formik.org/  

- Yup  
  バリデーションライブラリ。Formikと組み合わせて利用する。  
  https://github.com/jquense/yup


# Tips

## Tailwind CSSを利用する

PiletでTailwind CSSを利用したい場合の手順を以下に記す。　　

https://tailwindcss.com/docs/installation

参考資料: https://github.com/tsukhu/piral-experiments/tree/master/my-pilet

1. PostCSSをインストールします
   ```
   npm install -D tailwindcss@latest postcss@latest postcss-cli@latest autoprefixer@latest @fullhuman/postcss-purgecss@latest cssnano@latest cross-env@latest
   ```

1. 構成ファイル(tailwind.config.js)を作成します
   ```
   npx tailwindcss init
   ```

1. postcss.config.jsを作成します
   ```
   const tailwindcss = require("tailwindcss");
   const autoprefixer = require("autoprefixer");

   const purgecss = require("@fullhuman/postcss-purgecss")({
   content: ["./src/**/*.tsx","./src/**/*.css", "./src/index.html"],
   defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
   });


   module.exports = {
   plugins: [
      tailwindcss("./tailwind.config.js"),
      autoprefixer(),
      ...(process.env.NODE_ENV === "production"
         ? [purgecss, require("cssnano")]
         : [])
   ]
   };   
   ```

1. styles/index.pcsssにTailwind CSSを含めます
   ```
   @import "tailwindcss/base";
   @import "tailwindcss/components";
   @import "tailwindcss/utilities";
   ```

1. index.tsxにcssをインポートします
   ```
   import "./styles/tailwind.css";
   import "./styles/index.scss";   
   ```

1. package.jsonにscriptを追加します
   ```
  "scripts": {
    "debug-pilet": "pilet debug",
    "build-pilet": "pilet build",
    "build:style": "postcss src/styles/index.pcss -o src/styles/tailwind.css",
    "build": "npm run build:style && cross-env NODE_ENV=production npm run build-pilet",
    "start": "npm run build:style && npm run debug-pilet"
  },
   ```

1. CSSをビルドします
   ```
   yarn build:style
   ```
   src/styles/tailwind.cssが作成されます。


