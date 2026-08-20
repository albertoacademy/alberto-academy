export type LeadStatus = "New" | "Contacted" | "Trial booked" | "Won" | "Lost";
export type Level = "Beginner" | "Intermediate" | "Advanced" | "Not sure";

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
  startDate: string;
  goals: string;
  notes: string;
};
