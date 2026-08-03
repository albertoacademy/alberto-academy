import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, CalendarCheck, CheckCircle2, Clock3, CreditCard, GraduationCap, Laptop, MessageCircle, ShieldCheck, Target } from "lucide-react";
import { MotionArticle, MotionReveal } from "@/components/motion-reveal";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { localeAlternates, localePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return locale === "en" ? { title: "Pricing | Alberto Academy", description: "Compare pricing for private Spanish lessons, group classes, and personalized tutoring, including the first-month discount.", alternates: localeAlternates(locale, "/pricing") } : { title: "Precios | Alberto Academy", description: "Conozca los precios reales de las clases privadas, grupales y tutorías de Alberto Academy, además del descuento del primer mes.", alternates: localeAlternates(locale, "/pricing") };
}

const pricingCopy = {
  es: {
    heroKicker: "Precios claros", heroTitle: "Elija el formato que se ajuste a su ritmo, su objetivo y su presupuesto.", heroBody: "Los estudiantes nuevos reciben un 15 % de descuento durante el primer mes, tanto en clases privadas como grupales.", heroCta: "Agendar conversación inicial", heroAnchor: "Ver precios",
    plansKicker: "Opciones de estudio", plansTitle: "Tres formas de avanzar a su manera.", plansBody: "Antes de pagar, Alberto le ayudará a identificar la modalidad y el nivel adecuados para su situación.",
    plans: [
      { name: "Clases privadas", eyebrow: "Atención individual", price: "RD$900", cadence: "por hora", description: "Un plan uno a uno para trabajar su nivel, sus objetivos y las situaciones en las que realmente necesita comunicarse.", badge: "15 % de descuento el primer mes", icon: Target, features: ["Mínimo de 10 horas al mes", "Clases de 1 a 2 horas", "Compromiso inicial de 3 meses", "Plan y corrección personalizados"], cta: "Consultar clases privadas" },
      { name: "Clases grupales", eyebrow: "Programa por nivel", price: "RD$1,500", cadence: "por persona al mes", description: "Una rutina constante para aprender con estudiantes de nivel similar, practicar en grupo y avanzar por unidades.", badge: "15 % de descuento el primer mes", icon: GraduationCap, featured: true, features: ["Lunes y miércoles o martes y jueves", "Dos horas por clase", "Grupo organizado por nivel", "Interacción y práctica guiada"], cta: "Consultar clases grupales" },
      { name: "Tutoría personalizada", eyebrow: "Apoyo puntual", price: "RD$1,000", cadence: "por tutoría", description: "Apoyo específico para resolver una dificultad, preparar una asignación o practicar una situación concreta.", badge: "Modalidad flexible", icon: MessageCircle, features: ["Sesiones por día o por semana", "Enfoque en una necesidad concreta", "Práctica y explicación dirigidas", "Horario sujeto a disponibilidad"], cta: "Consultar tutorías" },
    ],
    policyKicker: "Antes de inscribirse", policyTitle: "Preguntas frecuentes",
    policies: [
      { title: "Conversación inicial gratuita", copy: "Dura hasta una hora y permite orientar su nivel y sus objetivos. No es una clase de prueba.", icon: CalendarCheck },
      { title: "Pagos", copy: "Se aceptan transferencias y pagos con tarjeta de débito o crédito mediante servicios en línea.", icon: CreditCard },
      { title: "Materiales", copy: "Los libros o materiales base con costo se cotizan por separado antes de confirmar la inscripción.", icon: ShieldCheck },
      { title: "Progreso responsable", copy: "Los resultados dependen de la asistencia, la práctica y la responsabilidad del estudiante.", icon: Clock3 },
      { title: "Reconocimiento al desempeño", copy: "Al finalizar cada nivel, el estudiante con la mejor calificación recibe gratis los materiales del nivel siguiente.", icon: Award },
      { title: "Clases online", copy: "Las sesiones se imparten por Google Meet, con seguimiento en Google Classroom y comunicación por WhatsApp.", icon: Laptop },
    ],
    finalKicker: "¿Cuál opción le conviene?", finalTitle: "Converse primero. Decida después.", finalBody: "En un plazo de 24 a 48 horas laborables, Alberto Academy se comunicará con usted para coordinar la conversación inicial gratuita.", finalCta: "Solicitar conversación",
  },
  en: {
    heroKicker: "Clear pricing", heroTitle: "Choose the Spanish-learning format that fits your goals and budget.", heroBody: "New students receive 15% off their first month of private or group lessons.", heroCta: "Book a Free Consultation", heroAnchor: "View Pricing",
    plansKicker: "Ways to learn", plansTitle: "Three options. One practical next step.", plansBody: "Before you pay, Alberto will help you identify the format and starting level that make sense for you.",
    plans: [
      { name: "Private Spanish lessons", eyebrow: "One-to-one attention", price: "RD$900", cadence: "per hour", description: "A personal plan built around your Spanish level, goals, and the situations where you need to communicate.", badge: "15% off your first month", icon: Target, features: ["Minimum 10 hours per month", "1 to 2-hour lessons", "Initial 3-month commitment", "Personal plan and feedback"], cta: "Ask About Private Lessons" },
      { name: "Group Spanish lessons", eyebrow: "Level-based program", price: "RD$1,500", cadence: "per person, per month", description: "A consistent routine with learners at a similar level, guided conversation, and progress by unit.", badge: "15% off your first month", icon: GraduationCap, featured: true, features: ["Monday and Wednesday or Tuesday and Thursday", "Two hours per lesson", "Groups organized by level", "Guided interaction and practice"], cta: "Ask About Group Lessons" },
      { name: "Personalized tutoring", eyebrow: "Focused support", price: "RD$1,000", cadence: "per tutoring session", description: "Targeted help for one Spanish challenge, assignment, presentation, or real-life situation.", badge: "Flexible format", icon: MessageCircle, features: ["Daily or weekly sessions", "Focus on one specific need", "Guided explanation and practice", "Schedule subject to availability"], cta: "Ask About Tutoring" },
    ],
    policyKicker: "Before you enroll", policyTitle: "Important details",
    policies: [
      { title: "Free consultation", copy: "It can last up to one hour and helps identify your level and goals. It is not a trial lesson.", icon: CalendarCheck },
      { title: "Payments", copy: "Bank transfers and online debit or credit card payments are accepted.", icon: CreditCard },
      { title: "Materials", copy: "Paid books or core materials are quoted separately before enrollment is confirmed.", icon: ShieldCheck },
      { title: "Responsible progress", copy: "Results depend on attendance, practice, and each student's consistency.", icon: Clock3 },
      { title: "Performance recognition", copy: "The highest-performing student at each level receives the next level's materials at no cost.", icon: Award },
      { title: "Online lessons", copy: "Sessions use Google Meet, with support through Google Classroom and communication on WhatsApp.", icon: Laptop },
    ],
    finalKicker: "Which option fits you?", finalTitle: "Talk first. Decide with confidence.", finalBody: "Alberto Academy will contact you within 24 to 48 business hours to coordinate your free consultation.", finalCta: "Request a Consultation",
  },
};

export default async function PricingPage() {
  const locale = await getRequestLocale();
  const copy = pricingCopy[locale];

  return (
    <main className="min-h-screen overflow-x-hidden bg-surface-cream text-brand-navy">
      <SiteHeader locale={locale} />
      <section id="pricing-hero" className="relative isolate overflow-hidden bg-brand-navy px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20"><div className="orbital-grid absolute inset-0 opacity-10" /><div className="program-ring absolute -right-48 top-10 hidden size-[520px] rounded-full opacity-70 blur-2xl md:block" /><div className="mx-auto max-w-4xl text-center"><MotionReveal><p className="section-kicker-dark">{copy.heroKicker}</p><h1 className="section-heading mx-auto mt-4 max-w-4xl text-white">{copy.heroTitle}</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">{copy.heroBody}</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href={localePath(locale, "/contact")} className="button-primary">{copy.heroCta} <CalendarCheck size={18} aria-hidden /></Link><a href="#planes" className="button-secondary">{copy.heroAnchor} <ArrowRight size={18} aria-hidden /></a></div></MotionReveal></div></section>

      <section id="planes" className="section-pad bg-surface-cream"><div className="section-container"><MotionReveal className="mx-auto max-w-3xl text-center"><p className="section-kicker">{copy.plansKicker}</p><h2 className="section-heading mt-3">{copy.plansTitle}</h2><p className="body-copy-lg mt-5">{copy.plansBody}</p></MotionReveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{copy.plans.map((plan, index) => { const Icon = plan.icon; return <MotionArticle key={plan.name} delay={index * 0.08} className={`hover-lift flex min-h-full flex-col rounded-xl border p-5 shadow-xl sm:p-6 ${plan.featured ? "border-brand-navy bg-brand-navy text-white shadow-brand-navy/16" : "border-brand-navy/10 bg-surface-white text-brand-navy shadow-brand-navy/7"} ${index === 2 ? "md:col-span-2 xl:col-span-1" : ""}`}><div className="flex items-start justify-between gap-3"><div className={`grid size-11 place-items-center rounded-lg ${plan.featured ? "bg-brand-teal" : "bg-brand-blue"} text-white`}><Icon size={21} strokeWidth={1.8} aria-hidden /></div><span className={`max-w-[10rem] rounded-md px-2.5 py-2 text-center text-[0.68rem] font-extrabold uppercase leading-tight tracking-[0.08em] sm:px-3 sm:text-xs ${plan.featured ? "bg-brand-red text-white" : "bg-surface-cream text-brand-blue"}`}>{plan.badge}</span></div><p className={`mt-6 text-xs font-extrabold uppercase tracking-[0.08em] ${plan.featured ? "text-brand-teal-light" : "text-brand-red"}`}>{plan.eyebrow}</p><h3 className="mt-2 font-heading text-3xl font-normal">{plan.name}</h3><p className={`mt-4 text-sm leading-6 ${plan.featured ? "text-white/68" : "text-brand-navy/64"}`}>{plan.description}</p><div className={`mt-6 border-t pt-5 ${plan.featured ? "border-white/14" : "border-brand-navy/10"}`}><p className="font-heading text-4xl font-normal leading-none sm:text-5xl">{plan.price}</p><p className={`mt-2 text-sm font-bold ${plan.featured ? "text-white/54" : "text-brand-navy/52"}`}>{plan.cadence}</p></div><div className="mt-6 grid gap-3">{plan.features.map((feature) => <p key={feature} className={`flex items-start gap-2 text-sm font-semibold leading-6 ${plan.featured ? "text-white/76" : "text-brand-navy/70"}`}><CheckCircle2 size={16} className={`mt-1 shrink-0 ${plan.featured ? "text-brand-teal-light" : "text-brand-teal"}`} aria-hidden />{feature}</p>)}</div><Link href={localePath(locale, "/contact")} className={`mt-7 ${plan.featured ? "button-primary" : "button-navy"}`}>{plan.cta}<ArrowRight size={18} aria-hidden /></Link></MotionArticle>; })}</div>
      </div></section>

      <section className="bg-brand-navy px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8"><div className="mx-auto max-w-6xl"><MotionReveal className="mx-auto max-w-3xl text-center"><p className="section-kicker-dark">{copy.policyKicker}</p><h2 className="section-heading mt-3 text-white">{copy.policyTitle}</h2></MotionReveal><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{copy.policies.map((item, index) => { const Icon = item.icon; return <MotionArticle key={item.title} delay={index * 0.07} className="rounded-xl border border-white/12 bg-white/[0.06] p-5 sm:p-6"><Icon size={24} className="text-brand-teal-light" aria-hidden /><h3 className="mt-4 font-heading text-2xl font-normal">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/68">{item.copy}</p></MotionArticle>; })}</div></div></section>

      <section className="bg-surface-cream px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><MotionReveal className="mx-auto max-w-6xl rounded-xl bg-brand-navy p-6 text-white shadow-2xl shadow-brand-navy/16 sm:p-8 lg:p-10"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="section-kicker-dark">{copy.finalKicker}</p><h2 className="mt-3 font-heading text-3xl font-normal leading-tight sm:text-4xl">{copy.finalTitle}</h2><p className="mt-5 max-w-2xl leading-7 text-white/68">{copy.finalBody}</p></div><Link href={localePath(locale, "/contact")} className="button-primary">{copy.finalCta} <CalendarCheck size={18} aria-hidden /></Link></div></MotionReveal></section>
      <SiteFooter locale={locale} />
    </main>
  );
}
