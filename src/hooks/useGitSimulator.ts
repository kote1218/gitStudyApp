import { useState, useCallback } from 'react';
import { GitState, Commit } from '../types';

export const useGitSimulator = (initialState?: Partial<GitState>) => {
  const [gitState, setGitState] = useState<GitState>({
    files: {},
    staged: [],
    commits: [],
    branches: { main: "" },
    currentBranch: "main",
    head: null,
    modifiedFiles: [],
    ...initialState
  });

  const [output, setOutput] = useState<string[]>([]);

  const addOutput = useCallback((message: string) => {
    setOutput(prev => [...prev, message]);
  }, []);

  const executeCommand = useCallback((command: string): boolean => {
    const parts = command.trim().split(' ');
    const gitCommand = parts[1];

    try {
      switch (gitCommand) {
        case 'init':
          addOutput('Initialized empty Git repository');
          setGitState(prev => ({
            ...prev,
            initialized: true
          }));
          return true;

        case 'clone':
          const repoUrl = parts.slice(2).join(' ');
          if (repoUrl) {
            // チームサイトの模擬的なクローン処理
            const mockFiles = {
              "README.md": "# チームサイト\n\nチーム開発用のWebサイトプロジェクトです。\n\n## 開発メンバー\n- 田中さん（リーダー）\n- 佐藤さん（デザイナー）\n- あなた（新メンバー）",
              "index.html": "<!DOCTYPE html>\n<html>\n<head>\n  <title>チームサイト</title>\n  <meta charset=\"UTF-8\">\n</head>\n<body>\n  <h1>チーム開発プロジェクト</h1>\n  <p>みんなで作るWebサイトです</p>\n</body>\n</html>",
              "style.css": "body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background-color: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n  text-align: center;\n}"
            };
            
            const initialCommit: Commit = {
              hash: 'team001',
              message: 'チームサイトの初期セットアップ',
              author: '田中さん（チームリーダー）',
              date: new Date('2024-01-01T09:00:00'),
              branch: 'main',
              files: Object.keys(mockFiles),
              fileContents: mockFiles
            };

            setGitState(prev => ({
              ...prev,
              initialized: true,
              files: mockFiles,
              commits: [initialCommit],
              head: initialCommit.hash,
              branches: { main: initialCommit.hash },
              remotes: { origin: repoUrl }
            }));
            
            addOutput(`Cloning into 'team-site'...`);
            addOutput(`remote: Counting objects: 5, done.`);
            addOutput(`remote: Total 5 (delta 0), reused 0 (delta 0)`);
            addOutput(`remote: Total 5 (delta 0), reused 0 (delta 0)`);
            addOutput(`Receiving objects: 100% (5/5), done.`);
            addOutput(`Resolving deltas: 100% (0/0), done.`);
            return true;
          }
          addOutput('Usage: git clone <repository-url>');
          return false;

        case 'remote':
          const remoteSubCommand = parts[2];
          if (remoteSubCommand === '-v') {
            const remotes = Object.entries(gitState.remotes || {});
            if (remotes.length === 0) {
              addOutput('No remotes configured');
            } else {
              remotes.forEach(([name, url]) => {
                addOutput(`${name}\t${url} (fetch)`);
                addOutput(`${name}\t${url} (push)`);
              });
            }
            return true;
          } else if (remoteSubCommand === 'add') {
            const remoteName = parts[3];
            const remoteUrl = parts[4];
            if (remoteName && remoteUrl) {
              setGitState(prev => ({
                ...prev,
                remotes: { ...prev.remotes, [remoteName]: remoteUrl }
              }));
              addOutput(`Added remote ${remoteName}: ${remoteUrl}`);
              return true;
            }
          }
          addOutput('Usage: git remote [-v] or git remote add <name> <url>');
          return false;

        case 'push':
          const pushRemote = parts[2];
          const pushBranch = parts[3];
          if (pushRemote && pushBranch && gitState.remotes && gitState.remotes[pushRemote]) {
            if (gitState.commits.length === 0) {
              addOutput('No commits to push');
              return false;
            }
            addOutput(`Enumerating objects: ${gitState.commits.length}, done.`);
            addOutput(`Counting objects: 100% (${gitState.commits.length}/${gitState.commits.length}), done.`);
            addOutput(`Writing objects: 100% (${gitState.commits.length}/${gitState.commits.length}), done.`);
            addOutput(`To ${gitState.remotes[pushRemote]}`);
            addOutput(`   ${gitState.head?.substring(0, 7)}..${gitState.head?.substring(0, 7)}  ${pushBranch} -> ${pushBranch}`);
            return true;
          }
          addOutput('Usage: git push <remote> <branch>');
          return false;

        case 'pull':
          const pullRemote = parts[2];
          const pullBranch = parts[3];
          if (pullRemote && pullBranch && gitState.remotes && gitState.remotes[pullRemote]) {
            // チームメンバーからの模擬的な変更を追加
            const remoteCommit: Commit = {
              hash: Math.random().toString(36).substring(7),
              message: 'チームメンバーがスタイルを改善',
              author: '佐藤さん（デザイナー）',
              date: new Date(),
              parent: gitState.head || undefined,
              branch: gitState.currentBranch,
              files: ['team-info.html'],
              fileContents: {
                'team-info.html': '<!DOCTYPE html>\n<html>\n<head>\n  <title>チーム情報</title>\n  <meta charset=\"UTF-8\">\n</head>\n<body>\n  <h1>チーム情報</h1>\n  <h2>プロジェクト概要</h2>\n  <p>このサイトはチーム全員で協力して作成しています。</p>\n  <h2>最新の更新</h2>\n  <p>佐藤さんがデザインを改善しました！</p>\n</body>\n</html>'
              }
            };

            setGitState(prev => ({
              ...prev,
              commits: [...prev.commits, remoteCommit],
              head: remoteCommit.hash,
              files: { ...prev.files, ...remoteCommit.fileContents },
              branches: { ...prev.branches, [prev.currentBranch]: remoteCommit.hash }
            }));
            
            addOutput(`From ${gitState.remotes[pullRemote]}`);
            addOutput(`   ${gitState.head?.substring(0, 7)}..${remoteCommit.hash.substring(0, 7)}  ${pullBranch}     -> origin/${pullBranch}`);
            addOutput(`Updating ${gitState.head?.substring(0, 7)}..${remoteCommit.hash.substring(0, 7)}`);
            addOutput(`Fast-forward`);
            addOutput(` team-info.html | 15 +++++++++++++++`);
            addOutput(` 1 file changed, 15 insertions(+)`);
            return true;
          }
          addOutput('Usage: git pull <remote> <branch>');
          return false;

        case 'add':
          const filename = parts[2];
          if (filename && gitState.files[filename]) {
            setGitState(prev => ({
              ...prev,
              staged: [...prev.staged.filter(f => f !== filename), filename]
            }));
            addOutput(`Added ${filename} to staging area`);
            return true;
          }
          addOutput(`File ${filename} not found`);
          return false;

        case 'commit':
          if (gitState.staged.length === 0) {
            addOutput('Nothing to commit');
            return false;
          }
          const messageIndex = parts.findIndex(p => p === '-m');
          const message = messageIndex !== -1 ? parts[messageIndex + 1]?.replace(/"/g, '') : 'No message';
          
          const newCommit: Commit = {
            hash: Math.random().toString(36).substring(7),
            message,
            author: 'Student',
            date: new Date(),
            parent: gitState.head || undefined,
            branch: gitState.currentBranch,
            files: [...gitState.staged],
            fileContents: gitState.staged.reduce((acc, file) => {
              acc[file] = gitState.files[file];
              return acc;
            }, {} as { [key: string]: string })
          };

          setGitState(prev => ({
            ...prev,
            commits: [...prev.commits, newCommit],
            head: newCommit.hash,
            staged: [],
            branches: { ...prev.branches, [prev.currentBranch]: newCommit.hash }
          }));
          
          addOutput(`[${gitState.currentBranch} ${newCommit.hash}] ${message}`);
          return true;

        case 'branch':
          const branchName = parts[2];
          if (branchName && parts[1] === 'branch') {
            // git branch -d でブランチ削除
            if (parts[2] === '-d' && parts[3]) {
              const branchToDelete = parts[3];
              if (gitState.branches[branchToDelete] && branchToDelete !== gitState.currentBranch) {
                setGitState(prev => {
                  const newBranches = { ...prev.branches };
                  delete newBranches[branchToDelete];
                  return {
                    ...prev,
                    branches: newBranches
                  };
                });
                addOutput(`Deleted branch ${branchToDelete}`);
                return true;
              } else if (branchToDelete === gitState.currentBranch) {
                addOutput(`error: Cannot delete branch '${branchToDelete}' checked out`);
                return false;
              } else {
                addOutput(`error: branch '${branchToDelete}' not found`);
                return false;
              }
            }
            // 通常のブランチ作成
            setGitState(prev => ({
              ...prev,
              branches: { ...prev.branches, [branchName]: prev.head || "" }
            }));
            addOutput(`Created branch ${branchName}`);
            return true;
          }
          addOutput(Object.keys(gitState.branches).map(branch => 
            branch === gitState.currentBranch ? `* ${branch}` : `  ${branch}`
          ).join('\n'));
          return true;

        case 'switch':
        case 'checkout':
          const targetBranch = parts[2];
          // git switch -c でブランチ作成と切り替えを同時実行
          if (parts[2] === '-c' && parts[3]) {
            const newBranchName = parts[3];
            setGitState(prev => ({
              ...prev,
              branches: { ...prev.branches, [newBranchName]: prev.head || "" },
              currentBranch: newBranchName
            }));
            addOutput(`Switched to a new branch '${newBranchName}'`);
            return true;
          } else if (targetBranch && gitState.branches[targetBranch] !== undefined) {
            // ブランチ切り替え時にファイルを復元
            const targetCommitHash = gitState.branches[targetBranch];
            const targetCommit = gitState.commits.find(c => c.hash === targetCommitHash);
            const restoredFiles = targetCommit?.fileContents || gitState.files;
            
            setGitState(prev => ({
              ...prev,
              currentBranch: targetBranch,
              head: prev.branches[targetBranch] || null,
              files: restoredFiles
            }));
            addOutput(`Switched to branch '${targetBranch}'`);
            return true;
          }
          addOutput(`Branch ${targetBranch} not found`);
          return false;

        case 'merge':
          const sourceBranch = parts[2];
          if (sourceBranch && gitState.branches[sourceBranch] !== undefined) {
            const sourceCommitHash = gitState.branches[sourceBranch];
            const sourceCommit = gitState.commits.find(c => c.hash === sourceCommitHash);
            const currentCommit = gitState.commits.find(c => c.hash === gitState.head);
            
            // コンフリクトチェック: 同じファイルが両方のブランチで変更されているか
            const hasConflict = sourceCommit && currentCommit && 
              sourceCommit.fileContents && currentCommit.fileContents &&
              Object.keys(sourceCommit.fileContents).some(filename => 
                currentCommit.fileContents![filename] !== sourceCommit.fileContents![filename] &&
                currentCommit.fileContents![filename] !== undefined
              );

            if (hasConflict && sourceCommit && currentCommit) {
              // コンフリクトが発生した場合
              addOutput(`Auto-merging index.html`);
              addOutput(`CONFLICT (content): Merge conflict in index.html`);
              addOutput(`Automatic merge failed; fix conflicts and then commit the result.`);
              
              // コンフリクトマーカーを含むファイル内容を生成
              const conflictedFiles: { [key: string]: string } = {};
              Object.keys(sourceCommit.fileContents).forEach(filename => {
                if (currentCommit.fileContents![filename] !== sourceCommit.fileContents![filename]) {
                  const currentContent = currentCommit.fileContents![filename];
                  const sourceContent = sourceCommit.fileContents![filename];
                  
                  // 簡単なコンフリクトマーカーの生成（<h1>タグの部分のみ）
                  if (filename === 'index.html') {
                    const currentH1Match = currentContent.match(/<h1>(.*?)<\/h1>/);
                    const sourceH1Match = sourceContent.match(/<h1>(.*?)<\/h1>/);
                    
                    if (currentH1Match && sourceH1Match) {
                      const conflictedContent = currentContent.replace(
                        /<h1>.*?<\/h1>/,
                        `<<<<<<< HEAD\n  <h1>${currentH1Match[1]}</h1>\n=======\n  <h1>${sourceH1Match[1]}</h1>\n>>>>>>> ${sourceBranch}`
                      );
                      conflictedFiles[filename] = conflictedContent;
                    }
                  }
                }
              });
              
              setGitState(prev => ({
                ...prev,
                files: { ...prev.files, ...conflictedFiles }
              }));
              
              return false; // マージ失敗
            } else if (sourceCommit && sourceCommit.fileContents) {
              // マージコミットを作成
              const mergeCommit: Commit = {
                hash: Math.random().toString(36).substring(7),
                message: `Merge branch '${sourceBranch}'`,
                author: 'Student',
                date: new Date(),
                parent: gitState.head || undefined,
                branch: gitState.currentBranch,
                files: Object.keys(sourceCommit.fileContents),
                fileContents: sourceCommit.fileContents
              };

              setGitState(prev => ({
                ...prev,
                commits: [...prev.commits, mergeCommit],
                head: mergeCommit.hash,
                files: sourceCommit.fileContents || prev.files,
                branches: { ...prev.branches, [prev.currentBranch]: mergeCommit.hash }
              }));
              
              addOutput(`Merge made by the 'recursive' strategy.`);
              return true;
            }
          }
          addOutput(`Branch ${sourceBranch} not found`);
          return false;

        case 'log':
          const logs = gitState.commits
            .filter(commit => commit.branch === gitState.currentBranch)
            .reverse()
            .map(commit => `commit ${commit.hash}\nAuthor: ${commit.author}\nDate: ${commit.date.toLocaleString()}\n\n    ${commit.message}\n`)
            .join('\n');
          addOutput(logs || 'No commits yet');
          return true;

        case 'diff':
          let diffOutput = '';
          const lastCommit = gitState.commits[gitState.commits.length - 1];
          
          Object.keys(gitState.files).forEach(filename => {
            const currentContent = gitState.files[filename];
            const committedContent = lastCommit?.fileContents?.[filename] || '';
            
            if (currentContent !== committedContent && !gitState.staged.includes(filename)) {
              diffOutput += `diff --git a/${filename} b/${filename}\n`;
              diffOutput += `index 1234567..abcdefg 100644\n`;
              diffOutput += `--- a/${filename}\n`;
              diffOutput += `+++ b/${filename}\n`;
              diffOutput += `@@ -1,1 +1,1 @@\n`;
              if (committedContent) {
                diffOutput += `-${committedContent}\n`;
              }
              diffOutput += `+${currentContent}\n`;
              diffOutput += '\n';
            }
          });
          
          addOutput(diffOutput || 'No changes');
          return true;

        case 'status':
          let statusOutput = `On branch ${gitState.currentBranch}\n`;
          
          // Check for untracked files (files that exist but are not in any commit)
          const untrackedFiles = Object.keys(gitState.files).filter(file => 
            !gitState.commits.some(commit => commit.files && commit.files.includes(file)) &&
            !gitState.staged.includes(file)
          );
          
          // Check for modified files (files that exist in commits but have different content)
          const modifiedFiles = Object.keys(gitState.files).filter(file => {
            const lastCommit = gitState.commits[gitState.commits.length - 1];
            return lastCommit && lastCommit.files && lastCommit.files.includes(file) &&
                   lastCommit.fileContents && lastCommit.fileContents[file] !== gitState.files[file] &&
                   !gitState.staged.includes(file);
          });
          
          if (gitState.staged.length > 0) {
            statusOutput += '\nChanges to be committed:\n';
            statusOutput += gitState.staged.map(f => `\t${gitState.commits.length === 0 ? 'new file' : 'modified'}:   ${f}`).join('\n');
          }
          
          if (modifiedFiles.length > 0) {
            statusOutput += '\nChanges not staged for commit:\n';
            statusOutput += modifiedFiles.map(f => `\tmodified:   ${f}`).join('\n');
          }
          
          if (untrackedFiles.length > 0) {
            statusOutput += '\nUntracked files:\n';
            statusOutput += untrackedFiles.map(f => `\t${f}`).join('\n');
            statusOutput += '\n\n(use "git add <file>..." to include in what will be committed)';
          }
          
          if (gitState.staged.length === 0 && modifiedFiles.length === 0 && untrackedFiles.length === 0) {
            statusOutput += '\nnothing to commit, working tree clean';
          }
          
          addOutput(statusOutput);
          return true;

        default:
          addOutput(`Unknown command: ${gitCommand}`);
          return false;
      }
    } catch (error) {
      addOutput(`Error: ${error}`);
      return false;
    }
  }, [gitState, addOutput]);

  const updateFile = useCallback((filename: string, content: string) => {
    setGitState(prev => ({
      ...prev,
      files: { ...prev.files, [filename]: content }
    }));
  }, []);

  const clearOutput = useCallback(() => {
    setOutput([]);
  }, []);

  return {
    gitState,
    output,
    executeCommand,
    updateFile,
    clearOutput,
    setGitState
  };
};