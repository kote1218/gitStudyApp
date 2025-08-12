import React, { useState } from 'react';
import { ChevronRight, X, FileText, Terminal, GitBranch, CheckCircle } from 'lucide-react';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ReactNode;
}

interface UIGuideProps {
  onComplete: () => void;
}

const guideSteps: GuideStep[] = [
  {
    id: 'file-editor',
    title: 'ファイルエディタ',
    description: 'ここでファイルの内容を確認・編集できます。左側のファイル一覧から編集したいファイルを選択してください。',
    targetSelector: '.file-editor',
    position: 'left',
    icon: <FileText size={20} />
  },
  {
    id: 'git-visualization',
    title: 'Git状態表示',
    description: '現在のGitの状態を視覚的に確認できます。ブランチ、ステージングエリア、コミット履歴が表示されます。',
    targetSelector: '.git-visualization',
    position: 'left',
    icon: <GitBranch size={20} />
  },
  {
    id: 'terminal',
    title: 'ターミナル',
    description: 'ここでGitコマンドを入力します。コマンドを入力してEnterキーで実行してください。上下矢印キーで履歴を呼び出すこともできます。',
    targetSelector: '.terminal',
    position: 'top',
    icon: <Terminal size={20} />
  }
];

export const UIGuide: React.FC<UIGuideProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCompletionSlide, setShowCompletionSlide] = useState(false);

  const currentGuideStep = guideSteps[currentStep];

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCompletionSlide(true);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  if (showCompletionSlide) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4">
          <div className="text-center space-y-6">
            <div className="text-6xl">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900">準備ができました！</h2>
            <p className="text-gray-600">
              これからGitの基本コマンドを実際に体験していきます。<br />
              最初のミッションは <code className="bg-gray-100 px-2 py-1 rounded font-mono">git init</code> です。
            </p>
            <button
              onClick={handleComplete}
              className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckCircle size={20} className="mr-2" />
              学習を開始する
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" />
      
      {/* Guide Tooltip */}
      <div className="fixed z-50" style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <div className="bg-white rounded-lg shadow-xl border-2 border-blue-500 p-6 max-w-sm mx-4">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              {currentGuideStep.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentGuideStep.title}
            </h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            {currentGuideStep.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {currentStep + 1} / {guideSteps.length}
            </div>
            
            <button
              onClick={nextStep}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              次へ
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Highlight boxes */}
      <div className="fixed inset-0 pointer-events-none z-30">
        {currentGuideStep.targetSelector === '.file-editor' && (
          <div className="absolute top-24 left-4 w-[calc(50%-1rem)] h-80 border-4 border-blue-500 rounded-lg bg-blue-500 bg-opacity-10" />
        )}
        {currentGuideStep.targetSelector === '.git-visualization' && (
          <div className="absolute top-24 right-4 w-[calc(50%-1rem)] h-80 border-4 border-blue-500 rounded-lg bg-blue-500 bg-opacity-10" />
        )}
        {currentGuideStep.targetSelector === '.terminal' && (
          <div className="absolute bottom-6 left-4 right-4 h-80 border-4 border-blue-500 rounded-lg bg-blue-500 bg-opacity-10" />
        )}
      </div>
    </>
  );
};