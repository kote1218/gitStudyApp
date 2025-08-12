import React from 'react';
import { File, Edit3 } from 'lucide-react';

interface FileEditorProps {
  files: { [path: string]: string };
  onFileChange: (filename: string, content: string) => void;
  stagedFiles: string[];
}

export const FileEditor: React.FC<FileEditorProps> = ({ 
  files, 
  onFileChange, 
  stagedFiles 
}) => {
  const [selectedFile, setSelectedFile] = React.useState<string | null>(
    Object.keys(files)[0] || null
  );
  const [newFileName, setNewFileName] = React.useState('');
  const [showNewFileInput, setShowNewFileInput] = React.useState(false);

  const handleContentChange = (content: string) => {
    if (selectedFile) {
      onFileChange(selectedFile, content);
    }
  };

  const handleCreateNewFile = () => {
    if (newFileName.trim()) {
      onFileChange(newFileName.trim(), '');
      setSelectedFile(newFileName.trim());
      setNewFileName('');
      setShowNewFileInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateNewFile();
    } else if (e.key === 'Escape') {
      setShowNewFileInput(false);
      setNewFileName('');
    }
  };

  return (
    <div className="bg-white border rounded-lg h-80 flex">
      {/* File Tree */}
      <div className="w-48 bg-gray-50 border-r">
        <div className="flex items-center px-3 py-2 bg-gray-100 border-b">
          <File size={16} className="mr-2 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Files</span>
          <button
            onClick={() => setShowNewFileInput(true)}
            className="ml-auto text-xs text-blue-600 hover:text-blue-800"
            title="新しいファイルを作成"
          >
            +
          </button>
        </div>
        <div className="p-2">
          {showNewFileInput && (
            <div className="mb-2">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="ファイル名を入力"
                className="w-full text-xs px-2 py-1 border rounded"
                autoFocus
              />
            </div>
          )}
          {Object.keys(files).map(filename => (
            <div
              key={filename}
              onClick={() => setSelectedFile(filename)}
              className={`flex items-center px-2 py-1 text-sm cursor-pointer rounded ${
                selectedFile === filename 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <File size={14} className="mr-2" />
              <span className="truncate">{filename}</span>
              {stagedFiles.includes(filename) && (
                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
              )}
            </div>
          ))}
          {Object.keys(files).length === 0 && !showNewFileInput && (
            <div className="text-xs text-gray-500 text-center py-4">
              ファイルがありません<br />
              「+」ボタンで作成
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center px-3 py-2 bg-gray-100 border-b">
          <Edit3 size={16} className="mr-2 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {selectedFile || 'Select a file'}
          </span>
        </div>
        <div className="flex-1 p-4">
          {selectedFile ? (
            <textarea
              value={files[selectedFile] || ''}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full h-full border-none outline-none resize-none font-mono text-sm"
              placeholder="Edit your file..."
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a file to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
};