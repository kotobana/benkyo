# benkyo

無料塾の教材・問題集・ツールをまとめるWebポータル。

- **誰でも閲覧可能**: 生徒・保護者・講師がURLを開くだけで、ログイン不要ですぐに利用できます。
- **編集は合言葉で保護**: 教材やツールの登録・編集・削除には合言葉（パスコード）が必要です。
- **3つのカテゴリ**:
  - `01 授業の前に`: 教材・問題集・授業準備
  - `02 授業の時間`: 授業中に使う道具・資料
  - `03 授業のあとに`: 振り返り・引き継ぎ・運営

## ローカルで使う

Node.js 22.12以降を使用します。

```sh
npm install
npm run dev
```

http://127.0.0.1:5173 を開きます。
ローカルでは `.local/links.json` に保存されます（Git対象外）。
ローカルのデフォルト合言葉は `benkyo` です（環境変数 `EDIT_PASSPHRASE` で変更可能）。

```sh
npm test
npm run build
```

## Cloudflare へのデプロイ

Cloudflare Workers + D1 で完全無料枠で運用できます。

1. `npx wrangler login`
2. `npx wrangler d1 create benkyo-db`
3. 出力された `database_id` を `wrangler.jsonc` の `database_id` に設定。
4. `npx wrangler d1 migrations apply benkyo-db --remote`
5. 編集用合言葉の設定:
   ```sh
   npx wrangler secret put EDIT_PASSPHRASE
   ```
6. デプロイ:
   ```sh
   npm run deploy
   ```
