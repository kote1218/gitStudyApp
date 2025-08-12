import React, { useState } from 'react';
import { X, GitPullRequest, Check, Users, MessageSquare, FileText } from 'lucide-react';

interface GitHubPRPopupProps {
  onClose: () => void;
  onCreatePR: () => void;
  branchName: string;
}

export const GitHubPRPopup: React.FC<GitHubPRPopupProps> = ({ 
  onClose, 
  onCreatePR, 
  branchName 
}) => {
  const [title, setTitle] = useState('Add header navigation');
  const [description, setDescription] = useState('ヘッダーナビゲーションを追加しました。\n\n変更内容:\n- header.htmlファイルを新規作成\n- ナビゲーションメニュー（ホーム、サービス、お問い合わせ）を実装');
  const [step, setStep] = useState<'form' | 'created'>('form');

  const handleCreatePR = () => {
    setStep('created');
    setTimeout(() => {
      onCreatePR();
    }, 2000);
  };

  if (step === 'created') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <h3 className="text-xl font-bold text-gray-900">
              Pull Request作成完了！
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <GitPullRequest className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">PR #42</span>
              </div>
              <p className="text-green-700 text-sm">
                「Add header navigation」のPull Requestが作成されました
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              チームメンバーがレビューして、承認されればmainブランチにマージされます。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* GitHub Header */}
        <div className="bg-gray-900 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-900 font-bold text-sm">GH</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold">team-project / team-site</h2>
                <p className="text-gray-300 text-sm">Create Pull Request</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* PR Form */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <GitPullRequest className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">Open a pull request</h3>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-sm text-blue-800">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                  <span className="font-mono">{branchName}</span>
                </div>
                <span className="mx-2">→</span>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-600 rounded-full mr-2"></div>
                  <span className="font-mono">main</span>
                </div>
              </div>
              <p className="text-blue-700 text-sm mt-2">
                Able to merge. These branches can be automatically merged.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of changes"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your changes in detail"
              />
            </div>

            {/* Files Changed */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Files changed</h4>
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">1 file changed</span>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-green-600 mr-2">+15</span>
                      <span className="text-red-600">-0</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm font-mono text-blue-600">header.html</span>
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      new file
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviewers */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Reviewers</h4>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-gray-50 rounded">
                  <Users className="w-4 h-4 text-gray-500 mr-2" />
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">田</span>
                    </div>
                    <span className="text-sm text-gray-700">田中さん（チームリーダー）</span>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded">
                  <Users className="w-4 h-4 text-gray-500 mr-2" />
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">佐</span>
                    </div>
                    <span className="text-sm text-gray-700">佐藤さん（デザイナー）</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              キャンセル
            </button>
            <button
              onClick={handleCreatePR}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <GitPullRequest className="w-4 h-4 mr-2" />
              Create pull request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};