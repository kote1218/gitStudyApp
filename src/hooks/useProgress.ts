import { useState, useEffect } from 'react';
import { UserProgress, Badge } from '../types';
import { stages } from '../data/stages.tsx';

const STORAGE_KEY = 'git-learning-progress';

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        startedAt: new Date(parsed.startedAt),
        lastActivity: new Date(parsed.lastActivity),
        badges: parsed.badges.map((b: any) => ({
          ...b,
          earnedAt: b.earnedAt ? new Date(b.earnedAt) : undefined
        }))
      };
    }
    return {
      currentStage: 1,
      completedStages: [],
      badges: [],
      totalProgress: 0,
      startedAt: new Date(),
      lastActivity: new Date()
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeStage = (stageId: number) => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return;

    setProgress(prev => {
      const newCompletedStages = prev.completedStages.includes(stageId) 
        ? prev.completedStages 
        : [...prev.completedStages, stageId];
      
      const newBadges = stage.badge && !prev.badges.find(b => b.id === stage.badge!.id)
        ? [...prev.badges, { ...stage.badge, earned: true, earnedAt: new Date() }]
        : prev.badges;

      const totalProgress = (newCompletedStages.length / stages.length) * 100;

      // Unlock next stage
      const nextStage = stages.find(s => s.id === stageId + 1);
      if (nextStage) {
        nextStage.unlocked = true;
      }

      return {
        ...prev,
        completedStages: newCompletedStages,
        badges: newBadges,
        totalProgress,
        currentStage: Math.min(stageId + 1, stages.length),
        lastActivity: new Date()
      };
    });
  };

  const earnBadge = (badge: Badge) => {
    setProgress(prev => ({
      ...prev,
      badges: prev.badges.find(b => b.id === badge.id) 
        ? prev.badges 
        : [...prev.badges, { ...badge, earned: true, earnedAt: new Date() }],
      lastActivity: new Date()
    }));
  };

  const resetProgress = () => {
    setProgress({
      currentStage: 1,
      completedStages: [],
      badges: [],
      totalProgress: 0,
      startedAt: new Date(),
      lastActivity: new Date()
    });
    
    // Reset stages
    stages.forEach((stage, index) => {
      stage.unlocked = index === 0;
      stage.completed = false;
      stage.tasks.forEach(task => task.completed = false);
    });
  };

  return {
    progress,
    completeStage,
    earnBadge,
    resetProgress
  };
};