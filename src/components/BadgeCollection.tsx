import React from 'react';
import { Trophy, ArrowLeft, Calendar } from 'lucide-react';
import { Badge } from '../types';

interface BadgeCollectionProps {
  badges: Badge[];
  onBack: () => void;
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({ badges, onBack }) => {
  const earnedBadges = badges.filter(badge => badge.earned);
  const totalBadges = 7; // Total possible badges

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              戻る
            </button>
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">バッジコレクション</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {earnedBadges.length}
              </div>
              <div className="text-gray-600">獲得バッジ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">
                {totalBadges - earnedBadges.length}
              </div>
              <div className="text-gray-600">未獲得バッジ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round((earnedBadges.length / totalBadges) * 100)}%
              </div>
              <div className="text-gray-600">達成率</div>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`bg-white rounded-lg shadow-sm p-6 text-center transition-all duration-200 ${
                badge.earned 
                  ? 'hover:shadow-md' 
                  : 'opacity-50'
              }`}
            >
              <div className="text-4xl mb-4">
                {badge.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {badge.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {badge.description}
              </p>
              
              {badge.earned && badge.earnedAt ? (
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  {badge.earnedAt.toLocaleDateString()}
                </div>
              ) : (
                <div className="text-xs text-gray-400">
                  未獲得
                </div>
              )}
            </div>
          ))}
        </div>

        {earnedBadges.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              まだバッジがありません
            </h3>
            <p className="text-gray-600">
              学習を進めてバッジを獲得しましょう！
            </p>
          </div>
        )}
      </div>
    </div>
  );
};