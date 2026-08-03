"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenCheck, BriefcaseBusiness, CheckCircle2, PenLine } from "lucide-react";
import { localePath, type Locale } from "@/lib/i18n";

const programCopy = {
  es: [
    { id: "programa-por-niveles", eyebrow: "Avance progresivo", title: "Programa de inglés por niveles", summary: "Construya una base sólida y avance con una ruta clara.", detail: "Conversación, comprensión auditiva, lectura y escritura en una secuencia de cuatro niveles.", highlights: ["4 niveles", "14 módulos por nivel", "Evaluación continua"], icon: BookOpenCheck },
    { id: "tutorias-personalizadas", eyebrow: "Apoyo puntual", title: "Tutorías personalizadas", summary: "Resuelva una dificultad concreta sin comenzar otro programa.", detail: "Refuerce un tema, una asignación, un texto o una presentación con orientación directa.", highlights: ["Horario flexible", "Enfoque específico", "Práctica dirigida"], icon: PenLine },
    { id: "coaching-especializado", eyebrow: "Meta específica", title: "Coaching especializado", summary: "Prepárese para ese momento importante con práctica enfocada.", detail: "Entrevistas, exámenes, negocios, viajes o pronunciación trabajados desde su contexto real.", highlights: ["Plan a medida", "Vocabulario relevante", "Feedback directo"], icon: BriefcaseBusiness },
  ],
  en: [
    { id: "programa-por-niveles", eyebrow: "Progressive learning", title: "Spanish program by level", summary: "Build a strong base and keep moving with a clear pathway.", detail: "Speaking, listening, reading, and writing developed across four structured levels.", highlights: ["4 levels", "14 modules per level", "Ongoing assessment"], icon: BookOpenCheck },
    { id: "tutorias-personalizadas", eyebrow: "Focused support", title: "Personalized Spanish tutoring", summary: "Solve one specific challenge without starting another full program.", detail: "Strengthen a topic, assignment, text, or presentation with direct professional guidance.", highlights: ["Flexible schedule", "Specific focus", "Guided practice"], icon: PenLine },
    { id: "coaching-especializado", eyebrow: "Real-world goal", title: "Specialized Spanish coaching", summary: "Prepare for an important Spanish-speaking moment with focused practice.", detail: "Travel, relocation, work, interviews, or pronunciation taught through your real context.", highlights: ["Custom plan", "Relevant vocabulary", "Direct feedback"], icon: BriefcaseBusiness },
  ],
};

export function ComplementaryProgramsScroller({ locale = "es" }: { locale?: Locale }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isEnglish = locale === "en";
  const programs = programCopy[locale];

  function goTo(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), programs.length - 1);
    const scroller = scrollerRef.current;
    const target = scroller?.children.item(nextIndex) as HTMLElement | null;
    if (!scroller || !target) return;
    scroller.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    setActiveIndex(nextIndex);
  }

  function syncActiveCard() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const cards = Array.from(scroller.children) as HTMLElement[];
    const nearestIndex = cards.reduce((nearest, card, index) => {
      const currentDistance = Math.abs(card.offsetLeft - scroller.scrollLeft);
      const nearestDistance = Math.abs(cards[nearest].offsetLeft - scroller.scrollLeft);
      return currentDistance < nearestDistance ? index : nearest;
    }, 0);
    setActiveIndex(nearestIndex);
  }

  return (
    <section id="rutas-complementarias" className="overflow-hidden bg-brand-navy px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-7 border-b border-white/14 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="section-kicker-dark">{isEnglish ? "More ways to learn" : "Rutas complementarias"}</p>
            <h2 className="section-heading mt-3 text-white">{isEnglish ? "Choose the support that fits your next goal." : "Una opción a la vez. Elija la que responda a su meta."}</h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="min-w-14 text-center text-sm font-extrabold tracking-[0.12em] text-white/58" aria-live="polite">{String(activeIndex + 1).padStart(2, "0")} / {String(programs.length).padStart(2, "0")}</p>
            <div className="flex gap-2" aria-label={isEnglish ? "Carousel controls" : "Controles del carrusel"}>
              <button type="button" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0} className="grid size-12 place-items-center rounded-full border border-white/22 text-white transition hover:border-brand-teal-light hover:bg-brand-teal disabled:cursor-not-allowed disabled:opacity-30" aria-label={isEnglish ? "View previous service" : "Ver servicio anterior"}><ArrowLeft size={20} aria-hidden /></button>
              <button type="button" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === programs.length - 1} className="grid size-12 place-items-center rounded-full bg-brand-red text-white transition hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-30" aria-label={isEnglish ? "View next service" : "Ver servicio siguiente"}><ArrowRight size={20} aria-hidden /></button>
            </div>
          </div>
        </div>

        <div ref={scrollerRef} onScroll={syncActiveCard} className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" tabIndex={0} aria-label={isEnglish ? "Additional programs" : "Servicios complementarios"}>
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <article key={program.id} id={program.id} className="min-w-full snap-start overflow-hidden rounded-xl bg-surface-white text-brand-navy shadow-2xl shadow-black/16">
                <div className="grid min-h-[25rem] md:grid-cols-[0.42fr_0.58fr]">
                  <div className="relative isolate flex min-h-[15rem] flex-col justify-between overflow-hidden bg-brand-blue p-6 text-white sm:p-8 md:min-h-full lg:p-10">
                    <div className="orbital-grid absolute inset-0 opacity-[0.08]" />
                    <div className="relative flex items-start justify-between"><span className="grid size-12 place-items-center rounded-lg bg-brand-teal text-white"><Icon size={23} strokeWidth={1.8} aria-hidden /></span><span className="font-heading text-5xl font-normal leading-none text-white/16">{String(index + 1).padStart(2, "0")}</span></div>
                    <div className="relative mt-10"><p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-teal-light">{program.eyebrow}</p><h3 className="mt-3 max-w-md font-heading text-3xl font-normal leading-tight sm:text-4xl">{program.title}</h3></div>
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                    <p className="max-w-xl font-heading text-2xl font-normal leading-snug text-brand-blue sm:text-3xl">{program.summary}</p>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-brand-navy/64 sm:text-base">{program.detail}</p>
                    <div className="mt-7 grid gap-3 border-y border-brand-navy/10 py-5 sm:grid-cols-3">{program.highlights.map((highlight) => <p key={highlight} className="flex items-center gap-2 text-sm font-bold text-brand-navy/72"><CheckCircle2 size={15} className="shrink-0 text-brand-teal" aria-hidden />{highlight}</p>)}</div>
                    <Link href={localePath(locale, "/contact")} className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-extrabold text-brand-red transition hover:text-brand-red-dark">{isEnglish ? "Ask about this option" : "Consultar esta opción"} <ArrowRight size={17} aria-hidden /></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
