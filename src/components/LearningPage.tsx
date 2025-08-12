import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, ArrowRight, X, Terminal as TerminalIcon, GitPullRequest } from 'lucide-react';
import { Terminal } from './Terminal';
import { FileEditor } from './FileEditor';
import { GitVisualization } from './GitVisualization';
import { SlideViewer } from './SlideViewer';
import { GitHubPRPopup } from './GitHubPRPopup';
import { gitIntroSlides, repositoryIntroSlide, gitWorkflowSlide, uiGuideSlides, basicCommandsSlides, branchIntroSlides, remoteIntroSlides, conflictIntroSlides, practicalIntroSlides } from '../data/stages.tsx';
import { useGitSimulator } from '../hooks/useGitSimulator';
import { Stage, Task } from '../types';

interface LearningPageProps {
  stage: Stage;
  onBack: () => void;
  onStageComplete: (stageId: number) => void;
}

export const LearningPage: React.FC<LearningPageProps> = ({ 
  stage, 
  onBack, 
  onStageComplete 
}) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [taskResults, setTaskResults] = useState<{ [taskId: string]: boolean }>({});
  const [showRepositorySlide, setShowRepositorySlide] = useState(stage.id === 2);
  const [showUIGuide, setShowUIGuide] = useState(false);
  const [showBasicCommandsSlide, setShowBasicCommandsSlide] = useState(stage.id === 3);
  const [showBranchIntroSlide, setShowBranchIntroSlide] = useState(stage.id === 4);
  const [showRemoteIntroSlide, setShowRemoteIntroSlide] = useState(stage.id === 5);
  const [showConflictIntroSlide, setShowConflictIntroSlide] = useState(stage.id === 6);
  const [showPracticalIntroSlide, setShowPracticalIntroSlide] = useState(stage.id === 7);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null);
  const [showGitHubPR, setShowGitHubPR] = useState(false);

  const { 
    gitState, 
    output, 
    executeCommand, 
    updateFile, 
    clearOutput,
    setGitState 
  } = useGitSimulator(stage.initialState);

  const currentTask = stage.tasks[currentTaskIndex];
  const completedTasks = stage.tasks.filter(task => task.completed).length;
  const progressPercentage = (completedTasks / stage.tasks.length) * 100;
  const isSlideStage = stage.id === 1;
  const isInteractiveStage = stage.id >= 2 && !showRepositorySlide && !showUIGuide && !showBranchIntroSlide && !showRemoteIntroSlide && !showConflictIntroSlide && !showPracticalIntroSlide;

  // Initialize git state when stage changes
  useEffect(() => {
    setGitState(prev => ({
      ...prev,
      ...stage.initialState
    }));
    clearOutput();
    setCurrentTaskIndex(0);
    setTaskResults({});
    setShowRepositorySlide(stage.id === 2);
    setShowBasicCommandsSlide(stage.id === 3);
    setShowBranchIntroSlide(stage.id === 4);
    setShowRemoteIntroSlide(stage.id === 5);
    setShowConflictIntroSlide(stage.id === 6);
    setShowPracticalIntroSlide(stage.id === 7);
    setShowUIGuide(false);
  }, [stage.id, stage.initialState, setGitState, clearOutput]);

  // Check task completion
  useEffect(() => {
    if (currentTask && !currentTask.completed && isInteractiveStage && currentTask.id !== 'ui-guide') {
      const isCompleted = currentTask.check(gitState);
      if (isCompleted && !taskResults[currentTask.id]) {
        currentTask.completed = true;
        setTaskResults(prev => ({ ...prev, [currentTask.id]: true }));
        setCompletedTaskId(currentTask.id);
        setShowCompletionPopup(true);
      }
    }
  }, [gitState, currentTask, isInteractiveStage, taskResults]);

  const handleNextTask = () => {
    setShowCompletionPopup(false);
    setCompletedTaskId(null);
    if (currentTaskIndex < stage.tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setShowHint(false);
      setShowAnswer(false);
    } else {
      onStageComplete(stage.id);
    }
  };

  const handleCommand = (command: string) => {
    const success = executeCommand(command);
    
    // 手動完了が必要なコマンドの場合
    if (currentTask && ['status-check-1', 'status-check-2', 'diff-check', 'log-check', 'check-branches', 'check-remote', 'push-changes', 'pull-latest-changes', 'attempt-merge'].includes(currentTask.id)) {
      const expectedCommand = currentTask.command?.trim();
      if (expectedCommand && command.trim() === expectedCommand) {
        currentTask.completed = true;
        setTaskResults(prev => ({ ...prev, [currentTask.id]: true }));
        setCompletedTaskId(currentTask.id);
        setShowCompletionPopup(true);
      }
    }
    
    // push-branchタスクの特別処理
    if (currentTask && (currentTask.id === 'push-branch' || currentTask.id === 'push-feature-branch')) {
      const expectedCommand = currentTask.id === 'push-branch' ? 'git push origin feature/add-header' : 'git push origin feature/add-header';
      if (command.trim() === expectedCommand) {
        currentTask.completed = true;
        setTaskResults(prev => ({ ...prev, [currentTask.id]: true }));
        setCompletedTaskId(currentTask.id);
        setShowCompletionPopup(true);
      }
    }
    
    if (!success && currentTask) {
      setTaskResults(prev => ({ ...prev, [currentTask.id]: false }));
    }
  };

  const handleFileChange = (filename: string, content: string) => {
    updateFile(filename, content);
    
    // ファイル作成・編集タスクの完了チェック
    if (currentTask && ['create-html-file', 'add-hello-git', 'edit-html-content', 'create-about-file', 'create-feature-file', 'edit-index-title', 'edit-h1-in-feature', 'simulate-team-change', 'resolve-conflict'].includes(currentTask.id)) {
      const isCompleted = currentTask.check({ ...gitState, files: { ...gitState.files, [filename]: content } });
      if (isCompleted) {
        currentTask.completed = true;
        setTaskResults(prev => ({ ...prev, [currentTask.id]: true }));
        setCompletedTaskId(currentTask.id);
        setShowCompletionPopup(true);
      }
    }
  };

  const getTaskCompletionMessage = (taskId: string) => {
    switch (taskId) {
      case 'create-html-file':
        return '🎉 HTMLファイルが作成されました！基本的なHTML構造ができましたね。';
      case 'add-hello-git':
        return '✨ <h1>Hello Git</h1>が追加されました！これでファイルに内容が書かれました。';
      case 'status-check-1':
        return '📊 git statusを実行すると、新しいファイルが「Untracked files」として表示されます。Gitがファイルの存在を認識しました！';
      case 'edit-html-content':
        return '🔄 ファイルの内容が変更されました！「Hello Git」から「Hello Git World!」に更新されましたね。';
      case 'diff-check':
        return '🔍 git diffを実行すると、具体的にどの行が変更されたかが表示されます。-（削除）と+（追加）マークで変更内容が分かりますね！';
      case 'first-commit':
        return '📝 初回コミットが完了しました！ファイルがGitの履歴に正式に記録されました。';
      case 'second-commit':
        return '📚 2回目のコミットが完了しました！これで複数の履歴ができました。';
      case 'log-check':
        return '⏰ git logでコミット履歴を確認できました！いつ、誰が、どんなメッセージでコミットしたかが分かる「開発のタイムマシン」ですね。';
      case 'init':
        return 'ターミナルに「Gitリポジトリが初期化されました」と表示されましたね。';
      case 'add':
        return 'ターミナルに"Added README.md to staging area"と表示されましたね。ファイルがステージングされました。';
      case 'commit':
        return 'ログに履歴が記録され、ファイルが「確定」状態になります。-mコマンドを使うとコミット時にコメントを残すことができます。';
      case 'create-branch':
        return '🌿 new-featureブランチが作成されました！新しい作業場所ができましたね。';
      case 'check-branches':
        return '📋 新しいブランチがあることを確認できました！現在のブランチには * マークが付いています。';
      case 'switch-branch':
        return '🔄 現在のブランチが new-feature に切り替わったことを確認できました！これで新機能開発の準備完了です。';
      case 'create-about-file':
        return '📄 about.htmlファイルが作成されました！自己紹介ページができましたね。';
      case 'commit-in-branch':
        return '💾 new-featureブランチでコミットが完了しました！新機能が記録されました。';
      case 'switch-to-main':
        return '🏠 mainブランチに戻りました！安定版の環境に戻ってきました。';
      case 'merge-branch':
        return '🎉 マージが完了しました！new-featureブランチの変更がmainブランチに統合されました。';
      case 'clone-repo':
        return '📥 チームサイトのクローンが完了しました！リモートのファイル（README.md、index.html、style.css）がローカルにコピーされ、originリモートが自動設定されました。';
      case 'check-remote':
        return '🔍 リモートリポジトリの設定を確認できました！originがfetch（取得）とpush（送信）の両方にhttps://github.com/example/team-site.gitが設定されていることが分かりますね。';
      case 'edit-index-title':
        return '✏️ index.htmlのタイトルが「新しいチームサイト」に変更されました！ローカルでの編集作業が完了しました。';
      case 'commit-title-change':
        return '💾 タイトル変更のコミットが完了しました！「Update site title」というメッセージでローカルリポジトリに変更が記録されました。';
      case 'edit-index-title':
        return '✏️ index.htmlのタイトルが「新しいチームサイト」に変更されました！ローカルでの編集作業が完了しました。';
      case 'commit-title-change':
        return '💾 タイトル変更のコミットが完了しました！「Update site title」というメッセージでローカルリポジトリに変更が記録されました。';
      case 'commit-title-change':
        return '💾 タイトル変更のコミットが完了しました！ローカルリポジトリに変更が記録されました。';
      case 'push-changes':
        return '🚀 ローカルの変更がリモートにプッシュされました！チームメンバー（田中さん、佐藤さん）があなたのタイトル変更を見ることができるようになりました。';
      case 'pull-latest-changes':
        return '🔄 リモートからの最新変更を取得しました！佐藤さん（デザイナー）が追加したteam-info.htmlファイルがローカルに反映されました。チーム開発の流れを体験できましたね！';
      case 'create-feature-branch':
        return '🌿 feature-titleブランチが作成されました！新機能開発用のブランチができました。';
      case 'switch-to-feature':
        return '🔄 feature-titleブランチに切り替わりました！これで独立した作業環境で開発できます。';
      case 'edit-h1-in-feature':
        return '✏️ 見出しが「Welcome to My Site」に変更されました！あなたの作業が完了しました。';
      case 'commit-feature-change':
        return '💾 feature-titleブランチでコミットが完了しました！あなたの変更が記録されました。';
      case 'switch-to-main':
        return '🏠 mainブランチに戻りました！これからAさんの変更を模擬します。';
      case 'simulate-team-change':
        return '👥 Aさんの変更を模擬しました！同じ<h1>部分が「Hello from Team!」に変更されています。これでコンフリクトの準備が整いました。';
      case 'attempt-merge':
        return '⚡ コンフリクトが発生しました！ターミナルに「CONFLICT」メッセージが表示され、index.htmlに<<<<<<< HEAD、=======、>>>>>>> feature-titleのマーカーが追加されました。';
      case 'resolve-conflict':
        return '🛠️ コンフリクトが解決されました！両方の内容を統合して「Welcome to My Site and Team!」になりました。マーカーも正しく削除されています。';
      case 'stage-resolved-file':
        return '📥 解決済みファイルがステージングされました！Gitに「このファイルのコンフリクトは解決済み」と伝えました。';
      case 'commit-merge':
        return '🎉 マージが完了しました！コンフリクトを解決してfeature-titleブランチの変更がmainブランチに統合されました。お疲れさまでした！';
      case 'create-pr':
        return '🚀 Pull Requestが作成されました！チームメンバーがコードレビューを行い、承認されればmainブランチにマージされます。これが実際のチーム開発の流れです！';
      default:
        return 'タスクが完了しました！';
    }
  };

  const handleSlideComplete = () => {
    if (currentTask) {
      currentTask.completed = true;
      onStageComplete(stage.id);
    }
  };

  const handleRepositorySlideComplete = () => {
    setShowRepositorySlide(false);
    setShowUIGuide(true);
  };

  const handleUIGuideComplete = () => {
    setShowUIGuide(false);
    // Stage 2の最初のタスクを手動で完了させる
    if (stage.id === 2 && stage.tasks[0]) {
      stage.tasks[0].completed = true;
      setCurrentTaskIndex(1);
    }
  };

  const handleBasicCommandsSlideComplete = () => {
    setShowBasicCommandsSlide(false);
    // Stage 3の最初のタスクに進む
    if (stage.id === 3 && stage.tasks[0]) {
      setCurrentTaskIndex(0);
    }
  };

  const handleBranchIntroSlideComplete = () => {
    setShowBranchIntroSlide(false);
    // Stage 4の最初のタスクに進む
    if (stage.id === 4 && stage.tasks[0]) {
      setCurrentTaskIndex(0);
    }
  };

  const handleRemoteIntroSlideComplete = () => {
    setShowRemoteIntroSlide(false);
    // Stage 5の最初のタスクに進む
    if (stage.id === 5 && stage.tasks[0]) {
      setCurrentTaskIndex(0);
    }
  };

  const handleConflictIntroSlideComplete = () => {
    setShowConflictIntroSlide(false);
    // Stage 6の最初のタスクに進む
    if (stage.id === 6 && stage.tasks[0]) {
      setCurrentTaskIndex(0);
    }
  };

  const handlePracticalIntroSlideComplete = () => {
    setShowPracticalIntroSlide(false);
    // Stage 7の最初のタスクに進む
    if (stage.id === 7 && stage.tasks[0]) {
      setCurrentTaskIndex(0);
    }
  };

  const getTaskStatus = (task: Task) => {
    if (task.completed) return 'completed';
    if (task.id === currentTask?.id) return 'current';
    if (taskResults[task.id] === false) return 'failed';
    return 'pending';
  };

  const isAllTasksCompleted = stage.tasks.every(task => task.completed);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft size={20} className="mr-2" />
                戻る
              </button>
              <h1 className="text-xl font-bold text-gray-900">{stage.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                タスク {completedTasks} / {stage.tasks.length}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isSlideStage ? (
          // Slide-based learning for first stage
          <div className="max-w-5xl mx-auto">
            <SlideViewer 
              slides={gitIntroSlides} 
              onComplete={handleSlideComplete}
            />
          </div>
        ) : showRepositorySlide ? (
          // Repository introduction slide for second stage
          <div className="max-w-5xl mx-auto">
            <SlideViewer 
              slides={[repositoryIntroSlide, gitWorkflowSlide]} 
              onComplete={handleRepositorySlideComplete}
            />
          </div>
        ) : showUIGuide ? (
          // UI guide overlay
          <div className="max-w-5xl mx-auto">
            <SlideViewer 
              slides={uiGuideSlides} 
              onComplete={handleUIGuideComplete}
            />
          </div>
        ) : showBasicCommandsSlide ? (
          // Basic commands introduction slide for third stage
          <div className="max-w-5xl mx-auto">
            <SlideViewer 
              slides={basicCommandsSlides} 
              onComplete={handleBasicCommandsSlideComplete}
            />
          </div>
        ) : showBranchIntroSlide ? (
          // Branch introduction slide for fourth stage
          <div className="max-w-5xl mx-auto">
            <SlideViewer 
              slides={branchIntroSlides} 
              onComplete={handleBranchIntroSlideComplete}
            />
          </div>
        ) : showRemoteIntroSlide ? (
          // Remote introduction slide for fifth stage
          <div className="max-w-5xl mx-auto">
            <SlideViewer 
              slides={remoteIntroSlides} 
              onComplete={handleRemoteIntroSlideComplete}
            />
          </div>
        ) : showConflictIntroSlide ? (
          // Conflict introduction slide for sixth stage
          <div className="max-w-5xl mx-auto">
            <SlideViewer 
              slides={conflictIntroSlides} 
              onComplete={handleConflictIntroSlideComplete}
            />
          </div>
        ) : showPracticalIntroSlide ? (
          // Practical workflow introduction slide for seventh stage
          <div className="max-w-5xl mx-auto">
            <SlideViewer 
              slides={practicalIntroSlides} 
              onComplete={handlePracticalIntroSlideComplete}
            />
          </div>
        ) : (
          // Interactive learning for other stages
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Instructions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                学習内容
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                {stage.description}
              </p>

              {/* Current Task */}
              {currentTask && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    現在のタスク
                  </h3>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-800 mb-3">
                      {currentTask.description}
                    </p>
                    
                    {/* Task completion status */}
                    {currentTask.completed && (
                      <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded flex items-center">
                        <CheckCircle size={16} className="text-green-600 mr-2" />
                        <span className="text-sm text-green-800">タスク完了！</span>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Lightbulb size={16} className="mr-1" />
                        {showHint ? 'ヒントを隠す' : 'ヒントを表示'}
                      </button>
                      
                      {currentTask.command && (
                        <button
                          onClick={() => setShowAnswer(!showAnswer)}
                          className="flex items-center text-sm text-green-600 hover:text-green-800"
                        >
                          <TerminalIcon size={16} className="mr-1" />
                          {showAnswer ? '答えを隠す' : '答えを表示'}
                        </button>
                      )}
                      
                      {/* Manual completion button for specific tasks */}
                      {currentTask && ['check-issue', 'push-branch'].includes(currentTask.id) && !currentTask.completed && (
                        <button
                          onClick={() => {
                            currentTask.completed = true;
                            setTaskResults(prev => ({ ...prev, [currentTask.id]: true }));
                            setCompletedTaskId(currentTask.id);
                            setShowCompletionPopup(true);
                          }}
                          className="flex items-center text-sm text-purple-600 hover:text-purple-800"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          {currentTask.id === 'check-issue' ? '内容を確認しました' : 'プッシュ完了'}
                        </button>
                      )}
                      
                      {/* GitHub PR creation button */}
                      {currentTask && (currentTask.id === 'create-pr' || currentTask.id === 'create-pull-request') && !currentTask.completed && (
                        <button
                          onClick={() => setShowGitHubPR(true)}
                          className="flex items-center text-sm text-green-600 hover:text-green-800"
                        >
                          <GitPullRequest size={16} className="mr-1" />
                          Pull Request作成
                        </button>
                      )}
                    </div>
                    
                    {showHint && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">
                          💡 {currentTask.hint}
                        </p>
                      </div>
                    )}
                    
                    {showAnswer && currentTask.command && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-800 mb-2">
                          🎯 答え:
                        </p>
                        {currentTask.command.includes('<') ? (
                          <pre className="text-sm font-mono bg-gray-100 px-3 py-2 rounded whitespace-pre-wrap">
                            {currentTask.command}
                          </pre>
                        ) : (
                          <code className="block text-sm font-mono bg-gray-100 px-3 py-2 rounded">
                            {currentTask.command}
                          </code>
                        )}
                      </div>
                    )}
                    
                    {/* Next button when task is completed */}
                    {currentTask.completed && !showCompletionPopup && (
                      <button
                        onClick={handleNextTask}
                        className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {currentTaskIndex < stage.tasks.length - 1 ? '次のタスクへ' : 'ステージ完了'}
                        <ArrowRight size={16} className="ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Task List */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  タスク一覧
                </h3>
                <div className="space-y-2">
                  {stage.tasks.map((task, index) => {
                    const status = getTaskStatus(task);
                    return (
                      <div
                        key={task.id}
                        className={`flex items-center p-2 rounded text-sm ${
                          status === 'completed' 
                            ? 'bg-green-50 text-green-800'
                            : status === 'current'
                            ? 'bg-blue-50 text-blue-800'
                            : status === 'failed'
                            ? 'bg-red-50 text-red-800'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center min-w-0 flex-1">
                          {status === 'completed' ? (
                            <CheckCircle size={16} className="mr-2 text-green-600 flex-shrink-0" />
                          ) : status === 'failed' ? (
                            <XCircle size={16} className="mr-2 text-red-600 flex-shrink-0" />
                          ) : (
                            <div className={`w-4 h-4 mr-2 rounded-full border-2 flex-shrink-0 ${
                              status === 'current' ? 'border-blue-600' : 'border-gray-300'
                            }`} />
                          )}
                          <span className="truncate">{task.description}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* File Editor and Git Visualization */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="file-editor">
                <FileEditor
                  files={gitState.files}
                  onFileChange={handleFileChange}
                  stagedFiles={gitState.staged}
                />
              </div>
              <div className="git-visualization">
                <GitVisualization gitState={gitState} />
              </div>
            </div>

            {/* Terminal */}
            <div className="terminal">
              <Terminal
                output={output}
                onCommand={handleCommand}
                currentBranch={gitState.currentBranch}
              />
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Task Completion Popup */}
      {showCompletionPopup && completedTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg shadow-xl p-6 mx-4 ${
            isAllTasksCompleted && stage.id === 7 ? 'max-w-2xl' : 'max-w-md'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CheckCircle size={24} className="text-green-600 mr-3" />
                <h3 className={`font-semibold text-gray-900 ${
                  isAllTasksCompleted && stage.id === 7 ? 'text-2xl' : 'text-lg'
                }`}>
                  {isAllTasksCompleted && stage.id === 7 ? 'おめでとうございます！' : 'タスク完了！'}
                </h3>
              </div>
              <button
                onClick={() => setShowCompletionPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              {isAllTasksCompleted && stage.id === 7 ? (
                <div className="space-y-4 text-gray-700">
                  <div className="text-center text-6xl mb-4">🎉</div>
                  
                  <p className="text-lg font-semibold text-center mb-4">
                    あなたは全ステージをクリアし、<br />
                    Gitの基礎から実務レベルまでを一通りマスターしました。
                  </p>
                  
                  <p className="text-center mb-4">
                    もう「Gitってよく分からない…」と悩むことはありません。<br />
                    これからはブランチを自在に操り、チーム開発でも自信を持って貢献できます。
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">あなたが学んだこと：</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        ローカルとリモートの違い
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        ワーキングツリー / ステージング / コミットの3層構造
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        基本コマンド（init / status / add / commit / log / diff …）
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        ブランチの作成・切替・マージ
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        リモートとのやり取り（push / pull / fetch / clone）
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        コンフリクト解消
                      </div>
                      <div className="flex items-center md:col-span-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        実務的なGitHub Flow（Issue → ブランチ → PR → マージ）
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      💡 次のステップ
                    </h4>
                    <p className="text-sm text-green-700">
                      このアプリで学んだ操作を、ぜひ本物のプロジェクトやGitHubリポジトリで試してみてください。<br />
                      あなたのスキルは、もう現場で通用するレベルです。
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700">
                  {isAllTasksCompleted ? (
                    <>
                      <span className="text-2xl mr-2">🎉</span>
                      おめでとうございます！これでワーキングツリーで作成していたファイルをステージング→コミットの流れを理解することができましたね！
                    </>
                  ) : (
                    getTaskCompletionMessage(completedTaskId)
                  )}
                </p>
              )}
            </div>
            
            <button
              onClick={handleNextTask}
              className={`w-full flex items-center justify-center px-6 py-3 font-medium rounded-lg transition-colors ${
                isAllTasksCompleted && stage.id === 7 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAllTasksCompleted && stage.id === 7 ? (
                <>
                  🎓 学習完了！トップページへ
                  <ArrowRight size={20} className="ml-2" />
                </>
              ) : isAllTasksCompleted ? (
                <>
                  次のステージへ
                  <ArrowRight size={20} className="ml-2" />
                </>
              ) : (
                <>
                  次のタスクへ
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* GitHub PR Popup */}
      {showGitHubPR && (
        <GitHubPRPopup
          onClose={() => setShowGitHubPR(false)}
          onCreatePR={() => {
            setShowGitHubPR(false);
            if (currentTask && (currentTask.id === 'create-pr' || currentTask.id === 'create-pull-request')) {
              currentTask.completed = true;
              setTaskResults(prev => ({ ...prev, [currentTask.id]: true }));
              setCompletedTaskId(currentTask.id);
              setShowCompletionPopup(true);
            }
          }}
          branchName="feature/add-header"
        />
      )}
    </div>
  );
};