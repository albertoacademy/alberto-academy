"use client";

import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Lead, LeadStatus, Level, Student } from "@/lib/crm-types";
import { publicLeadInterestOptions } from "@/lib/crm-types";
import {
  clearAdminSession,
  deleteLeadFromSupabase,
  deleteStudentFromSupabase,
  getAdminSession,
  isSupabaseConfigured,
  listLeads,
  listStudents,
  saveLeadToSupabase,
  saveStudentToSupabase,
  signInAdmin,
} from "@/lib/supabase-rest";
import {
  type LucideIcon,
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Plus,
  Save,
  Search,
  Trash2,
  UserCheck,
  UserRoundPlus,
  Users,
  X,
} from "lucide-react";

type ActiveView =
  | "leads"
  | "students"
  | "student-detail";

const navItems: {
  label: string;
  view: ActiveView;
  icon: LucideIcon;
}[] = [
  { label: "Leads", view: "leads", icon: UserRoundPlus },
  { label: "Students", view: "students", icon: Users },
];

const leadStatuses: LeadStatus[] = ["New", "Contacted", "Trial booked", "Won", "Lost"];
const levels: Level[] = ["Beginner", "Intermediate", "Advanced", "Not sure"];

const interests = [
  ...publicLeadInterestOptions,
  // Keep legacy values available so older leads remain editable.
  "English conversation",
  "Business English",
  "Exam prep",
  "Academic writing",
  "Spanish for foreigners",
  "Travel English",
];

const sources = [
  "Website form",
  "Instagram",
  "WhatsApp",
  "Referral",
  "Facebook",
];

const emptyLead: Lead = {
  id: "",
  name: "",
  email: "",
  phone: "",
  interest: publicLeadInterestOptions[0],
  level: "Not sure",
  status: "New",
  source: "Website form",
  submittedAt: new Date().toISOString().slice(0, 10),
  notes: "",
};

const emptyStudent: Student = {
  id: "",
  name: "",
  email: "",
  phone: "",
  startDate: new Date().toISOString().slice(0, 10),
  goals: "",
  notes: "",
};

export function AdminPanel() {
  const [activeView, setActiveView] = useState<ActiveView>("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [leadSearch, setLeadSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] =
    useState<"All" | LeadStatus>("All");
  const [leadDraft, setLeadDraft] = useState<Lead | null>(null);
  const [studentDraft, setStudentDraft] = useState<Student | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [leadMode, setLeadMode] = useState<"add" | "edit">("edit");
  const [studentMode, setStudentMode] = useState<"add" | "edit">("edit");
  const [syncMessage, setSyncMessage] = useState<string | null>(() =>
    isSupabaseConfigured()
      ? null
      : "Connect Supabase environment variables to load CRM data",
  );

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const session = getAdminSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const accessToken = session.accessToken;
    let isCancelled = false;

    async function loadBackendData() {
      try {
        const [backendLeads, backendStudents] = await Promise.all([
          listLeads(accessToken),
          listStudents(accessToken),
        ]);

        if (isCancelled) {
          return;
        }

        setLeads(backendLeads);
        setStudents(backendStudents);
        setSyncMessage("Connected to Supabase");
      } catch (error) {
        console.error(error);

        if (!isCancelled) {
          setSyncMessage(
            "Could not load Supabase data. Check the database schema and policies.",
          );
        }
      }
    }

    loadBackendData();

    return () => {
      isCancelled = true;
    };
  }, []);

  function getAccessToken() {
    return getAdminSession()?.accessToken ?? null;
  }

  const filteredLeads = useMemo(() => {
    const query = leadSearch.trim().toLowerCase();

    return leads.filter(
      (lead) =>
        (leadStatusFilter === "All" || lead.status === leadStatusFilter) &&
        (!query ||
          [
            lead.name,
            lead.email,
            lead.phone,
            lead.interest,
            lead.level,
            lead.status,
            lead.source,
          ].some((value) => value.toLowerCase().includes(query))),
    );
  }, [leadSearch, leadStatusFilter, leads]);

  const filteredStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();

    return students.filter(
      (student) =>
        !query ||
        [
          student.name,
          student.email,
          student.phone,
          student.startDate,
          student.goals,
          student.notes,
        ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [studentSearch, students]);

  const selectedStudent = useMemo(
    () =>
      students.find((student) => student.id === selectedStudentId) ?? null,
    [selectedStudentId, students],
  );

  const activeViewTitle =
    activeView === "leads"
      ? "Leads"
      : activeView === "students"
        ? "Students"
        : selectedStudent?.name ?? "Student Profile";

  function openNewLead() {
    setLeadMode("add");

    setLeadDraft({
      ...emptyLead,
      id: `LD-${String(leads.length + 1).padStart(3, "0")}`,
    });
  }

  function openNewStudent() {
    setStudentMode("add");

    setStudentDraft({
      ...emptyStudent,
      id: `ST-${String(students.length + 1).padStart(3, "0")}`,
    });
  }

  function openStudentProfile(student: Student) {
    setSelectedStudentId(student.id);
    setActiveView("student-detail");
  }

  function returnToStudents() {
    setActiveView("students");
    setSelectedStudentId(null);
  }

  function editSelectedStudent() {
    if (!selectedStudent) {
      return;
    }

    setStudentMode("edit");
    setStudentDraft(selectedStudent);
  }

  async function saveLead() {
    if (!leadDraft) {
      return;
    }

    const draft = leadDraft;

    if (!isSupabaseConfigured()) {
      setSyncMessage(
        "Supabase is not configured, so lead changes cannot be saved",
      );
      return;
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    try {
      const savedLead = await saveLeadToSupabase(
        draft,
        accessToken,
        leadMode,
      );

      if (leadMode === "add") {
        setLeads((current) => [savedLead, ...current]);
      } else {
        setLeads((current) =>
          current.map((lead) => (lead.id === savedLead.id ? savedLead : lead)),
        );
      }

      setSyncMessage("Lead saved to Supabase");
      setLeadDraft(null);
    } catch (error) {
      console.error(error);
      setSyncMessage("Could not save lead to Supabase");
    }
  }

  async function saveStudent() {
    if (!studentDraft) {
      return;
    }

    const draft = studentDraft;

    if (!isSupabaseConfigured()) {
      setSyncMessage(
        "Supabase is not configured, so student changes cannot be saved",
      );
      return;
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    try {
      const savedStudent = await saveStudentToSupabase(
        draft,
        accessToken,
        studentMode,
      );

      if (studentMode === "add") {
        setStudents((current) => [savedStudent, ...current]);
      } else {
        setStudents((current) =>
          current.map((student) =>
            student.id === savedStudent.id ? savedStudent : student,
          ),
        );
      }

      setSyncMessage("Student saved to Supabase");
      setStudentDraft(null);
    } catch (error) {
      console.error(error);
      setSyncMessage("Could not save student to Supabase");
    }
  }

  async function deleteLead(id: string) {
    if (!isSupabaseConfigured()) {
      setSyncMessage(
        "Supabase is not configured, so lead changes cannot be saved",
      );
      return;
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    try {
      await deleteLeadFromSupabase(id, accessToken);
      setSyncMessage("Lead deleted from Supabase");
    } catch (error) {
      console.error(error);
      setSyncMessage("Could not delete lead from Supabase");
      return;
    }

    setLeads((current) => current.filter((lead) => lead.id !== id));
    setLeadDraft(null);
  }

  async function deleteStudent(id: string) {
    if (!isSupabaseConfigured()) {
      setSyncMessage(
        "Supabase is not configured, so student changes cannot be saved",
      );
      return;
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    try {
      await deleteStudentFromSupabase(id, accessToken);
      setSyncMessage("Student deleted from Supabase");
    } catch (error) {
      console.error(error);
      setSyncMessage("Could not delete student from Supabase");
      return;
    }

    setStudents((current) =>
      current.filter((student) => student.id !== id),
    );

    setStudentDraft(null);

    if (selectedStudentId === id) {
      returnToStudents();
    }
  }

  function handleLogout() {
    clearAdminSession();
    window.location.href = "/login";
  }

  if (!isSupabaseConfigured()) {
    return <AdminConfigRequired />;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-surface-cream text-brand-navy">
      <div className="grid min-h-screen min-w-0 lg:grid-cols-[13.5rem_1fr] xl:grid-cols-[14rem_1fr]">
        <aside className="sticky top-0 z-40 min-w-0 bg-brand-navy px-3 py-3 text-white shadow-xl shadow-brand-navy/18 sm:px-4 lg:top-0 lg:flex lg:h-screen lg:flex-col lg:px-3.5 lg:py-4">
          <div className="flex items-center justify-between gap-3 lg:block">
            <div className="flex items-center gap-2.5 lg:gap-2">
              <span className="relative size-10 shrink-0 overflow-hidden rounded-md border border-white/10 bg-brand-blue lg:size-9">
                <Image
                  src="/images/alberto-avatar.png"
                  alt="Alberto Sosa"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>

              <div className="min-w-0">
                <p className="truncate font-heading text-lg font-semibold lg:text-base xl:text-lg">
                  Alberto Academy
                </p>

                <p className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-white/44">
                  Admin Panel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle scope="admin" />

              <button
                type="button"
                onClick={handleLogout}
                className="grid size-10 place-items-center rounded-md border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Log out"
              >
                <LogOut size={18} aria-hidden />
              </button>
            </div>
          </div>

          <nav
            className="mt-3 grid grid-cols-4 gap-1.5 lg:mt-7 lg:grid-cols-1 lg:gap-1.5"
            aria-label="Admin navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                activeView === item.view ||
                (activeView === "student-detail" &&
                  item.view === "students");

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (item.view !== "students") {
                      setSelectedStudentId(null);
                    }

                    setActiveView(item.view);
                  }}
                  className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-md px-1.5 py-2 text-center text-[0.68rem] font-extrabold leading-tight transition sm:text-xs lg:w-full lg:flex-row lg:justify-start lg:gap-2 lg:px-2.5 lg:py-2.5 lg:text-left lg:text-sm ${
                    isActive
                      ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/18"
                      : "text-white/70 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.8} aria-hidden />

                  <span className="max-w-full truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto hidden lg:block">
            <ThemeToggle scope="admin" />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 hidden w-full items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-2.5 text-sm font-extrabold text-white/64 transition hover:bg-white/10 hover:text-white lg:inline-flex"
          >
            <LogOut size={17} aria-hidden />
            Exit Admin
          </button>
        </aside>

        <section className="min-w-0 overflow-x-hidden">
          <header className="z-20 border-b border-brand-navy/10 bg-surface-white/88 px-3 py-3 backdrop-blur-xl sm:px-6 lg:sticky lg:top-0 lg:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="section-kicker">Alberto Workspace</p>

                <h1 className="mt-1 break-words font-heading text-[1.55rem] font-normal leading-tight sm:text-4xl md:text-3xl xl:text-4xl">
                  {activeViewTitle}
                </h1>

                {syncMessage && (
                  <p className="mt-1 text-xs font-bold text-brand-navy/46">
                    {syncMessage}
                  </p>
                )}
              </div>

              {activeView === "student-detail" && selectedStudent ? (
                <div className="grid gap-2 sm:grid-cols-2 md:w-auto">
                  <button
                    type="button"
                    onClick={returnToStudents}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-brand-navy/12 bg-surface-cream px-4 text-sm font-extrabold text-brand-navy transition hover:border-brand-teal hover:bg-surface-white sm:h-11"
                  >
                    <ArrowLeft size={17} aria-hidden />
                    Students
                  </button>

                  <button
                    type="button"
                    onClick={editSelectedStudent}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-red px-4 text-sm font-extrabold text-white transition hover:bg-brand-red-dark sm:h-11"
                  >
                    <Pencil size={17} aria-hidden />
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 md:w-auto">
                  <button
                    type="button"
                    onClick={openNewLead}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-red px-4 text-sm font-extrabold text-white transition hover:bg-brand-red-dark sm:h-11"
                  >
                    <Plus size={17} aria-hidden />
                    Add Lead
                  </button>

                  <button
                    type="button"
                    onClick={openNewStudent}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-navy px-4 text-sm font-extrabold text-white transition hover:bg-brand-blue sm:h-11"
                  >
                    <Plus size={17} aria-hidden />
                    Add Student
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className="px-3 py-3 sm:px-6 sm:py-5 lg:px-6 lg:py-6">
            {activeView === "leads" && (
              <LeadsView
                leads={filteredLeads}
                search={leadSearch}
                setSearch={setLeadSearch}
                statusFilter={leadStatusFilter}
                setStatusFilter={setLeadStatusFilter}
                onAdd={openNewLead}
                onOpen={(lead) => {
                  setLeadMode("edit");
                  setLeadDraft(lead);
                }}
              />
            )}

            {activeView === "students" && (
              <StudentsView
                students={filteredStudents}
                search={studentSearch}
                setSearch={setStudentSearch}
                onAdd={openNewStudent}
                onOpen={(student) => {
                  openStudentProfile(student);
                }}
              />
            )}

            {activeView === "student-detail" && selectedStudent && (
              <StudentProfilePage
                student={selectedStudent}
                onBack={returnToStudents}
                onEdit={editSelectedStudent}
              />
            )}

          </div>
        </section>
      </div>

      {leadDraft && (
        <LeadSheet
          mode={leadMode}
          lead={leadDraft}
          setLead={setLeadDraft}
          onClose={() => setLeadDraft(null)}
          onSave={saveLead}
          onDelete={() => deleteLead(leadDraft.id)}
        />
      )}

      {studentDraft && (
        <StudentSheet
          mode={studentMode}
          student={studentDraft}
          setStudent={setStudentDraft}
          onClose={() => setStudentDraft(null)}
          onSave={saveStudent}
          onDelete={() => deleteStudent(studentDraft.id)}
        />
      )}
    </main>
  );
}

function AdminConfigRequired() {
  return (
    <main className="grid min-h-screen place-items-center bg-brand-navy px-4 py-8 text-white">
      <section className="w-full max-w-xl rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/24 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative size-11 overflow-hidden rounded-md border border-white/10 bg-brand-blue">
              <Image
                src="/images/alberto-avatar.png"
                alt="Alberto Sosa"
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>

            <div>
              <p className="font-heading text-2xl font-semibold">
                Alberto Academy
              </p>

              <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-brand-teal-light">
                Admin Setup
              </p>
            </div>
          </div>

          <ThemeToggle scope="admin" compact />
        </div>

        <h1 className="mt-8 font-heading text-3xl font-normal leading-tight sm:text-4xl">
          Supabase needs to be configured first.
        </h1>

        <p className="mt-4 text-sm font-semibold leading-6 text-white/62">
          Add the public Supabase URL and anon key to the project environment
          variables, then restart or redeploy the app.
        </p>
      </section>
    </main>
  );
}

export function AdminLogin({ onEnter }: { onEnter?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (onEnter) {
      onEnter();
      return;
    }

    if (!isSupabaseConfigured()) {
      setErrorMessage("Supabase environment variables are not configured.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signInAdmin(email, password);
      window.location.href = "/admin";
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not sign in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-brand-navy px-4 py-6 text-brand-navy sm:px-6 sm:py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-xl border border-white/10 bg-surface-white p-5 shadow-2xl shadow-black/24 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative size-11 overflow-hidden rounded-md border border-brand-navy/10 bg-brand-blue">
              <Image
                src="/images/alberto-avatar.png"
                alt="Alberto Sosa"
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>

            <div>
              <p className="font-heading text-2xl font-semibold">
                Alberto Academy
              </p>

              <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-brand-navy/42">
                Admin Access
              </p>
            </div>
          </div>

          <ThemeToggle scope="admin" compact />
        </div>

        <h1 className="mt-7 font-heading text-3xl font-normal leading-tight sm:mt-8 sm:text-4xl">
          Welcome back, Alberto.
        </h1>

        <div className="mt-6 grid gap-4 sm:mt-7">
          <label className="form-field">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label className="form-field">
            Password

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="w-full pr-12"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((currentValue) => !currentValue)
                }
                className="absolute inset-y-0 right-0 grid w-12 place-items-center text-brand-navy/46 transition hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-teal"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                aria-pressed={showPassword}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={19} aria-hidden />
                ) : (
                  <Eye size={19} aria-hidden />
                )}
              </button>
            </div>
          </label>
        </div>

        {errorMessage && (
          <p className="mt-4 rounded-md border border-brand-red/20 bg-brand-red/8 px-4 py-3 text-sm font-bold text-brand-red">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-red px-6 text-sm font-extrabold text-white transition hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-60 sm:mt-7"
        >
          {isSubmitting ? "Signing in..." : "Enter Admin"}
          <ChevronRight size={18} aria-hidden />
        </button>
      </form>
    </main>
  );
}

function StudentProfilePage({
  student,
  onBack,
  onEdit,
}: {
  student: Student;
  onBack: () => void;
  onEdit: () => void;
}) {
  const initials =
    student.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "ST";

  const startDate = student.startDate
    ? new Date(`${student.startDate}T00:00:00`).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not provided";

  return (
    <div className="grid min-w-0 gap-4 lg:gap-5">
      <section className="overflow-hidden rounded-xl bg-brand-navy p-4 text-white shadow-xl shadow-brand-navy/12 sm:p-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-white/12 px-3 text-xs font-extrabold text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to students
        </button>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-brand-teal font-heading text-2xl text-white sm:size-20 sm:text-3xl">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="section-kicker-dark">Enrolled student</p>
              <h2 className="mt-1 break-words font-heading text-3xl font-normal leading-tight sm:text-5xl">
                {student.name}
              </h2>
              <p className="mt-2 text-sm font-semibold text-white/58">
                Start date: {startDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand-red px-5 text-sm font-extrabold text-white transition hover:bg-brand-red-dark sm:w-auto"
          >
            <Pencil size={17} aria-hidden />
            Edit student
          </button>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr] xl:gap-5">
        <section className="min-w-0 rounded-xl border border-brand-navy/10 bg-surface-white p-4 shadow-xl shadow-brand-navy/6 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Student details</p>
              <h3 className="mt-1 font-heading text-2xl font-normal">
                Personal and contact information
              </h3>
            </div>

            <UserCheck className="shrink-0 text-brand-teal" size={26} aria-hidden />
          </div>

          <div className="mt-5 grid gap-3">
            <StudentInfoRow icon={UserCheck} label="Full name" value={student.name} />
            <StudentInfoRow
              icon={Mail}
              label="Email address"
              value={student.email}
              href={student.email ? `mailto:${student.email}` : undefined}
            />
            <StudentInfoRow
              icon={Phone}
              label="Phone number"
              value={student.phone || "Not provided"}
              href={student.phone ? `tel:${student.phone}` : undefined}
            />
            <StudentInfoRow icon={CalendarDays} label="Start date" value={startDate} />
          </div>
        </section>

        <section className="min-w-0 rounded-xl bg-brand-blue p-4 text-white shadow-xl shadow-brand-navy/10 sm:p-5">
          <p className="section-kicker-dark">Student context</p>
          <h3 className="mt-1 font-heading text-2xl font-normal">
            Goals and notes
          </h3>

          <div className="mt-5 grid gap-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.07] p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-brand-teal-light">
                Goals
              </p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm font-semibold leading-6 text-white/76">
                {student.goals || "No goals added yet."}
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.07] p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-brand-teal-light">
                Notes
              </p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm font-semibold leading-6 text-white/76">
                {student.notes || "No notes added yet."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StudentInfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-blue text-white">
        <Icon size={18} aria-hidden />
      </span>

      <span className="min-w-0">
        <span className="block text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-brand-navy/42">
          {label}
        </span>
        <span className="mt-1 block break-words text-sm font-extrabold text-brand-navy">
          {value}
        </span>
      </span>
    </>
  );

  const className =
    "flex min-w-0 items-center gap-3 rounded-lg border border-brand-navy/10 bg-surface-cream p-3";

  return href ? (
    <a href={href} className={`${className} transition hover:border-brand-teal/40`}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}
function LeadsView({
  leads,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onAdd,
  onOpen,
}: {
  leads: Lead[];
  search: string;
  setSearch: (value: string) => void;
  statusFilter: "All" | LeadStatus;
  setStatusFilter: (value: "All" | LeadStatus) => void;
  onAdd: () => void;
  onOpen: (lead: Lead) => void;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-brand-navy/10 bg-surface-white shadow-xl shadow-brand-navy/6">
      <TableHeader
        kicker="CRM Leads"
        title="People who filled out the form"
        search={search}
        setSearch={setSearch}
        buttonLabel="Add Lead"
        onAdd={onAdd}
      >
        <AdminFilterSelect
          label="Status"
          value={statusFilter}
          options={["All", ...leadStatuses]}
          onChange={(value) =>
            setStatusFilter(value as "All" | LeadStatus)
          }
        />
      </TableHeader>

      <div className="grid gap-3 border-t border-brand-navy/10 p-3 md:hidden">
        {leads.map((lead) => (
          <button
            key={lead.id}
            type="button"
            onClick={() => onOpen(lead)}
            className="min-w-0 rounded-lg border border-brand-navy/10 bg-surface-cream p-3.5 text-left transition hover:border-brand-teal/40 hover:bg-surface-white"
          >
            <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
              <div className="min-w-0">
                <p className="break-words font-extrabold text-brand-navy">
                  {lead.name}
                </p>

                <p className="mt-1 break-all text-xs font-semibold text-brand-navy/48">
                  {lead.email}
                </p>
              </div>

              <StatusPill status={lead.status} />
            </div>

            <div className="mt-3 grid gap-2 border-t border-brand-navy/8 pt-3 text-xs font-bold text-brand-navy/58">
              <div className="grid gap-1">
                <span>Interest</span>

                <span className="text-brand-navy/78">
                  {lead.interest}
                </span>
              </div>

              <div className="grid gap-1">
                <span>Phone</span>

                <span className="break-words text-brand-navy/78">
                  {lead.phone || "Not provided"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span>Level</span>

                <span className="text-right text-brand-navy/78">
                  {lead.level}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span>Source</span>

                <span className="text-right text-brand-navy/78">
                  {lead.source}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[64rem] border-t border-brand-navy/10 text-left">
          <thead className="bg-brand-navy text-xs font-extrabold uppercase tracking-[0.08em] text-white/62">
            <tr>
              <th className="px-4 py-3 lg:px-5">Lead</th>
              <th className="px-4 py-3 lg:px-5">Phone</th>
              <th className="px-4 py-3 lg:px-5">Interest</th>
              <th className="px-4 py-3 lg:px-5">Level</th>
              <th className="px-4 py-3 lg:px-5">Status</th>
              <th className="px-4 py-3 lg:px-5">Source</th>
              <th className="px-4 py-3 lg:px-5">Date</th>
              <th className="px-4 py-3 text-right lg:px-5">Open</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-brand-navy/8">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onOpen(lead)}
                className="cursor-pointer transition hover:bg-surface-cream/80"
              >
                <td className="px-4 py-3.5 lg:px-5">
                  <div className="text-left">
                    <span className="block font-extrabold">
                      {lead.name}
                    </span>

                    <span className="mt-1 block text-xs font-semibold text-brand-navy/48">
                      {lead.email}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3.5 text-sm font-semibold text-brand-navy/58 lg:px-5">
                  {lead.phone || "Not provided"}
                </td>

                <td className="px-4 py-3.5 text-sm font-semibold text-brand-navy/66 lg:px-5">
                  {lead.interest}
                </td>

                <td className="px-4 py-3.5 text-sm font-bold text-brand-navy/62 lg:px-5">
                  {lead.level}
                </td>

                <td className="px-4 py-3.5 lg:px-5">
                  <StatusPill status={lead.status} />
                </td>

                <td className="px-4 py-3.5 text-sm font-semibold text-brand-navy/58 lg:px-5">
                  {lead.source}
                </td>

                <td className="px-4 py-3.5 text-sm font-semibold text-brand-navy/58 lg:px-5">
                  {lead.submittedAt}
                </td>

                <td className="px-4 py-3.5 text-right lg:px-5">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpen(lead);
                    }}
                    className="inline-grid size-9 place-items-center rounded-md border border-brand-navy/10 text-brand-navy transition hover:border-brand-teal hover:text-brand-blue"
                  >
                    <ChevronRight size={18} aria-hidden />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StudentsView({
  students,
  search,
  setSearch,
  onAdd,
  onOpen,
}: {
  students: Student[];
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
  onOpen: (student: Student) => void;
}) {
  const formatDate = (value: string) =>
    value
      ? new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Not provided";

  return (
    <section className="overflow-hidden rounded-xl border border-brand-navy/10 bg-surface-white shadow-xl shadow-brand-navy/6">
      <TableHeader
        kicker="Student Profiles"
        title="Enrolled student directory"
        search={search}
        setSearch={setSearch}
        buttonLabel="Add Student"
        onAdd={onAdd}
      />

      <div className="grid gap-3 border-t border-brand-navy/10 p-3 md:hidden">
        {students.map((student) => (
          <button
            key={student.id}
            type="button"
            onClick={() => onOpen(student)}
            className="min-w-0 rounded-lg border border-brand-navy/10 bg-surface-cream p-3.5 text-left transition hover:border-brand-teal/40 hover:bg-surface-white"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words font-extrabold text-brand-navy">
                  {student.name}
                </p>
                <p className="mt-1 break-all text-xs font-semibold text-brand-navy/48">
                  {student.email}
                </p>
              </div>
              <ChevronRight className="shrink-0 text-brand-navy/34" size={18} aria-hidden />
            </div>

            <div className="mt-3 grid gap-2 border-t border-brand-navy/8 pt-3 text-xs font-bold text-brand-navy/58">
              <p className="break-words">
                <span className="text-brand-navy/42">Phone: </span>
                {student.phone || "Not provided"}
              </p>
              <p>
                <span className="text-brand-navy/42">Start date: </span>
                {formatDate(student.startDate)}
              </p>
              <p className="line-clamp-2 break-words">
                <span className="text-brand-navy/42">Goals: </span>
                {student.goals || "No goals added"}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[64rem] border-t border-brand-navy/10 text-left">
          <thead className="bg-brand-navy text-xs font-extrabold uppercase tracking-[0.08em] text-white/62">
            <tr>
              <th className="px-4 py-3 lg:px-5">Student</th>
              <th className="px-4 py-3 lg:px-5">Phone</th>
              <th className="px-4 py-3 lg:px-5">Start date</th>
              <th className="px-4 py-3 lg:px-5">Goals</th>
              <th className="px-4 py-3 lg:px-5">Notes</th>
              <th className="px-4 py-3 text-right lg:px-5">Open</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-brand-navy/8">
            {students.map((student) => (
              <tr
                key={student.id}
                onClick={() => onOpen(student)}
                className="cursor-pointer transition hover:bg-surface-cream/80"
              >
                <td className="px-4 py-3.5 lg:px-5">
                  <span className="block font-extrabold">{student.name}</span>
                  <span className="mt-1 block text-xs font-semibold text-brand-navy/48">
                    {student.email}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm font-semibold text-brand-navy/58 lg:px-5">
                  {student.phone || "Not provided"}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm font-semibold text-brand-navy/58 lg:px-5">
                  {formatDate(student.startDate)}
                </td>
                <td className="max-w-56 px-4 py-3.5 text-sm font-semibold text-brand-navy/62 lg:px-5">
                  <span className="line-clamp-2">{student.goals || "No goals added"}</span>
                </td>
                <td className="max-w-56 px-4 py-3.5 text-sm font-semibold text-brand-navy/52 lg:px-5">
                  <span className="line-clamp-2">{student.notes || "No notes added"}</span>
                </td>
                <td className="px-4 py-3.5 text-right lg:px-5">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpen(student);
                    }}
                    aria-label={`Open ${student.name}`}
                    className="inline-grid size-9 place-items-center rounded-md border border-brand-navy/10 text-brand-navy transition hover:border-brand-teal hover:text-brand-blue"
                  >
                    <ChevronRight size={18} aria-hidden />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
function TableHeader({
  kicker,
  title,
  search,
  setSearch,
  buttonLabel,
  onAdd,
  children,
}: {
  kicker: string;
  title: string;
  search: string;
  setSearch: (value: string) => void;
  buttonLabel: string;
  onAdd: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <p className="section-kicker">{kicker}</p>

        <h2 className="mt-1 break-words font-heading text-2xl font-normal">
          {title}
        </h2>
      </div>

      <div className="flex w-full flex-col gap-3 lg:w-auto lg:items-end">
        {children && (
          <div className="grid w-full gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-row">
            {children}
          </div>
        )}

        <div className="grid w-full gap-3 sm:grid-cols-[1fr_auto] lg:w-auto">
          <label className="relative min-w-0">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/36"
              size={18}
              aria-hidden
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="h-11 w-full rounded-md border border-brand-navy/10 bg-surface-cream pl-10 pr-4 text-sm font-semibold text-brand-navy outline-none transition focus:border-brand-teal focus:bg-surface-white focus:ring-4 focus:ring-brand-teal/10 sm:w-full lg:w-72"
            />
          </label>

          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-red px-4 text-sm font-extrabold text-white transition hover:bg-brand-red-dark"
          >
            <Plus size={17} aria-hidden />
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminFilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-brand-navy/42">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded-md border border-brand-navy/10 bg-surface-cream px-3 text-xs font-extrabold text-brand-navy outline-none transition focus:border-brand-teal focus:bg-surface-white focus:ring-4 focus:ring-brand-teal/10"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function LeadSheet({
  mode,
  lead,
  setLead,
  onClose,
  onSave,
  onDelete,
}: {
  mode: "add" | "edit";
  lead: Lead;
  setLead: (lead: Lead) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(mode === "add");

  if (!isEditing) {
    return (
      <DetailShell
        title={lead.name}
        subtitle={lead.id}
        onClose={onClose}
        variant="drawer"
        density="compact"
      >
        <LeadDetailView
          lead={lead}
          onEdit={() => setIsEditing(true)}
          onDelete={onDelete}
        />
      </DetailShell>
    );
  }

  return (
    <DetailShell
      title={mode === "add" ? "Add Lead" : "Edit Lead"}
      subtitle={lead.id}
      onClose={onClose}
      variant="modal"
      density="compact"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <LeadField
          label="Full name"
          value={lead.name}
          onChange={(value) => setLead({ ...lead, name: value })}
        />

        <LeadField
          label="Email"
          type="email"
          value={lead.email}
          onChange={(value) => setLead({ ...lead, email: value })}
        />

        <LeadField
          label="Phone"
          value={lead.phone}
          onChange={(value) => setLead({ ...lead, phone: value })}
        />

        <LeadSelect
          label="Interest"
          value={lead.interest}
          options={interests}
          onChange={(value) => setLead({ ...lead, interest: value })}
        />

        <LeadSelect
          label="Level"
          value={lead.level}
          options={levels}
          onChange={(value) =>
            setLead({
              ...lead,
              level: value as Level,
            })
          }
        />

        <LeadSelect
          label="Status"
          value={lead.status}
          options={leadStatuses}
          onChange={(value) =>
            setLead({
              ...lead,
              status: value as LeadStatus,
            })
          }
        />

        <LeadSelect
          label="Source"
          value={lead.source}
          options={sources}
          onChange={(value) => setLead({ ...lead, source: value })}
        />

        <LeadField
          label="Submitted date"
          type="date"
          value={lead.submittedAt}
          onChange={(value) =>
            setLead({
              ...lead,
              submittedAt: value,
            })
          }
        />

        <div className="sm:col-span-2">
          <LeadTextarea
            label="Notes"
            value={lead.notes}
            onChange={(value) => setLead({ ...lead, notes: value })}
          />
        </div>
      </div>

      <SheetActions
        onSave={onSave}
        onDelete={onDelete}
        showDelete={mode === "edit"}
        density="compact"
      />
    </DetailShell>
  );
}

function StudentSheet({
  mode,
  student,
  setStudent,
  onClose,
  onSave,
  onDelete,
}: {
  mode: "add" | "edit";
  student: Student;
  setStudent: (student: Student) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  return (
    <DetailShell
      title={mode === "add" ? "Add Student" : "Edit Student"}
      subtitle={student.id}
      onClose={onClose}
      variant="modal"
      density="compact"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <StudentField
          label="Full name"
          value={student.name}
          onChange={(value) =>
            setStudent({
              ...student,
              name: value,
            })
          }
        />

        <StudentField
          label="Email"
          type="email"
          value={student.email}
          onChange={(value) =>
            setStudent({
              ...student,
              email: value,
            })
          }
        />

        <StudentField
          label="Phone"
          value={student.phone}
          onChange={(value) =>
            setStudent({
              ...student,
              phone: value,
            })
          }
        />

        <StudentField
          label="Start date"
          type="date"
          value={student.startDate}
          onChange={(value) =>
            setStudent({
              ...student,
              startDate: value,
            })
          }
        />

        <div className="sm:col-span-2">
          <StudentTextarea
            label="Goals"
            value={student.goals}
            onChange={(value) =>
              setStudent({
                ...student,
                goals: value,
              })
            }
          />
        </div>

        <div className="sm:col-span-2">
          <StudentTextarea
            label="Notes"
            value={student.notes}
            onChange={(value) =>
              setStudent({
                ...student,
                notes: value,
              })
            }
          />
        </div>
      </div>

      <SheetActions
        onSave={onSave}
        onDelete={onDelete}
        showDelete={mode === "edit"}
        density="compact"
      />
    </DetailShell>
  );
}

function DetailShell({
  title,
  subtitle,
  onClose,
  children,
  variant,
  density = "default",
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
  variant: "drawer" | "modal";
  density?: "default" | "compact";
}) {
  const isDrawer = variant === "drawer";
  const isCompact = density === "compact";

  return (
    <div
      className={`fixed inset-0 z-[80] bg-brand-navy/48 backdrop-blur-sm ${
        isDrawer
          ? "flex justify-end"
          : "grid place-items-center p-2 sm:p-4"
      }`}
    >
      <section
        className={`flex max-h-full w-full flex-col overflow-hidden bg-surface-white shadow-2xl shadow-brand-navy/30 ${
          isDrawer
            ? isCompact
              ? "h-full max-w-full sm:max-w-[30rem]"
              : "h-full max-w-full sm:max-w-[34rem]"
            : isCompact
              ? "max-h-[94vh] max-w-xl rounded-xl"
              : "max-h-[94vh] max-w-2xl rounded-xl"
        }`}
      >
        <header
          className={`flex items-center justify-between gap-4 border-b border-brand-navy/10 bg-surface-white ${
            isCompact ? "p-3.5 sm:p-4" : "p-4"
          }`}
        >
          <div className="min-w-0">
            <p className="section-kicker">{subtitle}</p>

            <h2
              className={`mt-1 break-words font-heading font-normal leading-tight ${
                isCompact
                  ? "text-xl sm:text-[1.7rem]"
                  : "text-2xl"
              }`}
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-md border border-brand-navy/10 text-brand-navy transition hover:border-brand-teal hover:text-brand-blue"
            aria-label="Close detail sheet"
          >
            <X size={20} aria-hidden />
          </button>
        </header>

        <div
          className={`min-h-0 flex-1 overflow-y-auto bg-surface-cream/45 ${
            isCompact
              ? "p-3.5 sm:p-4"
              : "p-4 sm:p-5"
          }`}
        >
          {children}
        </div>
      </section>
    </div>
  );
}

function LeadDetailView({
  lead,
  onEdit,
  onDelete,
}: {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="rounded-xl bg-brand-navy p-4 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-brand-teal-light">
              Lead Status
            </p>

            <h3 className="mt-2 break-words font-heading text-2xl font-normal sm:text-3xl">
              {lead.name}
            </h3>

            <p className="mt-2 text-sm font-semibold text-white/58">
              {lead.interest}
            </p>
          </div>

          <StatusPill status={lead.status} />
        </div>

        <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 text-sm font-semibold text-white/62">
          <a
            href={`mailto:${lead.email}`}
            className="break-words transition hover:text-white"
          >
            {lead.email}
          </a>

          <a
            href={`tel:${lead.phone}`}
            className="transition hover:text-white"
          >
            {lead.phone}
          </a>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DetailItem label="Level" value={lead.level} />
        <DetailItem label="Source" value={lead.source} />
        <DetailItem label="Submitted" value={lead.submittedAt} />
        <DetailItem label="Interest" value={lead.interest} />
        <DetailItem label="Record ID" value={lead.id} />
        <DetailItem label="Status" value={lead.status} />
      </div>

      <div className="rounded-xl border border-brand-navy/10 bg-surface-white p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-brand-navy/42">
          Notes
        </p>

        <p className="mt-3 text-sm leading-6 text-brand-navy/68">
          {lead.notes || "No notes yet."}
        </p>
      </div>

      <DetailActions onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-brand-navy/10 bg-surface-white p-3.5">
      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-brand-navy/42">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-bold text-brand-navy/78">
        {value}
      </p>
    </div>
  );
}

function DetailActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid gap-3 border-t border-brand-navy/10 pt-4 sm:grid-cols-2">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-navy px-4 text-sm font-extrabold text-white transition hover:bg-brand-blue"
      >
        <Pencil size={17} aria-hidden />
        Edit
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-brand-red/22 px-4 text-sm font-extrabold text-brand-red transition hover:bg-brand-red hover:text-white"
      >
        <Trash2 size={17} aria-hidden />
        Delete
      </button>
    </div>
  );
}

function SheetActions({
  onSave,
  onDelete,
  showDelete,
  density = "default",
}: {
  onSave: () => void;
  onDelete: () => void;
  showDelete: boolean;
  density?: "default" | "compact";
}) {
  const buttonHeight = density === "compact" ? "h-10" : "h-11";

  return (
    <div
      className={`${
        density === "compact" ? "mt-4" : "mt-6"
      } flex flex-col-reverse gap-3 border-t border-brand-navy/10 pt-4 sm:flex-row sm:justify-end`}
    >
      {showDelete && (
        <button
          type="button"
          onClick={onDelete}
          className={`inline-flex ${buttonHeight} items-center justify-center gap-2 rounded-md border border-brand-red/22 px-4 text-sm font-extrabold text-brand-red transition hover:bg-brand-red hover:text-white sm:min-w-32`}
        >
          <Trash2 size={17} aria-hidden />
          Delete
        </button>
      )}

      <button
        type="button"
        onClick={onSave}
        className={`inline-flex ${buttonHeight} items-center justify-center gap-2 rounded-md bg-brand-red px-4 text-sm font-extrabold text-white transition hover:bg-brand-red-dark sm:min-w-40`}
      >
        <Save size={17} aria-hidden />
        Save
      </button>
    </div>
  );
}

function LeadField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid min-w-0 gap-1.5 text-sm font-extrabold text-brand-navy">
      {label}

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full min-w-0 rounded-md border border-brand-navy/12 bg-surface-white px-3 text-sm font-semibold text-brand-navy outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
      />
    </label>
  );
}

function LeadSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1.5 text-sm font-extrabold text-brand-navy">
      {label}

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full min-w-0 rounded-md border border-brand-navy/12 bg-surface-white px-3 text-sm font-semibold text-brand-navy outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function LeadTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1.5 text-sm font-extrabold text-brand-navy">
      {label}

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-24 w-full min-w-0 rounded-md border border-brand-navy/12 bg-surface-white px-3 py-2.5 text-sm font-semibold leading-6 text-brand-navy outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
      />
    </label>
  );
}

function StudentField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid min-w-0 gap-1.5 text-sm font-extrabold text-brand-navy">
      {label}

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full min-w-0 rounded-md border border-brand-navy/12 bg-surface-white px-3 text-sm font-semibold text-brand-navy outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
      />
    </label>
  );
}

function StudentTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1.5 text-sm font-extrabold text-brand-navy">
      {label}

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-24 w-full min-w-0 rounded-md border border-brand-navy/12 bg-surface-white px-3 py-2.5 text-sm font-semibold leading-6 text-brand-navy outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
      />
    </label>
  );
}

function StatusPill({
  status,
}: {
  status: LeadStatus;
}) {
  const className =
    status === "Won"
      ? "border-brand-teal-light/22 bg-brand-teal text-white"
      : status === "Trial booked"
        ? "border-brand-teal-light/22 bg-brand-blue text-white"
        : status === "Lost"
          ? "border-brand-red/22 bg-brand-red text-white"
          : status === "Contacted"
            ? "border-brand-blue/22 bg-brand-blue text-white"
            : "border-brand-teal-light/22 bg-brand-teal-light text-brand-navy";

  return (
    <span
      className={`inline-flex w-fit min-w-fit items-center justify-center rounded-full border px-3 py-1 text-xs font-extrabold ${className}`}
    >
      {status}
    </span>
  );
}
