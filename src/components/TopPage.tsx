import React from 'react';
import { GitBranch, Play, Trophy, BookOpen, Target, Users, Zap } from 'lucide-react';
import { UserProgress, Stage } from '../types';

interface TopPageProps {
  progress: UserProgress;
  stages: Stage[];
  onStartLearning: () => void;
  onSelectStage: (stageId: number) => void;
  onViewBadges: () => void;
}

export const TopPage: React.FC<TopPageProps> = ({
  progress,
  stages,
  onStartLearning,
  onSelectStage,
  onViewBadges
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tutorial': return <BookOpen size={20} />;
      case 'basic': return <Zap size={20} />;
      case 'branch': return <GitBranch size={20} />;
      case 'remote': return <Target size={20} />;
      case 'conflict': return <Trophy size={20} />;
      case 'practical': return <Users size={20} />;
      default: return <BookOpen size={20} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tutorial': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-yellow-100 text-yellow-800';
      case 'branch': return 'bg-green-100 text-green-800';
      case 'remote': return 'bg-purple-100 text-purple-800';
      case 'conflict': return 'bg-orange-100 text-orange-800';
      case 'practical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GitBranch className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Git学習アプリケーション
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              インタラクティブな課題を通じて、Gitの基礎から実践的なワークフローまで体系的に学習できます
            </p>
            
            {/* Progress Overview */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">学習進捗</span>
                <span className="text-sm text-gray-600">
                  {progress.completedStages.length} / {stages.length} ステージ
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress.totalProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>獲得バッジ: {progress.badges.length}</span>
                <span>開始日: {progress.startedAt.toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onStartLearning}
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play size={20} className="mr-2" />
                {progress.completedStages.length === 0 ? 'はじめる' : '学習を続ける'}
              </button>
              <button
                onClick={onViewBadges}
                className="inline-flex items-center px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Trophy size={20} className="mr-2" />
                バッジコレクション
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stages Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">学習ステージ</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.map((stage) => {
            const isCompleted = progress.completedStages.includes(stage.id);
            const isUnlocked = stage.unlocked || isCompleted;
            const isCurrent = progress.currentStage === stage.id;

            return (
              <div
                key={stage.id}
                className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 ${
                  isUnlocked 
                    ? 'hover:shadow-lg cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                } ${isCurrent ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => isUnlocked && onSelectStage(stage.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${getCategoryColor(stage.category)}`}>
                    {getCategoryIcon(stage.category)}
                  </div>
                  {isCompleted && (
                    <div className="text-green-600">
                      <Trophy size={20} />
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {stage.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {stage.description}
                </p>
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 font-medium">学習目標:</div>
                  <ul className="space-y-1">
                    {stage.objectives.slice(0, 2).map((objective, index) => (
                      <li key={index} className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                        {objective}
                      </li>
                    ))}
                    {stage.objectives.length > 2 && (
                      <li className="text-xs text-gray-500">
                        +{stage.objectives.length - 2} more...
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {stage.tasks.length} タスク
                    </span>
                    {stage.badge && (
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="mr-1">{stage.badge.icon}</span>
                        <span>{stage.badge.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};