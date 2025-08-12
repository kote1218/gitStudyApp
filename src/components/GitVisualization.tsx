import React from 'react';
import { GitBranch, GitCommit, GitMerge, ArrowRight } from 'lucide-react';
import { GitState, Commit } from '../types';

interface GitVisualizationProps {
  gitState: GitState;
}

export const GitVisualization: React.FC<GitVisualizationProps> = ({ gitState }) => {
  const renderBranchTree = () => {
    const branches = Object.keys(gitState.branches);
    const commits = gitState.commits;
    
    if (branches.length <= 1 && commits.length === 0) {
      return null;
    }

    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">ブランチツリー</h4>
        <div className="space-y-2">
          {branches.map((branch, index) => {
            const branchCommits = commits.filter(c => c.branch === branch);
            const isCurrent = branch === gitState.currentBranch;
            
            return (
              <div key={branch} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isCurrent ? 'bg-blue-500' : 'bg-gray-400'
                } transition-all duration-300`} />
                <span className={`text-sm font-mono ${
                  isCurrent ? 'text-blue-700 font-semibold' : 'text-gray-600'
                }`}>
                  {branch}
                </span>
                {branchCommits.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <ArrowRight size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {branchCommits.length} commit{branchCommits.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {isCurrent && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    現在
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Branch switching animation */}
        {branches.length > 1 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              ブランチ切り替え可能
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderCommitGraph = () => {
    if (gitState.commits.length === 0) {
      return (
        <div className="flex items-center justify-center h-32 text-gray-500">
          No commits yet
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {gitState.commits.map((commit, index) => (
          <div key={commit.hash} className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <GitCommit size={20} className="text-blue-500" />
              {index < gitState.commits.length - 1 && (
                <div className="w-0.5 h-8 bg-gray-300 mt-2" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-mono text-sm text-gray-600">
                {commit.hash}
              </div>
              <div className="text-sm font-medium">{commit.message}</div>
              <div className="text-xs text-gray-500">
                {commit.author} • {commit.date.toLocaleString()}
              </div>
            </div>
            <div className="text-xs px-2 py-1 bg-gray-100 rounded">
              {commit.branch}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border rounded-lg p-4 h-80 overflow-y-auto">
      <div className="flex items-center mb-4">
        <GitBranch size={16} className="mr-2 text-gray-600" />
        <span className="font-medium text-gray-700">Git Graph</span>
        {Object.keys(gitState.remotes || {}).length > 0 && (
          <div className="ml-auto flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600">Remote Connected</span>
          </div>
        )}
      </div>
      
      {/* Branch indicator */}
      <div className="mb-4 flex items-center space-x-2">
        <span className="text-sm text-gray-600">Current branch:</span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded transition-all duration-300">
          {gitState.currentBranch}
        </span>
      </div>

      {/* Remote information */}
      {Object.keys(gitState.remotes || {}).length > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="text-sm font-medium text-green-800 mb-2">Remote repositories:</div>
          {Object.entries(gitState.remotes || {}).map(([name, url]) => (
            <div key={name} className="text-sm text-green-700 font-mono">
              {name}: {url}
            </div>
          ))}
        </div>
      )}

      {/* Branch Tree */}
      {renderBranchTree()}

      {/* Staging area */}
      {gitState.staged.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div className="text-sm font-medium text-yellow-800 mb-2">Staged files:</div>
          {gitState.staged.map(file => (
            <div key={file} className="text-sm text-yellow-700">+ {file}</div>
          ))}
        </div>
      )}

      {/* Commit graph */}
      {renderCommitGraph()}
    </div>
  );
};