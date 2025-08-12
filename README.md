# Git学習Webアプリケーション

インタラクティブな課題を通じて、Gitの基礎から実践的なワークフローまで体系的に学習できるWebアプリケーションです。

![Git Learning App](https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop)

## 🎯 特徴

- **段階的学習**: 7つのステージで基礎から実務レベルまで
- **実践的体験**: ブラウザ内でGitコマンドを実際に実行
- **視覚的理解**: Git状態をリアルタイムで可視化
- **チーム開発シミュレーション**: 実際の開発現場を模擬体験

## 📚 学習内容

### ステージ1: Gitの基礎概念
- Gitとは何か
- 分散型バージョン管理システムの理解
- ワーキングツリー、ステージング、リポジトリの3層構造

### ステージ2: はじめてのGit
- `git init` - リポジトリの初期化
- `git add` - ファイルのステージング
- `git commit` - 変更の記録

### ステージ3: 基礎コマンドマスター
- `git status` - 現在の状態確認
- `git diff` - 変更差分の確認
- `git log` - コミット履歴の確認

### ステージ4: ブランチとマージ
- `git branch` - ブランチの作成
- `git switch` - ブランチの切り替え
- `git merge` - ブランチの統合

### ステージ5: リモートとの連携
- `git clone` - リモートリポジトリの複製
- `git push` - 変更の送信
- `git pull` - 変更の取得

### ステージ6: コンフリクト解消
- マージコンフリクトの理解
- コンフリクトマーカーの読み方
- 手動でのコンフリクト解決

### ステージ7: 実務模擬シナリオ
- GitHub Flow の実践
- Pull Request の作成
- チーム開発ワークフロー

## 🚀 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **スタイリング**: Tailwind CSS
- **アイコン**: Lucide React
- **ルーティング**: React Router DOM
- **ビルドツール**: Vite
- **Git シミュレーション**: カスタム実装

## 🛠️ セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/your-username/git-learning-app.git
cd git-learning-app

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## 📁 プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── TopPage.tsx     # トップページ
│   ├── LearningPage.tsx # 学習ページ
│   ├── Terminal.tsx    # ターミナルコンポーネント
│   ├── FileEditor.tsx  # ファイルエディタ
│   └── ...
├── hooks/              # カスタムフック
│   ├── useProgress.ts  # 学習進捗管理
│   └── useGitSimulator.ts # Gitシミュレーター
├── data/               # データ定義
│   └── stages.tsx      # ステージ・タスク定義
├── types/              # TypeScript型定義
│   └── index.ts
└── App.tsx            # メインアプリケーション
```

## 🎮 使い方

1. **トップページ**: 学習進捗の確認とステージ選択
2. **学習ページ**: 
   - 左側: タスク一覧とヒント
   - 右上: ファイルエディタ
   - 右下: Git状態の可視化
   - 下部: ターミナル（Gitコマンド実行）
3. **バッジコレクション**: 獲得したバッジの確認

## 🏆 学習の進め方

1. 各ステージの説明スライドを読む
2. 指示に従ってファイルを編集
3. ターミナルでGitコマンドを実行
4. Git状態の変化を観察
5. タスク完了後、次のタスクへ進む

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 謝辞

- [Lucide](https://lucide.dev/) - 美しいアイコンライブラリ
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク
- [Vite](https://vitejs.dev/) - 高速なビルドツール

## 📞 サポート

質問や問題がある場合は、[Issues](https://github.com/your-username/git-learning-app/issues)でお知らせください。

---

**Happy Learning! 🎓**