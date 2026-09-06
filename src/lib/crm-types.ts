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
