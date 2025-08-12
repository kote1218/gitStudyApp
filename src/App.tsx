import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TopPage } from './components/TopPage';
import { LearningPage } from './components/LearningPage';
import { BadgeCollection } from './components/BadgeCollection';
import { useProgress } from './hooks/useProgress';
import { stages } from './data/stages.tsx';

type Page = 'top' | 'learning' | 'badges';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('top');
  const [selectedStageId, setSelectedStageId] = useState<number>(1);
  const { progress, completeStage, resetProgress } = useProgress();

  const selectedStage = stages.find(stage => stage.id === selectedStageId) || stages[0];

  const handleStartLearning = () => {
    const nextStage = stages.find(stage => 
      stage.unlocked && !progress.completedStages.includes(stage.id)
    ) || stages[0];
    setSelectedStageId(nextStage.id);
    setCurrentPage('learning');
  };

  const handleSelectStage = (stageId: number) => {
    const stage = stages.find(s => s.id === stageId);
    if (stage && (stage.unlocked || progress.completedStages.includes(stageId))) {
      setSelectedStageId(stageId);
      setCurrentPage('learning');
    }
  };

  const handleStageComplete = (stageId: number) => {
    completeStage(stageId);
    setCurrentPage('top');
  };

  const handleBackToTop = () => {
    setCurrentPage('top');
  };

  const handleViewBadges = () => {
    setCurrentPage('badges');
  };

  // Initialize stage unlock status based on progress
  React.useEffect(() => {
    stages.forEach((stage, index) => {
      if (index === 0) {
        stage.unlocked = true;
      } else {
        stage.unlocked = progress.completedStages.includes(stage.id - 1);
      }
      stage.completed = progress.completedStages.includes(stage.id);
    });
  }, [progress.completedStages]);

  return (
    <div className="App">
      {currentPage === 'top' && (
        <TopPage
          progress={progress}
          stages={stages}
          onStartLearning={handleStartLearning}
          onSelectStage={handleSelectStage}
          onViewBadges={handleViewBadges}
        />
      )}
      
      {currentPage === 'learning' && (
        <LearningPage
          stage={selectedStage}
          onBack={handleBackToTop}
          onStageComplete={handleStageComplete}
        />
      )}
      
      {currentPage === 'badges' && (
        <BadgeCollection
          badges={progress.badges}
          onBack={handleBackToTop}
        />
      )}

      {/* Debug Panel - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-xs">
          <div>Current Page: {currentPage}</div>
          <div>Progress: {progress.totalProgress.toFixed(1)}%</div>
          <div>Badges: {progress.badges.length}</div>
          <button
            onClick={resetProgress}
            className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs"
          >
            Reset Progress
          </button>
        </div>
      )}
    </div>
  );
}

export default App;