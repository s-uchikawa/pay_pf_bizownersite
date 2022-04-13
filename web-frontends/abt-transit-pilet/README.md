# はじめに

このPiletは地点管理機能を提供します。

# 開発環境の構築

## npmモジュールのインストール
   このフォルダ内で以下のコマンドを実行し、開発に必要なnpmモジュールをインストールします。
   ```
   yarn install
   ```

# 開発

## ビルド

```
yarn build:dev
```
src/styles/tailwind.cssが作成され、distにemulatorとrelaseが作成されます。

## ローカル環境での実行

ローカル環境で実行するには次のコマンドを実行します。
```
yarn start
```
http://localhost:1234 で動作を確認します。

