# 開発環境

## web-frontendsの開発環境

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

## backend-apiの開発環境

1. AWS SAM CLI のインストール
   参考サイト) [Installing the AWS SAM CLI on Windows](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-windows.html)

   - Install the AWS SAM CLI [64-bit](https://github.com/aws/aws-sam-cli/releases/latest/download/AWS_SAM_CLI_64_PY3.msi)

# デバッグ

1. backend-apiの起動
   ```
   cd backend-api
   sam build
   sam local start-api
   ```
   
1. web-frontendsの実行  
   1. web-frontendsの下の各フォルダのREADME.mdを参照して下さい。

   TBD

# デプロイ

TBD

# 開発ガイドライン

## アーキテクチャ

### 概要

次のような構成をとります。  
Piral (１) --> (＊) Pilets (＊) --> (１) API Gateway (１) --> (＊) BFF (＊) --> (＊) Microservices

[Piral](https://piral.io/), Piletsは、WEBフロントエンドを構成します。これはJavascriptフレームワークです。Piralはマイクロフロントエンドアーキテクチャを使ってポータルサイトを構築するのを支援するためのReactベースのフレームワークです。WEBフロントエンドの担当者は、コーディング前にガイドラインに一通り目を通すことをお勧めします。

API Gatewayより右はバックエンドの仕組みとなります。API Gatewayは省略可能です。  

BFFはBackends For Frontendsの略で、フロントエンドの要求に最適化されたAPIを提供します。PiletとBFFは多:1の関係となります。  
例えば、以下のような依存関係となります。  
- Pilet A -> BFF A  
- Pilet B -> BFF BC  
- Pilet C -> BFF BC  

PiletやBFFの分割方針は開発チーム単位だったり、機能グループ単位だったり、技術分野単位だったり、その時の状況に応じて適宜決定をして下さい。

### ユーザー認証

TBD

## 依存ライブラリ

開発時に主に利用するライブラリは以下。これらについて事前にある程度の学習を要する。

### Webフロント

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

### バックエンド

- gqlgen  

  GraphQLのスキーマ定義ファイルからgoのコードを生成するツール

  使い方の例
  1. スケルトンプロジェクト作成  
     ```
     cd backend-api
     mkdir abt
     cd abt
     go mod init abt
     go get github.com/99designs/gqlgen
     go run github.com/99designs/gqlgen init  
     ```
     作成されたserver.goを修正(abt/server.goを参照)  
     SAMのテンプレート(backend-api/template.yaml)を修正  

   1. GraphQLのスキーマ定義ファイルを編集  
      abt/shema.graphqlsを参照

   1. 次のコマンドでGoの定義ファイル等を自動生成  
      ```
      gqlgen
      ```
      graph/model/models_gen.go や graph/schema.resolvers.go が更新される

   1. graph/schema.resolvers.goに実装コードを記述

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


