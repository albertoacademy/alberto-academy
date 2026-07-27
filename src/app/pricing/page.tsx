import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, CalendarCheck, CheckCircle2, Clock3, CreditCard, GraduationCap, Laptop, MessageCircle, ShieldCheck, Target } from "lucide-react";
import { MotionArticle, MotionReveal } from "@/components/motion-reveal";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Precios | Alberto Academy",
  description: "Conozca los precios reales de las clases privadas, grupales y tutorías de Alberto Academy, además del descuento del primer mes.",
};

const pricingPlans = [
  {
    name: "Clases privadas",
    eyebrow: "Atención individual",
    price: "RD$900",
    cadence: "por hora",
    description: "Un plan uno a uno para trabajar su nivel, sus objetivos y las situaciones en las que realmente necesita comunicarse.",
    badge: "15 % de descuento el primer mes",
    icon: Target,
    features: ["Mínimo de 10 horas al mes", "Clases de 1 a 2 horas", "Compromiso inicial de 3 meses", "Plan y corrección personalizados"],
    cta: "Consultar clases privadas",
  },
  {
    name: "Clases grupales",
    eyebrow: "Programa por nivel",
    price: "RD$1,500",
    cadence: "por persona al mes",
    description: "Una rutina constante para aprender con estudiantes de nivel similar, practicar en grupo y avanzar por unidades.",
    badge: "15 % de descuento el primer mes",
    icon: GraduationCap,
    featured: true,
    features: ["Lunes y miércoles o martes y jueves", "Dos horas por clase", "Grupo organizado por nivel", "Interacción y práctica guiada"],
    cta: "Consultar clases grupales",
  },
  {
    name: "Tutoría personalizada",
    eyebrow: "Apoyo puntual",
    price: "RD$1,000",
    cadence: "por tutoría",
    description: "Apoyo específico para resolver una dificultad, preparar una asignación o practicar una situación concreta.",
    badge: "Modalidad flexible",
    icon: MessageCircle,
    features: ["Sesiones por día o por semana", "Enfoque en una necesidad concreta", "Práctica y explicación dirigidas", "Horario sujeto a disponibilidad"],
    cta: "Consultar tutorías",
  },
];

const policyCards = [
  { title: "Conversación inicial gratuita", copy: "Dura hasta una hora y permite orientar su nivel y sus objetivos. No es una clase de prueba.", icon: CalendarCheck },
  { title: "Pagos", copy: "Se aceptan transferencias y pagos con tarjeta de débito o crédito mediante servicios en línea.", icon: CreditCard },
  { title: "Materiales", copy: "Los libros o materiales base con costo se cotizan por separado antes de confirmar la inscripción.", icon: ShieldCheck },
  { title: "Progreso responsable", copy: "Los resultados dependen de la asistencia, la práctica y la responsabilidad del estudiante.", icon: Clock3 },
  { title: "Reconocimiento al desempeño", copy: "Al finalizar cada nivel, el estudiante con la mejor calificación recibe gratis los materiales del nivel siguiente.", icon: Award },
  { title: "Clases online", copy: "Las sesiones se imparten por Google Meet, con seguimiento en Google Classroom y comunicación por WhatsApp.", icon: Laptop },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-surface-cream text-brand-navy">
      <SiteHeader />
      <section id="pricing-hero" className="relative isolate overflow-hidden bg-brand-navy px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="orbital-grid absolute inset-0 opacity-10" />
        <div className="program-ring absolute -right-48 top-10 hidden size-[520px] rounded-full opacity-70 blur-2xl md:block" />
        <div className="mx-auto max-w-4xl text-center">
          <MotionReveal>
            <p className="section-kicker-dark">Precios claros</p>
            <h1 className="section-heading mx-auto mt-4 max-w-4xl text-white">Elija el formato que se ajuste a su ritmo, su objetivo y su presupuesto.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
              Los estudiantes nuevos reciben un 15 % de descuento durante el primer mes, tanto en clases privadas como grupales.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="button-primary">Agendar conversación inicial <CalendarCheck size={18} aria-hidden /></Link>
              <a href="#planes" className="button-secondary">Ver precios <ArrowRight size={18} aria-hidden /></a>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section id="planes" className="section-pad bg-surface-cream">
        <div className="section-container">
          <MotionReveal className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">Opciones de estudio</p>
            <h2 className="section-heading mt-3">Tres formas de avanzar a su manera.</h2>
            <p className="body-copy-lg mt-5">Antes de pagar, Alberto le ayudará a identificar la modalidad y el nivel adecuados para su situación.</p>
          </MotionReveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <MotionArticle key={plan.name} delay={index * 0.08} className={`hover-lift flex min-h-full flex-col rounded-xl border p-5 shadow-xl sm:p-6 ${plan.featured ? "border-brand-navy bg-brand-navy text-white shadow-brand-navy/16" : "border-brand-navy/10 bg-surface-white text-brand-navy shadow-brand-navy/7"} ${index === 2 ? "md:col-span-2 xl:col-span-1" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className={`grid size-11 place-items-center rounded-lg ${plan.featured ? "bg-brand-teal" : "bg-brand-blue"} text-white`}><Icon size={21} strokeWidth={1.8} aria-hidden /></div>
                    <span className={`max-w-[10rem] rounded-md px-2.5 py-2 text-center text-[0.68rem] font-extrabold uppercase leading-tight tracking-[0.08em] sm:px-3 sm:text-xs ${plan.featured ? "bg-brand-red text-white" : "bg-surface-cream text-brand-blue"}`}>{plan.badge}</span>
                  </div>
                  <p className={`mt-6 text-xs font-extrabold uppercase tracking-[0.08em] ${plan.featured ? "text-brand-teal-light" : "text-brand-red"}`}>{plan.eyebrow}</p>
                  <h3 className="mt-2 font-heading text-3xl font-normal">{plan.name}</h3>
                  <p className={`mt-4 text-sm leading-6 ${plan.featured ? "text-white/68" : "text-brand-navy/64"}`}>{plan.description}</p>
                  <div className={`mt-6 border-t pt-5 ${plan.featured ? "border-white/14" : "border-brand-navy/10"}`}>
                    <p className="font-heading text-4xl font-normal leading-none sm:text-5xl">{plan.price}</p>
                    <p className={`mt-2 text-sm font-bold ${plan.featured ? "text-white/54" : "text-brand-navy/52"}`}>{plan.cadence}</p>
                  </div>
                  <div className="mt-6 grid gap-3">
                    {plan.features.map((feature) => (
                      <p key={feature} className={`flex items-start gap-2 text-sm font-semibold leading-6 ${plan.featured ? "text-white/76" : "text-brand-navy/70"}`}><CheckCircle2 size={16} className={`mt-1 shrink-0 ${plan.featured ? "text-brand-teal-light" : "text-brand-teal"}`} aria-hidden />{feature}</p>
                    ))}
                  </div>
                  <Link
                    href="/contact"
                    className={`mt-7 ${plan.featured ? "button-primary" : "button-navy"}`}
                  >
                    {plan.cta}<ArrowRight size={18} aria-hidden />
                  </Link>
                </MotionArticle>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <MotionReveal className="mx-auto max-w-3xl text-center">
            <p className="section-kicker-dark">Antes de inscribirse</p>
            <h2 className="section-heading mt-3 text-white">Preguntas frecuentes</h2>
          </MotionReveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {policyCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <MotionArticle key={item.title} delay={index * 0.07} className="rounded-xl border border-white/12 bg-white/[0.06] p-5 sm:p-6">
                  <Icon size={24} className="text-brand-teal-light" aria-hidden />
                  <h3 className="mt-4 font-heading text-2xl font-normal">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/68">{item.copy}</p>
                </MotionArticle>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface-cream px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <MotionReveal className="mx-auto max-w-6xl rounded-xl bg-brand-navy p-6 text-white shadow-2xl shadow-brand-navy/16 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="section-kicker-dark">¿Cuál opción le conviene?</p>
              <h2 className="mt-3 font-heading text-3xl font-normal leading-tight sm:text-4xl">Converse primero. Decida después.</h2>
              <p className="mt-5 max-w-2xl leading-7 text-white/68">En un plazo de 24 a 48 horas laborables, Alberto Academy se comunicará con usted para coordinar la conversación inicial gratuita.</p>
            </div>
            <Link href="/contact" className="button-primary">Solicitar conversación <CalendarCheck size={18} aria-hidden /></Link>
          </div>
        </MotionReveal>
      </section>
      <SiteFooter />
    </main>
  );
}
