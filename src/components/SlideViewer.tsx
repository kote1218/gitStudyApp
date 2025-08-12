import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, GitBranch, Users, Cloud, HardDrive, ArrowRight, CheckCircle, FileText, Terminal as TerminalIcon } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  content: React.ReactNode;
}

interface SlideViewerProps {
  slides: Slide[];
  onComplete: () => void;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({ slides, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div 
          className="bg-blue-600 h-2 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Slide Content */}
      <div className="p-8 min-h-[500px] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentSlideData.title}
          </h2>
          <div className="text-sm text-gray-500">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            {currentSlideData.content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              currentSlide === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={20} className="mr-1" />
            前へ
          </button>

          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentSlide === slides.length - 1 ? (
              <>
                <CheckCircle size={20} className="mr-2" />
                完了
              </>
            ) : (
              <>
                次へ
                <ChevronRight size={20} className="ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Git Introduction Slides
export const gitIntroSlides: Slide[] = [
  {
    id: 1,
    title: "ようこそGitの世界へ",
    content: (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-6">🌟</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          「Gitってなんか難しそう…」そう感じていませんか？
        </h3>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 text-left">
          <p className="text-lg text-gray-700 mb-4">
            実はGitは、<strong className="text-blue-600">「変更の履歴を安全に管理するノート」</strong>のような存在です。
          </p>
        </div>
        <div className="space-y-4 text-gray-600">
          <p>この学習アプリでは、Gitの基本操作をステップ・バイ・ステップで体験しながら、</p>
          <p className="font-semibold text-gray-800">プロジェクトでも迷わず使えるようになることを目指します。</p>
          <p>まずは、Gitが何をしてくれるのかをざっくりつかんでいきましょう！</p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Gitは「分散型のバージョン管理ツール」",
    content: (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            Gitは、ソースコードなどの<strong>変更履歴（バージョン）</strong>を記録して管理するツールです。
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 font-semibold">特徴的なのは「分散型」というところ。</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <HardDrive className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-green-800 mb-2">ローカル</h4>
            <p className="text-green-700">あなたのパソコンにも</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <Cloud className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-blue-800 mb-2">リモート</h4>
            <p className="text-blue-700">インターネット上（GitHub）にも</p>
          </div>
        </div>

        <div className="text-center">
          <ArrowRight className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">同じ履歴を持ったコピーが存在します</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-700">ネットがなくても作業できる</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-700">いつでもリモートと「同期」して協力作業</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "3つのレイヤーで考える：Gitの構造",
    content: (
      <div className="space-y-8">
        <p className="text-center text-lg text-gray-700">
          Gitは、以下の<strong>「3つの層」</strong>でファイルの状態を管理しています。
        </p>

        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
              <h4 className="text-lg font-semibold text-yellow-800">ワーキングツリー</h4>
            </div>
            <p className="text-yellow-700 ml-11">実際に作業するファイルたち</p>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
              <h4 className="text-lg font-semibold text-blue-800">ステージングエリア</h4>
            </div>
            <p className="text-blue-700 ml-11">これから保存するファイルたち</p>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
              <h4 className="text-lg font-semibold text-green-800">リポジトリ</h4>
            </div>
            <p className="text-green-700 ml-11">保存された変更の履歴（コミット）</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">簡単な流れ</h4>
          <div className="space-y-2 text-center">
            <p className="text-gray-700">作業する → <span className="font-semibold text-yellow-600">ワーキングツリー</span></p>
            <p className="text-gray-700">保存の準備をする → <span className="font-semibold text-blue-600">ステージングエリア</span></p>
            <p className="text-gray-700">記録する → <span className="font-semibold text-green-600">コミット（リポジトリに履歴が残る）</span></p>
          </div>
          <div className="mt-4 p-4 bg-white rounded border-2 border-dashed border-gray-300">
            <p className="text-center text-gray-600 font-medium">
              たったこれだけ。難しそうなGitも、この3ステップを理解すれば怖くありません！
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "次は実際に手を動かしてみよう！",
    content: (
      <div className="text-center space-y-8">
        <div className="text-6xl mb-6">🚀</div>
        
        <p className="text-lg text-gray-700">
          理屈だけでは、なかなか身につきません。
        </p>

        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-blue-800 font-semibold mb-4">
            これからは、実際にブラウザ内でGitを操作して、
          </p>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <code className="text-blue-600 font-mono">git init</code>
              <span className="text-gray-600 ml-2">（リポジトリの初期化）</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <code className="text-blue-600 font-mono">git add</code>
              <span className="text-gray-600 ml-2">（変更をステージする）</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <code className="text-blue-600 font-mono">git commit</code>
              <span className="text-gray-600 ml-2">（履歴として保存）</span>
            </div>
          </div>
          
          <p className="text-blue-700 mt-4">
            を順番に体験していきます。
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            1つずつクリアしながら、Gitの仕組みと流れを自然に理解していきましょう！
          </p>
          
          <div className="text-4xl font-bold text-blue-600">
            🎯 Let's Git started!
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            次のステージで実際にGitコマンドを使ってみます
          </p>
        </div>
      </div>
    )
  }
];

// Git Workflow Slide
export const gitWorkflowSlide: Slide = {
  id: 2,
  title: "Git作業の流れ 〜3ステップで記録しよう〜",
  content: (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-6">
          Gitは、以下の<strong className="text-blue-600">「3つのステップ」</strong>でファイルの変更を記録します。
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
            <h4 className="text-lg font-semibold text-yellow-800">ワーキングツリー（作業中のフォルダ）</h4>
          </div>
          <p className="text-yellow-700 ml-11">✍️ ファイルを実際に編集する場所</p>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded">
            <code className="text-blue-600 font-mono mr-2">git add</code>
            <span className="text-gray-600">↓</span>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
            <h4 className="text-lg font-semibold text-blue-800">ステージングエリア（一時的な保管場所）</h4>
          </div>
          <p className="text-blue-700 ml-11">📥 Gitに「この変更を記録していい？」と伝える場所</p>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded">
            <code className="text-green-600 font-mono mr-2">git commit</code>
            <span className="text-gray-600">↓</span>
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
            <h4 className="text-lg font-semibold text-green-800">ローカルリポジトリ（正式な記録箱）</h4>
          </div>
          <p className="text-green-700 ml-11">📚 変更をしっかり履歴として保存する場所（= .git フォルダ）</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="text-center mb-4">
          <span className="text-2xl">💡</span>
          <p className="text-gray-700 font-medium mt-2">
            この流れは<strong className="text-blue-600">ローカルリポジトリ</strong>内だけで完結します！
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 text-center">📌 たとえるなら…</h4>
          <div className="space-y-2">
            <p className="text-gray-700">✍️「ワーキングツリー」：ノートに書く</p>
            <p className="text-gray-700">📥「ステージング」：提出前の確認フォルダに入れる</p>
            <p className="text-gray-700">📚「リポジトリ」：ファイルとして正式に保管される</p>
          </div>
        </div>
      </div>
    </div>
  )
};

// Repository Introduction Slide
export const repositoryIntroSlide: Slide = {
  id: 1,
  title: "リポジトリってなに？",
  content: (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-6">
          リポジトリとは、<strong className="text-blue-600">「ファイルの変更履歴を記録する箱」</strong>のことです。
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 text-center">
          Gitには2種類のリポジトリがあります
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-4xl mb-3">🖥️</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">ローカルリポジトリ</h4>
            <p className="text-gray-600 text-sm">
              自分のPCの中にある記録箱<br />
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">(.gitフォルダ)</span>
            </p>
          </div>
          
          <div className="bg-white border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-4xl mb-3">☁️</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">リモートリポジトリ</h4>
            <p className="text-gray-600 text-sm">
              GitHubなどにある<br />
              チームと共有できる記録箱
            </p>
          </div>
        </div>
      </div>
    </div>
  )
};

// UI Guide Slides
export const uiGuideSlides: Slide[] = [
  {
    id: 1,
    title: "画面の使い方を覚えよう",
    content: (
      <div className="space-y-8">
        <div className="text-center">
          <div className="text-5xl mb-4">🖥️</div>
          <p className="text-lg text-gray-700 mb-6">
            これから実際にGitコマンドを使って学習していきます。<br />
            まずは画面の見方を覚えましょう！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <FileText className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-yellow-800 mb-2">ファイルエディタ</h4>
            <p className="text-yellow-700 text-sm">
              ファイルの内容を<br />
              確認・編集できます
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <GitBranch className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-blue-800 mb-2">Git状態表示</h4>
            <p className="text-blue-700 text-sm">
              現在のGitの状態を<br />
              視覚的に確認できます
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <TerminalIcon className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-green-800 mb-2">ターミナル</h4>
            <p className="text-green-700 text-sm">
              Gitコマンドを<br />
              入力・実行します
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">💡 使い方のコツ</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-700">左側でファイルを選択して内容を確認</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-700">右側でGitの状態変化を観察</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-gray-700">下のターミナルでコマンドを実行</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "準備完了！",
    content: (
      <div className="text-center space-y-8">
        <div className="text-6xl mb-6">🚀</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          いよいよGitコマンドを体験しましょう！
        </h3>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 text-left max-w-2xl mx-auto">
          <p className="text-lg text-gray-700 mb-4">
            最初のミッションは <code className="bg-gray-100 px-2 py-1 rounded font-mono text-blue-600">git init</code> です。
          </p>
          <p className="text-blue-600 font-semibold">
            ターミナルにコマンドを入力してEnterキーを押してください！
          </p>
        </div>
        <div className="space-y-4 text-gray-600">
          <p>わからなくなったら「ヒントを表示」や「答えを表示」ボタンを使ってくださいね。</p>
          <p className="font-semibold text-gray-800">一歩ずつ、確実に進んでいきましょう！</p>
        </div>
      </div>
    )
  }
];

// Basic Commands Introduction Slides
export const basicCommandsSlides: Slide[] = [
  {
    id: 1,
    title: "基礎コマンドマスター編へようこそ！",
    content: (
      <div className="text-center space-y-8">
        <div className="text-6xl mb-6">🎯</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          ゴール（目標）
        </h3>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 text-left max-w-2xl mx-auto">
          <p className="text-lg text-gray-700 mb-4 font-semibold">
            現在のGitの状態・差分・履歴を確認するスキルを身につけよう。
          </p>
          <p className="text-blue-600 font-bold text-xl">
            git status / git diff / git log の正しい使い方をマスター！
          </p>
        </div>
        <div className="space-y-4 text-gray-600 max-w-2xl mx-auto">
          <p>前回はファイルを作成してコミットする流れを学びました。</p>
          <p>今度は、<strong className="text-gray-800">「今何が起きているのか」を確認する方法</strong>を身につけましょう。</p>
          <p className="font-semibold text-gray-800">実際の開発では、状況把握が最も重要なスキルです！</p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "シナリオ：新しいプロジェクトに参加した開発者",
    content: (
      <div className="space-y-8">
        <div className="text-center">
          <div className="text-5xl mb-4">👨‍💻</div>
          <p className="text-lg text-gray-700 mb-6">
            あなたは新しくプロジェクトに参加した開発者です。
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-yellow-800 mb-4 text-center">
            🎯 あなたのミッション
          </h4>
          <p className="text-yellow-700 text-center mb-4">
            まずはローカルでファイルを編集しながら、<br />
            Gitで変更状況や履歴をしっかり管理できるようになる必要があります。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-3xl mb-3">📊</div>
            <h4 className="text-lg font-semibold text-blue-800 mb-2">状況把握</h4>
            <p className="text-blue-700 text-sm">
              今どんな変更があるのか<br />
              すぐに確認できる
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-3xl mb-3">🔍</div>
            <h4 className="text-lg font-semibold text-green-800 mb-2">差分確認</h4>
            <p className="text-green-700 text-sm">
              何がどう変わったのか<br />
              詳細に把握できる
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-3xl mb-3">📚</div>
            <h4 className="text-lg font-semibold text-purple-800 mb-2">履歴確認</h4>
            <p className="text-purple-700 text-sm">
              過去の変更履歴を<br />
              いつでも振り返れる
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-center text-gray-700 font-medium">
            これらのスキルは、チーム開発でも個人開発でも<br />
            <strong className="text-blue-600">必須の基礎スキル</strong>です！
          </p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "📚 学習項目とキーワード",
    content: (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            今回マスターする<strong className="text-blue-600">3つのコマンド</strong>をご紹介します
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-4">
                <span className="font-mono text-sm">📊</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-blue-800">git status</h4>
                <p className="text-blue-600">現在の変更状態を確認する</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-gray-700 mb-2"><strong>使用場面：</strong></p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• 「今どのファイルが変更されているか知りたい」</li>
                <li>• 「ステージングエリアに何があるか確認したい」</li>
                <li>• 「コミット前に状況を整理したい」</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center mr-4">
                <span className="font-mono text-sm">🔍</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-green-800">git diff</h4>
                <p className="text-green-600">変更前後の差分を確認する</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <p className="text-gray-700 mb-2"><strong>使用場面：</strong></p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• 「具体的にどこを変更したか詳しく見たい」</li>
                <li>• 「コミット前に変更内容を最終確認したい」</li>
                <li>• 「意図しない変更が混じっていないかチェックしたい」</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mr-4">
                <span className="font-mono text-sm">📚</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-purple-800">git log</h4>
                <p className="text-purple-600">これまでのコミット履歴を確認する</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-gray-700 mb-2"><strong>使用場面：</strong></p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• 「過去にどんな変更をしたか振り返りたい」</li>
                <li>• 「いつ、誰が、何をコミットしたか知りたい」</li>
                <li>• 「特定の機能がいつ追加されたか調べたい」</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "実践で身につけよう！",
    content: (
      <div className="text-center space-y-8">
        <div className="text-6xl mb-6">🚀</div>
        
        <p className="text-lg text-gray-700">
          コマンドの使い方は、実際に手を動かして覚えるのが一番です。
        </p>

        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-blue-800 font-semibold mb-4">
            これから実際にファイルを編集しながら、
          </p>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <code className="text-blue-600 font-mono">git status</code>
              <span className="text-gray-600 ml-2">で状況を把握</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <code className="text-green-600 font-mono">git diff</code>
              <span className="text-gray-600 ml-2">で変更内容を確認</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <code className="text-purple-600 font-mono">git log</code>
              <span className="text-gray-600 ml-2">で履歴を振り返る</span>
            </div>
          </div>
          
          <p className="text-blue-700 mt-4">
            という流れを体験していきます。
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            実際の開発現場でも毎日使う重要なコマンドです。
          </p>
          
          <div className="text-4xl font-bold text-blue-600">
            🎯 Let's master Git commands!
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            次から実際にコマンドを使って学習していきます
          </p>
        </div>
      </div>
    )
  }
];

// Branch and Merge Introduction Slides
export const branchIntroSlides: Slide[] = [
  {
    id: 1,
    title: "ブランチとマージの世界へようこそ！",
    content: (
      <div className="text-center space-y-8">
        <div className="text-6xl mb-6">🌿</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          なぜブランチが必要なの？
        </h3>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 text-left max-w-2xl mx-auto">
          <p className="text-lg text-gray-700 mb-4">
            ブランチは、<strong className="text-blue-600">「並行して複数の作業を進める」</strong>ための仕組みです。
          </p>
          <div className="space-y-3">
            <p className="text-gray-600">🚀 新機能の開発</p>
            <p className="text-gray-600">🐛 バグ修正</p>
            <p className="text-gray-600">🧪 実験的な変更</p>
          </div>
          <p className="text-blue-600 font-semibold mt-4">
            これらを安全に、同時に進められます！
          </p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "ブランチ戦略の基本概念",
    content: (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            ブランチは<strong className="text-blue-600">「作業の分岐点」</strong>を作る仕組みです
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">基本的な流れ</h4>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">1</div>
              <div>
                <h5 className="font-semibold text-gray-800">mainブランチ（本流）</h5>
                <p className="text-gray-600 text-sm">安定したコードが保管される場所</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">2</div>
              <div>
                <h5 className="font-semibold text-gray-800">featureブランチ（支流）</h5>
                <p className="text-gray-600 text-sm">新機能開発用の作業場所</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">3</div>
              <div>
                <h5 className="font-semibold text-gray-800">マージ（合流）</h5>
                <p className="text-gray-600 text-sm">完成した機能をmainに統合</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-yellow-800 mb-2 text-center">
            💡 なぜこの方法が良いの？
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-700 text-sm">mainブランチは常に安定</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-700 text-sm">複数人で同時作業可能</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-gray-700 text-sm">実験的な変更も安全</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-gray-700 text-sm">問題があれば簡単に元に戻せる</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "今回学ぶコマンド",
    content: (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            ブランチ操作の<strong className="text-blue-600">基本3ステップ</strong>を学習します
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-4">
                <span className="font-mono text-sm">🌿</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-blue-800">git branch</h4>
                <p className="text-blue-600">新しいブランチを作成する</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <code className="block text-sm font-mono bg-gray-100 px-3 py-2 rounded mb-2">
                git branch new-feature
              </code>
              <p className="text-gray-600 text-sm">→ 「new-feature」という名前のブランチを作成</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center mr-4">
                <span className="font-mono text-sm">🔄</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-green-800">git switch</h4>
                <p className="text-green-600">ブランチを切り替える</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <code className="block text-sm font-mono bg-gray-100 px-3 py-2 rounded mb-2">
                git switch new-feature
              </code>
              <p className="text-gray-600 text-sm">→ 「new-feature」ブランチに移動して作業開始</p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mr-4">
                <span className="font-mono text-sm">🔗</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-purple-800">git merge</h4>
                <p className="text-purple-600">ブランチを統合する</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <code className="block text-sm font-mono bg-gray-100 px-3 py-2 rounded mb-2">
                git merge new-feature
              </code>
              <p className="text-gray-600 text-sm">→ 「new-feature」の変更をmainブランチに統合</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "実践で学ぼう！",
    content: (
      <div className="text-center space-y-8">
        <div className="text-6xl mb-6">🚀</div>
        
        <p className="text-lg text-gray-700">
          実際にブランチを作成して、新機能を開発してみましょう！
        </p>

        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">
            今回のシナリオ
          </h4>
          
          <div className="space-y-3 text-left max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <span className="text-blue-600 font-semibold">1. </span>
              <span className="text-gray-700">new-featureブランチを作成</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <span className="text-green-600 font-semibold">2. </span>
              <span className="text-gray-700">ブランチを切り替えて新機能を開発</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <span className="text-purple-600 font-semibold">3. </span>
              <span className="text-gray-700">mainブランチに戻ってマージ</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            チーム開発では必須のスキルです。一歩ずつ確実に進めていきましょう！
          </p>
          
          <div className="text-4xl font-bold text-blue-600">
            🌿 Let's branch out!
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            次から実際にブランチ操作を体験していきます
          </p>
        </div>
      </div>
    )
  }
];

// Remote Collaboration Introduction Slides
export const remoteIntroSlides: Slide[] = [
  {
    id: 1,
    title: "チーム開発シナリオ：新メンバーとしての参加",
    content: (
      <div className="text-center space-y-8">
        <div className="text-6xl mb-6">👥</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          あなたはチームに新しく加わった開発者です
        </h3>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 text-left max-w-2xl mx-auto">
          <p className="text-lg text-gray-700 mb-4">
            リモートのGitHub（模擬環境）にある<strong className="text-blue-600">「チームサイト」</strong>のコードを取得し、
          </p>
          <div className="space-y-3">
            <p className="text-gray-600">📥 自分のローカルで編集</p>
            <p className="text-gray-600">🚀 変更をチームに共有（push）</p>
            <p className="text-gray-600">🔄 最新状態を取得（pull）</p>
          </div>
          <p className="text-blue-600 font-semibold mt-4">
            という実際のチーム開発の流れを体験します！
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">チームメンバー</h4>
          <div className="space-y-2">
            <p className="text-gray-700">👨‍💼 田中さん（チームリーダー）</p>
            <p className="text-gray-700">🎨 佐藤さん（デザイナー）</p>
            <p className="text-gray-700">🆕 あなた（新メンバー）</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "学習内容：リモートとローカルの関係",
    content: (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            まずは基本概念を理解しましょう
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-4">☁️</div>
              <div>
                <h4 className="text-lg font-semibold text-green-800">リモートリポジトリ</h4>
                <p className="text-green-600">サーバー上のリポジトリ（GitHubなど）</p>
              </div>
            </div>
            <p className="text-green-700 text-sm">チーム全体で共有するコードの保管庫。みんながアクセスできる「本家」</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-4">💻</div>
              <div>
                <h4 className="text-lg font-semibold text-blue-800">ローカルリポジトリ</h4>
                <p className="text-blue-600">自分のPC上の作業用リポジトリ</p>
              </div>
            </div>
            <p className="text-blue-700 text-sm">個人の作業場所。ここで編集・テスト・コミットを行う</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-4">🔗</div>
              <div>
                <h4 className="text-lg font-semibold text-purple-800">origin</h4>
                <p className="text-purple-600">デフォルトのリモート接続名（URLの別名）</p>
              </div>
            </div>
            <p className="text-purple-700 text-sm">長いURLの代わりに「origin」という短い名前でリモートを指定できる</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-yellow-800 mb-2 text-center">
            💡 今回学ぶ3つの基本操作
          </h4>
          <div className="space-y-2">
            <p className="text-yellow-700"><strong>clone:</strong> リモートの中身を丸ごと持ってくる</p>
            <p className="text-yellow-700"><strong>push:</strong> 自分の変更をリモートに送る</p>
            <p className="text-yellow-700"><strong>pull:</strong> リモートの変更をローカルに取り込む</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "演習課題の流れ",
    content: (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            以下の<strong className="text-blue-600">5つのステップ</strong>で学習します
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">1</div>
              <div>
                <h4 className="text-xl font-bold text-purple-800">リモートから複製</h4>
                <p className="text-purple-600">チームサイトのコードを取得</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <code className="block text-sm font-mono bg-gray-100 px-3 py-2 rounded mb-2">
                git clone https://example.com/team-site.git
              </code>
              <p className="text-gray-600 text-sm">→ ファイルビューに複製されたファイルが表示される</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">2</div>
              <div>
                <h4 className="text-xl font-bold text-blue-800">リモート設定の確認</h4>
                <p className="text-blue-600">origin の設定を確認</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <code className="block text-sm font-mono bg-gray-100 px-3 py-2 rounded mb-2">
                git remote -v
              </code>
              <p className="text-gray-600 text-sm">→ origin に clone 元のURLが登録されている</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">3</div>
              <div>
                <h4 className="text-xl font-bold text-green-800">ローカルで編集＆コミット</h4>
                <p className="text-green-600">index.html のタイトルを変更</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="space-y-2">
                <p className="text-gray-700 text-sm">index.html のタイトルを変更</p>
                <code className="block text-sm font-mono bg-gray-100 px-3 py-2 rounded">
                  git add index.html
                </code>
                <code className="block text-sm font-mono bg-gray-100 px-3 py-2 rounded">
                  git commit -m "Update site title"
                </code>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">4</div>
              <div>
                <h4 className="text-xl font-bold text-orange-800">変更をリモートに送信</h4>
                <p className="text-orange-600">チームに変更を共有</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <code className="block text-sm font-mono bg-gray-100 px-3 py-2 rounded mb-2">
                git push origin main
              </code>
              <p className="text-gray-600 text-sm">→ ローカルの変更をリモートに送信</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">5</div>
              <div>
                <h4 className="text-xl font-bold text-red-800">最新の変更を取得</h4>
                <p className="text-red-600">チームメンバーの変更を取得</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <code className="block text-sm font-mono bg-gray-100 px-3 py-2 rounded mb-2">
                git pull origin main
              </code>
              <p className="text-gray-600 text-sm">→ リモートの最新変更をローカルに取り込む</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "実践で学ぼう！",
    content: (
      <div className="text-center space-y-8">
        <div className="text-6xl mb-6">🚀</div>
        
        <p className="text-lg text-gray-700">
          実際のチーム開発の流れを体験してみましょう！
        </p>

        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">
            今回のシナリオ
          </h4>
          
          <div className="space-y-3 text-left max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <span className="text-purple-600 font-semibold">📥 </span>
              <span className="text-gray-700">チームサイトをクローン</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <span className="text-blue-600 font-semibold">🔍 </span>
              <span className="text-gray-700">リモート設定を確認</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <span className="text-green-600 font-semibold">✏️ </span>
              <span className="text-gray-700">タイトルを編集してコミット</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <span className="text-orange-600 font-semibold">🚀 </span>
              <span className="text-gray-700">変更をチームに共有（push）</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <span className="text-red-600 font-semibold">🔄 </span>
              <span className="text-gray-700">チームの最新変更を取得（pull）</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            これが実際のチーム開発で毎日行われている基本的なワークフローです。
          </p>
          
          <div className="text-4xl font-bold text-blue-600">
            👥 Let's collaborate with the team!
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            次から実際にリモート操作を体験していきます
          </p>
        </div>
      </div>
    )
  }
];

export default SlideViewer;