export type LeadStatus = "New" | "Contacted" | "Trial booked" | "Won" | "Lost";
export type Level = "Beginner" | "Intermediate" | "Advanced" | "Not sure";
export type StudentStatus = "Pending" | "Active" | "Paused" | "Completed";
export type PaymentStatus = "Not required" | "Awaiting proof" | "Proof submitted" | "Confirmed";

export const publicLeadInterestOptions = [
  "Programa de inglés por niveles",
  "Clases individuales",
  "Clases grupales",
  "Tutoría personalizada",
  "Preparación para entrevistas o exámenes",
  "Español para extranjeros",
] as const;

export const studentProgramDefinitions = [
  {
    id: "level-program",
    label: "Programa por niveles",
    aliases: ["Programa por niveles", "Programa de inglés por niveles", "Spanish program by level"],
  },
  {
    id: "private-lessons",
    label: "Clases privadas",
    aliases: ["Clases privadas", "Clases individuales", "Clases privadas de inglés", "Private Spanish lessons"],
  },
  {
    id: "group-lessons",
    label: "Clases grupales",
    aliases: ["Clases grupales", "Clases grupales de inglés", "Group Spanish lessons"],
  },
  {
    id: "personalized-tutoring",
    label: "Tutorías personalizadas",
    aliases: ["Tutoría personalizada", "Tutorías personalizadas", "Personalized tutoring", "Personalized Spanish tutoring"],
  },
  {
    id: "specialized-coaching",
    label: "Coaching especializado",
    aliases: ["Coaching especializado", "Preparación para entrevistas o exámenes", "Spanish for work, travel, or relocation", "Specialized Spanish coaching"],
  },
  {
    id: "language-instruction",
    label: "Español para extranjeros / English instruction",
    aliases: ["Español para extranjeros", "English instruction"],
  },
] as const;

export function normalizeStudentProgram(program: string) {
  const normalized = program.trim().toLocaleLowerCase("es");
  const definition = studentProgramDefinitions.find((item) =>
    item.aliases.some((alias) => alias.toLocaleLowerCase("es") === normalized),
  );

  return definition?.label ?? program.trim();
}

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  level: Level;
  status: LeadStatus;
  source: string;
  submittedAt: string;
  notes: string;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  status: StudentStatus;
  paymentStatus: PaymentStatus;
  paymentBank: string;
  paymentProofPath: string;
  paymentProofName: string;
  startDate: string;
  goals: string;
  notes: string;
};
