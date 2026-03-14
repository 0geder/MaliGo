// A tiny localStorage-backed "database" for an MVP/demo.
// This keeps the app fully working even without Supabase configured.

export type MVPUser = {
  id: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
};

export type Profile = {
  userId: string;
  fullName: string;
  totalSaved: number;
  currentStreak: number;
  longestStreak: number;
  xpPoints: number;
  maliLevel: number;
  missionsCompleted: number;
  badgesEarned: number;
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  amountSuggestion?: number; // e.g. "save R5"
  isActive: boolean;
};

export type Transaction = {
  id: string;
  userId: string;
  createdAt: string;
  transactionType: "save" | "reward";
  amount: number;
  description: string;
};

export type Goal = {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  createdAt: string;
  status: "active" | "completed";
};

export type ChatMessage = {
  id: string;
  userId: string;
  createdAt: string;
  role: "user" | "assistant";
  content: string;
};

const KEYS = {
  authUser: "maligo:mvp:authUser",
  profile: (userId: string) => `maligo:mvp:profile:${userId}`,
  goals: (userId: string) => `maligo:mvp:goals:${userId}`,
  tx: (userId: string) => `maligo:mvp:tx:${userId}`,
  chat: (userId: string) => `maligo:mvp:chat:${userId}`,
  missions: "maligo:mvp:missions",
  lastStreakDate: (userId: string) => `maligo:mvp:lastStreakDate:${userId}`,
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function uuid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function daysBetween(a: Date, b: Date): number {
  const ms = 24 * 60 * 60 * 1000;
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((db - da) / ms);
}

export function seedMissionsOnce() {
  const existing = safeParse<Mission[]>(localStorage.getItem(KEYS.missions), []);
  if (existing.length) return;

  const missions: Mission[] = [
    {
      id: "1",
      title: "Save R5 Today",
      description: "Put aside just R5 today - every rand counts!",
      xpReward: 10,
      amountSuggestion: 5,
      isActive: true,
    },
    {
      id: "2", 
      title: "Skip Takeaway",
      description: "Cook at home instead of buying takeaway. Save R50+!",
      xpReward: 25,
      amountSuggestion: 50,
      isActive: true,
    },
    {
      id: "3",
      title: "Track Expenses",
      description: "Write down everything you spend today. Awareness is key!",
      xpReward: 15,
      isActive: true,
    },
    {
      id: "4",
      title: "No Impulse Buys",
      description: "Avoid unplanned purchases for 24 hours. Think before you buy!",
      xpReward: 20,
      isActive: true,
    },
    {
      id: "5",
      title: "Review Bank Statement",
      description: "Check your bank statement for unnecessary subscriptions.",
      xpReward: 30,
      isActive: true,
    },
  ];

  localStorage.setItem(KEYS.missions, JSON.stringify(missions));
}

// Auth helpers
export function getAuthUser(): MVPUser | null {
  return safeParse(localStorage.getItem(KEYS.authUser), null);
}

export function setAuthUser(user: MVPUser): void {
  localStorage.setItem(KEYS.authUser, JSON.stringify(user));
}

export function clearAuthUser(): void {
  localStorage.removeItem(KEYS.authUser);
}

// Profile helpers
export function getProfile(userId: string): Profile | null {
  return safeParse(localStorage.getItem(KEYS.profile(userId)), null);
}

export function updateProfile(userId: string, updates: Partial<Profile>): Profile | null {
  const existing = getProfile(userId);
  if (!existing) return null;
  
  const updated = { ...existing, ...updates };
  localStorage.setItem(KEYS.profile(userId), JSON.stringify(updated));
  return updated;
}

export function ensureProfile(profile: Profile): Profile {
  const existing = getProfile(profile.userId);
  if (existing) return existing;
  
  const newProfile = {
    ...profile,
    totalSaved: 0,
    currentStreak: 0,
    longestStreak: 0,
    xpPoints: 0,
    maliLevel: 1,
    missionsCompleted: 0,
    badgesEarned: 0,
  };
  
  localStorage.setItem(KEYS.profile(profile.userId), JSON.stringify(newProfile));
  return newProfile;
}

// Goals helpers
export function listGoals(userId: string): Goal[] {
  return safeParse(localStorage.getItem(KEYS.goals(userId)), []);
}

export function createGoal(userId: string, goal: Omit<Goal, "id" | "userId" | "createdAt">): Goal {
  const newGoal: Goal = {
    ...goal,
    id: uuid(),
    userId,
    createdAt: new Date().toISOString(),
  };
  
  const goals = listGoals(userId);
  goals.push(newGoal);
  localStorage.setItem(KEYS.goals(userId), JSON.stringify(goals));
  
  return newGoal;
}

export function updateGoal(userId: string, goalId: string, updates: Partial<Goal>): Goal | null {
  const goals = listGoals(userId);
  const index = goals.findIndex(g => g.id === goalId);
  
  if (index === -1) return null;
  
  goals[index] = { ...goals[index], ...updates };
  localStorage.setItem(KEYS.goals(userId), JSON.stringify(goals));
  
  return goals[index];
}

export function deleteGoal(userId: string, goalId: string): boolean {
  const goals = listGoals(userId);
  const filtered = goals.filter(g => g.id !== goalId);
  
  if (filtered.length === goals.length) return false;
  
  localStorage.setItem(KEYS.goals(userId), JSON.stringify(filtered));
  return true;
}

// Mission helpers
export function listMissions(): Mission[] {
  return safeParse(localStorage.getItem(KEYS.missions), [
    {
      id: "1",
      title: "Save R5 Today",
      description: "Put aside just R5 today - every rand counts!",
      xpReward: 10,
      amountSuggestion: 5,
      isActive: true,
    },
    {
      id: "2", 
      title: "Skip Takeaway",
      description: "Cook at home instead of buying takeaway. Save R50+!",
      xpReward: 25,
      amountSuggestion: 50,
      isActive: true,
    },
    {
      id: "3",
      title: "Track Expenses",
      description: "Write down everything you spend today. Awareness is key!",
      xpReward: 15,
      isActive: true,
    },
    {
      id: "4",
      title: "No Impulse Buys",
      description: "Avoid unplanned purchases for 24 hours. Think before you buy!",
      xpReward: 20,
      isActive: true,
    },
    {
      id: "5",
      title: "Review Bank Statement",
      description: "Check your bank statement for unnecessary subscriptions.",
      xpReward: 30,
      isActive: true,
    },
  ]);
}

export function completeMission(userId: string, missionId: string): { success: boolean; xpEarned: number } {
  const missions = listMissions();
  const mission = missions.find(m => m.id === missionId);
  
  if (!mission) return { success: false, xpEarned: 0 };
  
  // Grant XP
  grantXp(userId, mission.xpReward);
  
  // Mark as completed (in real app, you'd track this per user)
  const completedKey = `maligo:mvp:completed:${userId}:${missionId}`;
  localStorage.setItem(completedKey, JSON.stringify({ completedAt: new Date().toISOString() }));
  
  return { success: true, xpEarned: mission.xpReward };
}

export function isMissionCompleted(userId: string, missionId: string): boolean {
  const completedKey = `maligo:mvp:completed:${userId}:${missionId}`;
  return !!localStorage.getItem(completedKey);
}

// Transactions helpers
export function listTransactions(userId: string): Transaction[] {
  return safeParse(localStorage.getItem(KEYS.tx(userId)), []);
}

export function addTransaction(userId: string, transaction: Omit<Transaction, "id" | "userId" | "createdAt">): Transaction {
  const newTx: Transaction = {
    ...transaction,
    id: uuid(),
    userId,
    createdAt: new Date().toISOString(),
  };
  
  const tx = listTransactions(userId);
  tx.push(newTx);
  localStorage.setItem(KEYS.tx(userId), JSON.stringify(tx));
  
  // Update profile total saved
  if (transaction.transactionType === "save") {
    const profile = getProfile(userId);
    if (profile) {
      updateProfile(userId, {
        totalSaved: profile.totalSaved + transaction.amount,
      });
    }
  }
  
  return newTx;
}

// Chat helpers
export function listChatMessages(userId: string): ChatMessage[] {
  return safeParse(localStorage.getItem(KEYS.chat(userId)), []);
}

export function addChatMessage(userId: string, message: Omit<ChatMessage, "id" | "userId" | "createdAt">): ChatMessage {
  const newMsg: ChatMessage = {
    ...message,
    id: uuid(),
    userId,
    createdAt: new Date().toISOString(),
  };
  
  const messages = listChatMessages(userId);
  messages.push(newMsg);
  localStorage.setItem(KEYS.chat(userId), JSON.stringify(messages));
  
  return newMsg;
}

// XP helpers
export function grantXp(userId: string, amount: number): void {
  const profile = getProfile(userId);
  if (!profile) return;
  
  const newTotalXp = profile.xpPoints + amount;
  const newLevel = Math.floor(newTotalXp / 100) + 1; // 100 XP per level
  
  updateProfile(userId, {
    xpPoints: newTotalXp,
    maliLevel: newLevel,
    missionsCompleted: profile.missionsCompleted + 1,
  });
}

// Streak helpers
export function updateStreak(userId: string): { isNewDay: boolean; currentStreak: number; longestStreak: number } {
  const profile = getProfile(userId);
  if (!profile) return { isNewDay: false, currentStreak: 0, longestStreak: 0 };
  
  const today = new Date().toDateString();
  const lastStreakKey = KEYS.lastStreakDate(userId);
  const lastStreakDate = localStorage.getItem(lastStreakKey);
  
  let newStreak = profile.currentStreak;
  let newLongest = profile.longestStreak;
  let isNewDay = false;
  
  if (lastStreakDate !== today) {
    // Check if it's consecutive day
    const lastDate = lastStreakDate ? new Date(lastStreakDate) : null;
    const todayDate = new Date(today);
    const dayDiff = lastDate ? Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) : 1;
    
    if (dayDiff === 1) {
      // Consecutive day
      newStreak += 1;
      isNewDay = true;
    } else if (dayDiff > 1) {
      // Streak broken
      newStreak = 1;
      isNewDay = true;
    }
    
    newLongest = Math.max(newStreak, newLongest);
    
    // Update profile and last streak date
    updateProfile(userId, {
      currentStreak: newStreak,
      longestStreak: newLongest,
    });
    
    localStorage.setItem(lastStreakKey, today);
    
    // Grant daily bonus XP
    if (isNewDay) {
      grantXp(userId, 5); // 5 XP daily bonus
    }
  }
  
  return { isNewDay, currentStreak: newStreak, longestStreak: newLongest };
}
