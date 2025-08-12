import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
  output: string[];
  onCommand: (command: string) => void;
  currentBranch: string;
}

export const Terminal: React.FC<TerminalProps> = ({ output, onCommand, currentBranch }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
      onCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="bg-gray-900 text-green-400 font-mono text-sm h-80 flex flex-col">
      <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
        <TerminalIcon size={16} className="mr-2" />
        <span className="text-gray-300">Terminal</span>
      </div>
      
      <div 
        ref={outputRef}
        className="flex-1 p-4 overflow-y-auto space-y-1"
      >
        {(output || []).map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center px-4 py-2 border-t border-gray-700">
        <span className="text-blue-400 mr-2">
          ~/git-learning ({currentBranch}) $
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-green-400"
          placeholder="Type git command..."
          autoFocus
        />
      </form>
    </div>
  );
};