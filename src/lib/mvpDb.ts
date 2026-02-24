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
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function uuid(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
      id: "m1",
      title: "Save R5 today",
      description: "Start small! Save just R5 today to build the habit.",
      xpReward: 10,
      amountSuggestion: 5,
      isActive: true,
    },
    {
      id: "m2",
      title: "No takeaway for 3 days",
      description: "Skip takeaways for 3 days and put that money aside.",
      xpReward: 30,
      isActive: true,
    },
    {
      id: "m3",
      title: "Review your budget",
      description: "Spend 15 minutes reviewing where your money went this month.",
      xpReward: 15,
      isActive: true,
    },
    {
      id: "m4",
      title: "Save R20 this week",
      description: "Set aside R20 for a goal of your choice.",
      xpReward: 20,
      amountSuggestion: 20,
      isActive: true,
    },
    {
      id: "m5",
      title: "Learn one savings tip",
      description: "Read or watch one financial literacy tip today.",
      xpReward: 5,
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

export function updateProfile(userId: string, updates: Partial<Profile>): Profile {
  const existing = getProfile(userId);
  if (!existing) throw new Error("Profile not found");
  
  const updated = { ...existing, ...updates };
  localStorage.setItem(KEYS.profile(userId), JSON.stringify(updated));
  return updated;
}

// Goals helpers
export function listGoals(userId: string): Goal[] {
  return safeParse(localStorage.getItem(KEYS.goals(userId)), []);
}

export function createGoal(userId: string, goal: Omit<Goal, "id" | "userId" | "createdAt" | "savedAmount" | "status">): Goal {
  const newGoal: Goal = {
    ...goal,
    id: uuid(),
    userId,
    createdAt: new Date().toISOString(),
    savedAmount: 0,
    status: "active",
  };
  
  const goals = listGoals(userId);
  goals.push(newGoal);
  localStorage.setItem(KEYS.goals(userId), JSON.stringify(goals));
  
  return newGoal;
}

export function updateGoal(goalId: string, updates: Partial<Goal>): Goal {
  // Find goal across all users (simplified for demo)
  const allUserIds = ["demo-user-001"]; // In real app, get from auth
  let targetGoal: Goal | null = null;
  let ownerUserId: string | null = null;
  
  for (const userId of allUserIds) {
    const goals = listGoals(userId);
    const found = goals.find(g => g.id === goalId);
    if (found) {
      targetGoal = found;
      ownerUserId = userId;
      break;
    }
  }
  
  if (!targetGoal || !ownerUserId) throw new Error("Goal not found");
  
  const updated = { ...targetGoal, ...updates };
  const goals = listGoals(ownerUserId);
  const index = goals.findIndex(g => g.id === goalId);
  goals[index] = updated;
  localStorage.setItem(KEYS.goals(ownerUserId), JSON.stringify(goals));
  
  return updated;
}

export function deleteGoal(goalId: string): void {
  const allUserIds = ["demo-user-001"];
  
  for (const userId of allUserIds) {
    const goals = listGoals(userId);
    const filtered = goals.filter(g => g.id !== goalId);
    if (filtered.length !== goals.length) {
      localStorage.setItem(KEYS.goals(userId), JSON.stringify(filtered));
      return;
    }
  }
  
  throw new Error("Goal not found");
}

// Missions helpers
export function listMissions(): Mission[] {
  seedMissionsOnce();
  return safeParse(localStorage.getItem(KEYS.missions), []);
}

export function completeMission(userId: string, missionId: string): void {
  const missions = listMissions();
  const mission = missions.find(m => m.id === missionId);
  if (!mission) throw new Error("Mission not found");
  
  // Mark mission as inactive
  mission.isActive = false;
  localStorage.setItem(KEYS.missions, JSON.stringify(missions));
  
  // Grant XP
  const profile = getProfile(userId);
  if (profile) {
    updateProfile(userId, {
      xpPoints: profile.xpPoints + mission.xpReward,
      missionsCompleted: profile.missionsCompleted + 1,
    });
  }
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
  const profile = getProfile(userId);
  if (profile && transaction.transactionType === "save") {
    updateProfile(userId, {
      totalSaved: profile.totalSaved + transaction.amount,
    });
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
  
  updateProfile(userId, {
    xpPoints: profile.xpPoints + amount,
  });
}

// Streak helpers
export function updateStreak(userId: string): void {
  const profile = getProfile(userId);
  if (!profile) return;
  
  const today = new Date();
  const lastStreakDateStr = localStorage.getItem(KEYS.lastStreakDate(userId));
  const lastStreakDate = lastStreakDateStr ? new Date(lastStreakDateStr) : null;
  
  let newStreak = profile.currentStreak;
  let newLongest = profile.longestStreak;
  
  if (!lastStreakDate || !sameDay(lastStreakDate, today)) {
    const daysSinceLast = daysBetween(lastStreakDate || today, today);
    
    if (daysSinceLast === 1) {
      // Consecutive day
      newStreak = profile.currentStreak + 1;
      newLongest = Math.max(newLongest, newStreak);
    } else if (daysSinceLast > 1) {
      // Streak broken
      newStreak = 1;
    }
    
    localStorage.setItem(KEYS.lastStreakDate(userId), today.toISOString());
    updateProfile(userId, {
      currentStreak: newStreak,
      longestStreak: newLongest,
    });
  }
}
