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
      description: "Even small wins count. Put aside R5 and log it!",
      xpReward: 15,
      amountSuggestion: 5,
      isActive: true,
    },
    {
      id: "m2",
      title: "Skip one takeaway",
      description: "Cook at home once today and save the difference.",
      xpReward: 25,
      amountSuggestion: 30,
      isActive: true,
    },
    {
      id: "m3",
      title: "Track one expense",
      description: "Write down one thing you spent money on today.",
      xpReward: 10,
      isActive: true,
    },
  ];

  localStorage.setItem(KEYS.missions, JSON.stringify(missions));
}

// ---------- Auth (MVP) ----------

export function getAuthUser(): MVPUser | null {
  return safeParse<MVPUser | null>(localStorage.getItem(KEYS.authUser), null);
}

export function setAuthUser(user: MVPUser | null) {
  if (!user) {
    localStorage.removeItem(KEYS.authUser);
    return;
  }
  localStorage.setItem(KEYS.authUser, JSON.stringify(user));
}

export function signUpMVP(email: string, _password: string, fullName: string, phoneNumber?: string): MVPUser {
  const user: MVPUser = { id: uuid(), email, fullName, phoneNumber };
  setAuthUser(user);
  ensureProfile(user);
  seedMissionsOnce();
  return user;
}

export function signInMVP(email: string, _password: string): MVPUser {
  const existing = getAuthUser();
  if (existing && existing.email === email) return existing;

  const user: MVPUser = { id: uuid(), email, fullName: email.split("@")[0] || "Friend" };
  setAuthUser(user);
  ensureProfile(user);
  seedMissionsOnce();
  return user;
}

export function signOutMVP() {
  setAuthUser(null);
}

// ---------- Profile ----------

export function ensureProfile(user: { id: string; fullName?: string; email?: string }): Profile {
  const existing = safeParse<Profile | null>(localStorage.getItem(KEYS.profile(user.id)), null);
  if (existing) return existing;

  const derivedName =
    (user.fullName && user.fullName.trim()) ||
    (user.email ? user.email.split("@")[0] : "") ||
    "Friend";

  const profile: Profile = {
    userId: user.id,
    fullName: derivedName,
    totalSaved: 0,
    currentStreak: 0,
    longestStreak: 0,
    xpPoints: 0,
    maliLevel: 1,
    missionsCompleted: 0,
    badgesEarned: 0,
  };

  localStorage.setItem(KEYS.profile(user.id), JSON.stringify(profile));
  return profile;
}

export function getProfile(userId: string): Profile | null {
  return safeParse<Profile | null>(localStorage.getItem(KEYS.profile(userId)), null);
}

export function saveProfile(profile: Profile) {
  localStorage.setItem(KEYS.profile(profile.userId), JSON.stringify(profile));
}

function applyXp(profile: Profile, xp: number): Profile {
  const nextXp = Math.max(0, profile.xpPoints + xp);
  const nextLevel = Math.max(1, Math.floor(nextXp / 100) + 1);
  return { ...profile, xpPoints: nextXp, maliLevel: nextLevel };
}

function updateStreakOnSave(userId: string, profile: Profile): Profile {
  const now = new Date();
  const last = safeParse<string | null>(localStorage.getItem(KEYS.lastStreakDate(userId)), null);
  if (!last) {
    localStorage.setItem(KEYS.lastStreakDate(userId), now.toISOString());
    const updated = { ...profile, currentStreak: profile.currentStreak + 1 };
    updated.longestStreak = Math.max(updated.longestStreak, updated.currentStreak);
    return updated;
  }

  const lastDate = new Date(last);
  if (sameDay(lastDate, now)) return profile;

  const diff = daysBetween(lastDate, now);
  const nextStreak = diff === 1 ? profile.currentStreak + 1 : 1;
  localStorage.setItem(KEYS.lastStreakDate(userId), now.toISOString());
  const updated = { ...profile, currentStreak: nextStreak };
  updated.longestStreak = Math.max(updated.longestStreak, updated.currentStreak);
  return updated;
}

// ---------- Missions ----------

export function listMissions(): Mission[] {
  seedMissionsOnce();
  const all = safeParse<Mission[]>(localStorage.getItem(KEYS.missions), []);
  return all.filter((m) => m.isActive);
}

// ---------- Transactions ----------

export function listTransactions(userId: string): Transaction[] {
  const tx = safeParse<Transaction[]>(localStorage.getItem(KEYS.tx(userId)), []);
  return tx.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addTransaction(input: Omit<Transaction, "id" | "createdAt">): Transaction {
  const tx: Transaction = { ...input, id: uuid(), createdAt: new Date().toISOString() };
  const all = listTransactions(input.userId);
  localStorage.setItem(KEYS.tx(input.userId), JSON.stringify([tx, ...all]));
  return tx;
}

// ---------- Goals CRUD ----------

export function listGoals(userId: string): Goal[] {
  return safeParse<Goal[]>(localStorage.getItem(KEYS.goals(userId)), []).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

export function createGoal(userId: string, title: string, targetAmount: number): Goal {
  const goal: Goal = {
    id: uuid(),
    userId,
    title,
    targetAmount,
    savedAmount: 0,
    createdAt: new Date().toISOString(),
    status: "active",
  };
  const all = listGoals(userId);
  localStorage.setItem(KEYS.goals(userId), JSON.stringify([goal, ...all]));
  return goal;
}

export function updateGoal(
  userId: string,
  goalId: string,
  patch: Partial<Pick<Goal, "title" | "targetAmount" | "savedAmount" | "status">>
): Goal {
  const all = listGoals(userId);
  const idx = all.findIndex((g) => g.id === goalId);
  if (idx < 0) throw new Error("Goal not found");
  const next = { ...all[idx], ...patch };
  if (next.savedAmount >= next.targetAmount) next.status = "completed";
  all[idx] = next;
  localStorage.setItem(KEYS.goals(userId), JSON.stringify(all));
  return next;
}

export function deleteGoal(userId: string, goalId: string) {
  const all = listGoals(userId).filter((g) => g.id !== goalId);
  localStorage.setItem(KEYS.goals(userId), JSON.stringify(all));
}

// ---------- High-level actions (used by UI) ----------

export function completeMission(userId: string, mission: Mission): { profile: Profile; transaction: Transaction } {
  const profile = getProfile(userId) ?? ensureProfile({ id: userId, email: "", fullName: "Friend" });

  const amount = mission.amountSuggestion ?? 5;
  const transaction = addTransaction({
    userId,
    transactionType: "save",
    amount,
    description: `${mission.title} (+${mission.xpReward} XP)`,
  });

  let next = { ...profile };
  next.totalSaved += amount;
  next.missionsCompleted += 1;
  next = updateStreakOnSave(userId, next);
  next = applyXp(next, mission.xpReward);

  saveProfile(next);
  return { profile: next, transaction };
}

export function grantXp(userId: string, xp: number, description = "XP earned"): Profile {
  const profile = getProfile(userId) ?? ensureProfile({ id: userId, email: "", fullName: "Friend" });
  const next = applyXp(profile, xp);
  saveProfile(next);

  addTransaction({ userId, transactionType: "reward", amount: 0, description });
  return next;
}

export function addChatMessage(msg: Omit<ChatMessage, "id" | "createdAt">): ChatMessage {
  const full: ChatMessage = { ...msg, id: uuid(), createdAt: new Date().toISOString() };
  const all = safeParse<ChatMessage[]>(localStorage.getItem(KEYS.chat(msg.userId)), []);
  localStorage.setItem(KEYS.chat(msg.userId), JSON.stringify([...all, full]));
  return full;
}

export function listChatMessages(userId: string): ChatMessage[] {
  return safeParse<ChatMessage[]>(localStorage.getItem(KEYS.chat(userId)), []);
}