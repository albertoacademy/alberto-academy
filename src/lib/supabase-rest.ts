import type { Lead, Level, Student } from "@/lib/crm-types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const sessionKey = "alberto-academy-admin-session";

type AdminSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId?: string;
  email?: string;
};

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user?: { id?: string; email?: string };
};

type LeadRecord = {
  record_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  interest: string;
  level: Level;
  status: Lead["status"];
  source: string;
  submitted_at: string;
  notes: string | null;
};

type StudentRecord = {
  record_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  program: string;
  level: Student["level"];
  status: Student["status"];
  progress: number;
  last_session: string | null;
  next_session: string | null;
  goals: string | null;
  notes: string | null;
};

type AdminUserRecord = {
  user_id: string;
};

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(sessionKey);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (!session.accessToken) return null;
    if (session.expiresAt && session.expiresAt <= Date.now()) {
      clearAdminSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(sessionKey);
  }
}

export async function signInAdmin(email: string, password: string) {
  assertSupabaseConfigured();

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid admin email or password.");
  }

  const data = (await response.json()) as AuthResponse;
  const userId = data.user?.id;

  if (!userId) {
    throw new Error("Could not verify this admin account.");
  }

  const isAdmin = await isAdminUser(data.access_token, userId);

  if (!isAdmin) {
    throw new Error("This account is not authorized for Alberto Academy admin.");
  }

  const session: AdminSession = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    userId,
    email: data.user?.email,
  };

  window.localStorage.setItem(sessionKey, JSON.stringify(session));
  return session;
}

async function isAdminUser(accessToken: string, userId: string) {
  const records = await requestSupabase<AdminUserRecord[]>(
    `/rest/v1/admin_users?select=user_id&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    { accessToken },
  );

  return records.length > 0;
}

export async function listLeads(accessToken: string) {
  const records = await requestSupabase<LeadRecord[]>(
    "/rest/v1/leads?select=*&order=created_at.desc",
    { accessToken },
  );
  return records.map(recordToLead);
}

export async function listStudents(accessToken: string) {
  const records = await requestSupabase<StudentRecord[]>(
    "/rest/v1/students?select=*&order=created_at.desc",
    { accessToken },
  );
  return records.map(recordToStudent);
}

export async function saveLeadToSupabase(lead: Lead, accessToken: string, mode: "add" | "edit") {
  const record = leadToRecord(lead);
  const path =
    mode === "add"
      ? "/rest/v1/leads?select=*"
      : `/rest/v1/leads?record_id=eq.${encodeURIComponent(lead.id)}&select=*`;
  const method = mode === "add" ? "POST" : "PATCH";
  const records = await requestSupabase<LeadRecord[]>(path, {
    method,
    accessToken,
    body: record,
    prefer: "return=representation",
  });
  return recordToLead(records[0] ?? record);
}

export async function saveStudentToSupabase(student: Student, accessToken: string, mode: "add" | "edit") {
  const record = studentToRecord(student);
  const path =
    mode === "add"
      ? "/rest/v1/students?select=*"
      : `/rest/v1/students?record_id=eq.${encodeURIComponent(student.id)}&select=*`;
  const method = mode === "add" ? "POST" : "PATCH";
  const records = await requestSupabase<StudentRecord[]>(path, {
    method,
    accessToken,
    body: record,
    prefer: "return=representation",
  });
  return recordToStudent(records[0] ?? record);
}

export async function deleteLeadFromSupabase(id: string, accessToken: string) {
  await requestSupabase<void>(`/rest/v1/leads?record_id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    accessToken,
  });
}

export async function deleteStudentFromSupabase(id: string, accessToken: string) {
  await requestSupabase<void>(`/rest/v1/students?record_id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    accessToken,
  });
}

export async function submitPublicLead(input: {
  name: string;
  email: string;
  phone: string;
  interest: string;
  level: string;
}) {
  const today = new Date().toISOString().slice(0, 10);

  await requestSupabase<void>("/rest/v1/leads", {
    method: "POST",
    body: {
      full_name: input.name,
      email: input.email,
      phone: input.phone || null,
      interest: input.interest,
      level: normalizeLevel(input.level),
      status: "New",
      source: "Website form",
      submitted_at: today,
      notes: "Submitted from the public contact form.",
    },
    prefer: "return=minimal",
  });
}

async function requestSupabase<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    accessToken?: string;
    body?: unknown;
    prefer?: string;
  } = {},
) {
  assertSupabaseConfigured();

  const response = await fetch(`${supabaseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${options.accessToken ?? supabaseAnonKey}`,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Supabase request failed.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

function assertSupabaseConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase environment variables are not configured.");
  }
}

function normalizeLevel(value: string): Level {
  return value === "Beginner" || value === "Intermediate" || value === "Advanced" ? value : "Not sure";
}

function recordToLead(record: LeadRecord): Lead {
  return {
    id: record.record_id,
    name: record.full_name,
    email: record.email,
    phone: record.phone ?? "",
    interest: record.interest,
    level: record.level,
    status: record.status,
    source: record.source,
    submittedAt: record.submitted_at,
    notes: record.notes ?? "",
  };
}

function leadToRecord(lead: Lead): LeadRecord {
  return {
    record_id: lead.id,
    full_name: lead.name,
    email: lead.email,
    phone: lead.phone || null,
    interest: lead.interest,
    level: lead.level,
    status: lead.status,
    source: lead.source,
    submitted_at: lead.submittedAt,
    notes: lead.notes || null,
  };
}

function recordToStudent(record: StudentRecord): Student {
  return {
    id: record.record_id,
    name: record.full_name,
    email: record.email,
    phone: record.phone ?? "",
    program: record.program,
    level: record.level,
    status: record.status,
    progress: record.progress,
    lastSession: record.last_session ?? "",
    nextSession: record.next_session ?? "",
    goals: record.goals ?? "",
    notes: record.notes ?? "",
  };
}

function studentToRecord(student: Student): StudentRecord {
  return {
    record_id: student.id,
    full_name: student.name,
    email: student.email,
    phone: student.phone || null,
    program: student.program,
    level: student.level,
    status: student.status,
    progress: student.progress,
    last_session: student.lastSession || null,
    next_session: student.nextSession || null,
    goals: student.goals || null,
    notes: student.notes || null,
  };
}
