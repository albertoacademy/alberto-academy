import type { Metadata } from "next";
import { CalendarClock, CreditCard, FileCheck2, GraduationCap, RefreshCcw, Scale } from "lucide-react";
import { LegalPage } from "@/components/legal-page";
import { getRequestLocale } from "@/lib/i18n-server";
import { createLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createLocalizedMetadata({
    locale,
    path: "/terms",
    ...(locale === "en"
      ? { title: "Terms of Service | Alberto Academy", description: "Terms covering online lessons, schedules, payments, learning materials, and student responsibilities." }
      : { title: "Términos del servicio | Alberto Academy", description: "Términos sobre clases online, horarios, pagos, materiales y responsabilidades de estudiantes de Alberto Academy." }),
  });
}

const sections = {
  es: [
    { title: "Descripción del servicio", icon: GraduationCap, copy: ["Alberto Academy ofrece enseñanza online de inglés y español mediante programas por niveles, clases individuales y grupales, tutorías y coaching especializado.", "La conversación inicial gratuita sirve para conocer objetivos y orientar el nivel. No constituye una clase de prueba."] },
    { title: "Reservas y horarios", icon: CalendarClock, copy: ["Las sesiones se confirman una vez acordados la fecha, la hora y el formato. Las clases privadas duran entre una y dos horas; las grupales duran dos horas y se imparten dos días por semana.", "El estudiante debe conectarse puntualmente con internet estable, micrófono y un teléfono inteligente o computadora."] },
    { title: "Pagos y planes", icon: CreditCard, copy: ["Los precios y condiciones se confirman antes de iniciar. Se aceptan transferencias bancarias, depósitos directos y pagos por PayPal.", "Al finalizar el mes existe un periodo de gracia de 10 días. Después puede aplicarse un recargo de RD$300. Si existen dos meses de atraso, el servicio puede pausarse hasta completar los pagos pendientes."] },
    { title: "Asistencia y cambios", icon: RefreshCcw, copy: ["Las ausencias, justificadas o no, se registran en el control de asistencia. Se espera que el estudiante complete al menos el 75 % de asistencia para finalizar satisfactoriamente el programa.", "Los cambios de horario dependen de la disponibilidad y, en clases grupales, de que exista otro grupo con nivel y unidades compatibles. Las pausas deben coordinarse previamente."] },
    { title: "Materiales de aprendizaje", icon: FileCheck2, copy: ["Las clases pueden utilizar libros, PDF, videos, audios, presentaciones y ejercicios interactivos. Los materiales base con costo se cotizan por separado.", "Los recursos entregados son para uso personal del estudiante y no pueden venderse, distribuirse ni presentarse como parte de otro programa sin autorización."] },
    { title: "Responsabilidad del estudiante", icon: Scale, copy: ["El estudiante debe participar con respeto, realizar las prácticas acordadas y comunicar con honestidad sus necesidades de nivel, objetivos y horario.", "Alberto Academy ofrece estructura, enseñanza y seguimiento, pero los resultados dependen de la asistencia, la práctica, la constancia y el contexto de cada persona. No se garantizan resultados automáticos."] },
  ],
  en: [
    { title: "Service description", icon: GraduationCap, copy: ["Alberto Academy provides online Spanish and English instruction through level-based programs, private and group lessons, tutoring, and specialized coaching.", "The free consultation is used to understand goals and identify a starting level. It is not a trial lesson."] },
    { title: "Bookings and schedules", icon: CalendarClock, copy: ["Sessions are confirmed after the date, time, and format are agreed. Private lessons last one to two hours; group lessons last two hours and meet twice per week.", "Students must connect on time with stable internet, a microphone, and a smartphone or computer."] },
    { title: "Payments and plans", icon: CreditCard, copy: ["Prices and conditions are confirmed before lessons begin. Bank transfers, direct deposits, and PayPal payments are accepted.", "A 10-day grace period applies after the end of each month. A RD$300 late fee may apply afterward. Service may be paused after two unpaid months until the balance is resolved."] },
    { title: "Attendance and changes", icon: RefreshCcw, copy: ["All absences are recorded. Students are expected to maintain at least 75% attendance to complete a program successfully.", "Schedule changes depend on availability. Group changes also require another class at a compatible level and unit. Pauses must be coordinated in advance."] },
    { title: "Learning materials", icon: FileCheck2, copy: ["Lessons may use books, PDFs, videos, audio, presentations, and interactive exercises. Paid core materials are quoted separately.", "Resources are for the student's personal use and may not be sold, distributed, or presented as part of another program without permission."] },
    { title: "Student responsibility", icon: Scale, copy: ["Students must participate respectfully, complete agreed practice, and communicate their level, goals, and availability honestly.", "Alberto Academy provides structure, instruction, and guidance, but results depend on attendance, practice, consistency, and each learner's circumstances. Automatic results are not guaranteed."] },
  ],
};

export default async function TermsPage() {
  const locale = await getRequestLocale();
  const isEnglish = locale === "en";
  return <LegalPage locale={locale} eyebrow={isEnglish ? "Terms of Service" : "Términos del servicio"} title={isEnglish ? "Clear terms for a responsible learning experience." : "Condiciones claras para una experiencia de aprendizaje responsable."} description={isEnglish ? "These terms explain how lessons, schedules, payments, materials, and student participation work." : "Estos términos explican cómo funcionan las clases, los horarios, los pagos, los materiales y la participación del estudiante."} updated={isEnglish ? "July 22, 2026" : "22 de julio de 2026"} sections={sections[locale]} />;
}
