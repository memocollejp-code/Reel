# 📤 GitHub デプロイガイド

REEL-MINI をGitHub上で公開・管理するための手順書です。

---

## 📦 必須ファイル一覧

GitHub にプッシュする前に、以下のファイルすべてがリポジトリに含まれているか確認してください。

| ファイル | サイズ | 説明 |
|---------|--------|------|
| `index.html` | ~30KB | メインアプリ（全機能搭載） |
| `manifest.json` | ~500B | PWA設定ファイル |
| `sw.js` | ~1.5KB | Service Worker |
| `icon-192.png` | ~52KB | ホーム画面アイコン |
| `icon-512.png` | ~264KB | スプラッシュ画面用 |
| `README.md` | ~4KB | プロジェクト説明 |
| `.nojekyll` | 0B | GitHub Pages設定 |
| `.gitignore` | ~200B | Git除外設定 |

---

## 🚀 デプロイ手順

### ステップ1: リポジトリをクローン
```bash
git clone https://github.com/memocollejp/memocollejp-code.git
cd memocollejp-code
```

### ステップ2: ファイルをコピー
すべてのファイルをリポジトリのルートにコピーします。

```bash
# ディレクトリ構成（完成形）
.
├── index.html
├── manifest.json
├── sw.js
├── icon-192.png
├── icon-512.png
├── README.md
├── .nojekyll
└── .gitignore
```

### ステップ3: Gitにコミット
```bash
git add .
git commit -m "feat: REEL-MINI v2.0 - フォルダ・お気に入い・戻るボタン機能追加"
git push origin main
```

### ステップ4: GitHub Pages を有効化
1. リポジトリの **Settings** を開く
2. 左メニューから **Pages** を選択
3. **Source** を `main` ブランチに設定
4. **Save** をクリック

### ステップ5: 公開確認
数分待つと、以下のURLでアクセス可能になります：
```
https://memocollejp.github.io/memocollejp-code/
```

---

## 📱 PWA のインストール

### iOS（Safari）
1. Safari で `https://memocollejp.github.io/memocollejp-code/` にアクセス
2. 下部の **共有** アイコンをタップ
3. **ホーム画面に追加** をタップ
4. 名前確認後、**追加** をタップ

### Android（Chrome）
1. Chrome で `https://memocollejp.github.io/memocollejp-code/` にアクセス
2. 右上の **メニュー** (⋮) をタップ
3. **アプリをインストール** をタップ
4. **インストール** をクリック

---

## 🔄 更新方法

機能追加や修正後は以下の手順で更新します：

```bash
# 1. ローカルで開発・テスト
# ... index.html などを修正

# 2. コミット
git add .
git commit -m "fix: 修正内容を簡潔に説明"

# 3. プッシュ
git push origin main

# 4. GitHub Pages が自動更新（1-2分で反映）
```

---

## 🧪 ローカルテスト

### HTTPS で Service Worker をテスト
GitHub Pages は HTTPS で提供されるため、ローカルでも HTTPS でテストすることを推奨します。

**Python で簡単なHTTPSサーバーを起動：**

```bash
# Python 3
python -m http.server 8000

# ブラウザで http://localhost:8000 にアクセス
```

**mkcert を使ったHTTPS設定：**

```bash
# インストール（macOS）
brew install mkcert

# ローカルCAを作成
mkcert -install

# 自己署名証明書を生成
mkcert localhost 127.0.0.1

# Node.js で HTTPS サーバーを起動
npx http-server . -S -C localhost.pem -K localhost-key.pem -p 8443
```

---

## 📊 ファイルサイズ確認

アップロード前に、ファイルサイズが適切か確認します：

```bash
# macOS/Linux
du -h *

# 期待値
# icon-512.png  ~264KB
# icon-192.png  ~52KB
# index.html    ~30KB
# その他         ~5KB
# 合計          ~351KB
```

GitHub の無料プランでは容量制限がないため問題ありませんが、CDN配信を考慮して画像は圧縮推奨です。

---

## 🔐 セキュリティチェック

### ✅ XSS 対策
- `safeCreateCard()` で DOM を安全に生成
- `textContent` を使用（HTML注入防止）

### ✅ HTTPS
- GitHub Pages は自動で HTTPS 対応
- 外部APIは HTTPS エンドポイントを使用

### ✅ CSP（Content Security Policy）
現在は設定なしですが、必要に応じて `manifest.json` に追加可能：

```json
"scope": "./",
"start_url": "./index.html"
```

---

## 🐛 トラブルシューティング

### Q: Service Worker が登録されない
A: HTTPS が必要です。localhost では自動登録されます。

### Q: アイコンが表示されない
A: `icon-192.png` と `icon-512.png` がリポジトリルートにあるか確認してください。

### Q: Pages が有効にならない
A: リポジトリの Settings → Pages → Source を `main` に設定し直してください。

### Q: 古いバージョンが表示される
A: ブラウザキャッシュをクリアするか、Ctrl+Shift+R で強制リロード。

---

## 📝 コミットメッセージ例

```
feat: REEL-MINI v2.0 初版リリース
- フォルダ機能（YouTube/TikTok/Instagram/その他）
- 自動プラットフォーム判定
- お気に入い機能（★ボタン）
- 戻るボタン搭載
- データバックアップ/復元機能
- ダーク/ライトモード対応

fix: TikTok カード表示バグ修正

docs: README 更新

style: UIレイアウト調整

perf: 画像圧縮最適化
```

---

## 🎯 今後のCI/CD設定

将来的には GitHub Actions で自動テスト・デプロイを設定可能：

```yaml
# .github/workflows/deploy.yml（例）
name: Deploy to Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-pages@v2
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
      - name: Deploy to Pages
        uses: actions/deploy-pages@v1
```

---

**デプロイ完了後は、スマートフォンで実際にインストール・テストしてください！** 📱✨
