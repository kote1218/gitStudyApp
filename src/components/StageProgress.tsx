import React from 'react';
import { CheckCircle, Circle, Target } from 'lucide-react';
import { Stage, Task } from '../types';

interface StageProgressProps {
  stage: Stage;
  currentTaskIndex: number;
  onTaskSelect: (taskIndex: number) => void;
}

export const StageProgress: React.FC<StageProgressProps> = ({ 
  stage, 
  currentTaskIndex,
  onTaskSelect 
}) => {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center mb-4">
        <Target size={20} className="mr-2 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">{stage.title}</h2>
      </div>
      
      <p className="text-gray-600 mb-4">{stage.description}</p>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">学習目標:</h3>
        <ul className="space-y-1">
          {stage.objectives.map((objective, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              {objective}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">タスク:</h3>
        {stage.tasks.map((task, index) => (
          <div
            key={task.id}
            onClick={() => onTaskSelect(index)}
            className={`p-3 border rounded cursor-pointer transition-colors ${
              currentTaskIndex === index
                ? 'border-blue-500 bg-blue-50'
                : task.completed
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              {task.completed ? (
                <CheckCircle size={18} className="text-green-600 mr-2" />
              ) : currentTaskIndex === index ? (
                <Circle size={18} className="text-blue-600 mr-2" />
              ) : (
                <Circle size={18} className="text-gray-400 mr-2" />
              )}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">
                  {task.description}
                </div>
                {currentTaskIndex === index && (
                  <div className="text-xs text-gray-600 mt-1">
                    💡 ヒント: {task.hint}
                  </div>
                )}
                {task.command && currentTaskIndex === index && (
                  <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded mt-2">
                    {task.command}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};