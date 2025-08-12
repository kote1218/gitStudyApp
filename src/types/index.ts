export interface GitState {
  files: { [path: string]: string };
  staged: string[];
  commits: Commit[];
  branches: { [name: string]: string };
  currentBranch: string;
  head: string | null;
  remotes: { [name: string]: string };
  initialized?: boolean;
  modifiedFiles?: string[];
}

export interface Commit {
  hash: string;
  message: string;
  author: string;
  date: Date;
  parent?: string;
  branch: string;
  files?: string[];
  fileContents?: { [filename: string]: string };
}

export interface Stage {
  id: number;
  title: string;
  description: string;
  category: 'tutorial' | 'basic' | 'branch' | 'remote' | 'conflict' | 'practical';
  objectives: string[];
  initialState: Partial<GitState>;
  tasks: Task[];
  badge?: Badge;
  unlocked: boolean;
  completed: boolean;
}

export interface Task {
  id: string;
  description: string;
  hint: string;
  command?: string;
  check: (state: GitState) => boolean;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface UserProgress {
  currentStage: number;
  completedStages: number[];
  badges: Badge[];
  totalProgress: number;
  startedAt: Date;
  lastActivity: Date;
}