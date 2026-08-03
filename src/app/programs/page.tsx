import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarCheck, CheckCircle2, Languages, MessageCircle, Users } from "lucide-react";
import { MotionImagePanel, MotionReveal } from "@/components/motion-reveal";
import { ComplementaryProgramsScroller } from "@/components/complementary-programs-scroller";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { programTracks, programTracksEn } from "@/lib/programs";
import { localePath, type Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";
import { createLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createLocalizedMetadata({
    locale,
    path: "/programs",
    ...(locale === "en"
      ? { title: "Spanish Programs | Alberto Academy", description: "Explore private and group Spanish lessons, level-based programs, tutoring, real-world coaching, and available English instruction." }
      : { title: "Programas de idiomas | Alberto Academy", description: "Programas por niveles, clases individuales y grupales, tutorías, coaching especializado y español para extranjeros." }),
  });
}

const serviceIcons = { "clases-individuales": MessageCircle, "clases-grupales": Users, "espanol-para-extranjeros": Languages };
const primaryServiceIds = ["clases-individuales", "clases-grupales", "espanol-para-extranjeros"];

const pageCopy = {
  es: { heroKicker: "Programas y servicios", heroTitle: "Una ruta para cada objetivo. Un método que convierte el conocimiento en comunicación.", heroBody: "Estudie por niveles, reciba atención individual, aprenda en grupo o prepárese para una meta específica. Todos los servicios son online y se ajustan a su punto de partida.", heroCta: "Solicitar conversación inicial", heroAnchor: "Ver opciones", primaryKicker: "Servicios principales", primaryTitle: "Tres formas claras de comenzar.", primaryBody: "Estas son las opciones que también encontrará en la página principal: clases privadas de inglés, clases grupales de inglés y español para extranjeros.", service: "Servicio", ideal: "Ideal para", ask: "Consultar esta opción", finalKicker: "¿No sabe por dónde comenzar?", finalTitle: "La conversación inicial existe para ayudarle a elegir con criterio.", finalBody: "Alberto revisará sus objetivos, su nivel actual y su disponibilidad. Después le recomendará la opción que tenga sentido para usted.", finalCta: "Agendar conversación", faq: "Preguntas frecuentes" },
  en: { heroKicker: "Spanish programs and services", heroTitle: "A practical path for every reason you want to speak Spanish.", heroBody: "Learn privately, practice with a group, follow a complete level-based program, or prepare for a specific real-world goal. Every option is online and shaped around your starting point.", heroCta: "Request a Free Consultation", heroAnchor: "View Options", primaryKicker: "Featured services", primaryTitle: "Three clear ways to begin.", primaryBody: "Start with private Spanish lessons, learn with a level-based group, or ask about English instruction when that is the language you need.", service: "Service", ideal: "Best for", ask: "Ask About This Option", finalKicker: "Not sure where to begin?", finalTitle: "Start with a conversation, not a guess.", finalBody: "Alberto will review your goal, current Spanish level, and availability, then recommend the option that makes sense for you.", finalCta: "Book a Consultation", faq: "Frequently Asked Questions" },
};

export default async function ProgramsPage() {
  const locale = await getRequestLocale();
  const copy = pageCopy[locale];
  const tracks = locale === "en" ? programTracksEn : programTracks;
  const primaryServices = tracks.filter((program) => primaryServiceIds.includes(program.id));

  return (
    <main className="min-h-screen overflow-x-hidden bg-surface-cream text-brand-navy">
      <SiteHeader locale={locale} />
      <section id="programs-hero" className="relative isolate overflow-hidden bg-brand-navy px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20"><div className="orbital-grid absolute inset-0 opacity-10" /><div className="program-ring absolute -right-52 top-12 hidden size-[560px] rounded-full opacity-70 blur-2xl md:block" /><div className="mx-auto max-w-6xl"><MotionReveal><p className="section-kicker-dark">{copy.heroKicker}</p><h1 className="section-heading mt-4 max-w-4xl text-white">{copy.heroTitle}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">{copy.heroBody}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href={localePath(locale, "/contact")} className="button-primary">{copy.heroCta} <CalendarCheck size={18} aria-hidden /></Link><a href="#servicios-principales" className="button-secondary">{copy.heroAnchor} <ArrowRight size={18} aria-hidden /></a></div></MotionReveal></div></section>

      <PrimaryServices locale={locale} copy={copy} primaryServices={primaryServices} />
      <ComplementaryProgramsScroller locale={locale} />

      <section className="bg-surface-cream px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"><MotionReveal className="mx-auto max-w-6xl rounded-xl bg-brand-navy p-6 text-white shadow-2xl shadow-brand-navy/16 sm:p-8 lg:p-10"><div className="grid gap-8 lg:grid-cols-[1fr_0.4fr] lg:items-end"><div><p className="section-kicker-dark">{copy.finalKicker}</p><h2 className="mt-3 font-heading text-3xl font-normal leading-tight sm:text-4xl">{copy.finalTitle}</h2><p className="mt-5 max-w-2xl leading-7 text-white/68">{copy.finalBody}</p></div><div className="grid gap-3"><Link href={localePath(locale, "/contact")} className="button-primary">{copy.finalCta} <CalendarCheck size={18} aria-hidden /></Link><Link href={localePath(locale, "/faq")} className="button-secondary">{copy.faq} <BookOpenCheck size={18} aria-hidden /></Link></div></div></MotionReveal></section>
      <SiteFooter locale={locale} />
    </main>
  );
}

type PageCopy = typeof pageCopy.es;
type Program = (typeof programTracks)[number];

function PrimaryServices({ locale, copy, primaryServices }: { locale: Locale; copy: PageCopy; primaryServices: Program[] }) {
  return (
    <section id="servicios-principales" className="scroll-mt-20 overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"><div className="mx-auto w-full min-w-0 max-w-6xl">
      <MotionReveal className="grid min-w-0 gap-5 border-b border-brand-navy/12 pb-9 lg:grid-cols-[0.82fr_1.18fr] lg:items-end"><div className="min-w-0"><p className="section-kicker">{copy.primaryKicker}</p><h2 className="section-heading mt-3">{copy.primaryTitle}</h2></div><p className="body-copy-lg max-w-2xl lg:justify-self-end">{copy.primaryBody}</p></MotionReveal>
      <div className="mt-10 grid min-w-0 gap-10 sm:gap-12 lg:gap-14">{primaryServices.map((program, index) => { const Icon = serviceIcons[program.id as keyof typeof serviceIcons] ?? BookOpenCheck; const isReversed = index % 2 === 1; return (
        <section key={program.id} id={program.id} className="grid w-full min-w-0 max-w-full scroll-mt-24 gap-6 overflow-hidden border-b border-brand-navy/12 pb-10 last:border-b-0 last:pb-0 sm:gap-8 sm:pb-12 lg:grid-cols-2 lg:items-stretch lg:gap-12">
          <MotionImagePanel className={`relative aspect-[4/3] w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-brand-navy/80 bg-transparent p-2 sm:aspect-[16/10] sm:p-3 lg:aspect-auto lg:h-full ${isReversed ? "lg:order-2" : ""}`}><div className="relative h-full w-full min-w-0 max-w-full overflow-hidden rounded-md"><Image src={program.image} alt={program.imageAlt} fill quality={82} sizes="(max-width: 639px) calc(100vw - 3rem), (min-width: 1180px) 540px, (min-width: 1024px) 48vw, 100vw" className="object-cover object-center" /><div className="absolute inset-0 bg-gradient-to-t from-brand-navy/42 via-brand-navy/0 to-transparent" /></div><div className="absolute left-4 top-4 max-w-[calc(100%_-_2rem)] rounded-md bg-brand-red px-3 py-2.5 text-white shadow-xl shadow-brand-red/20 sm:left-5 sm:top-5 sm:max-w-[calc(100%_-_2.5rem)] sm:px-4 sm:py-3"><p className="text-xs font-extrabold uppercase tracking-[0.08em] text-white/72">{copy.service} {String(index + 1).padStart(2, "0")}</p><p className="mt-1 font-heading text-lg font-normal sm:text-xl">{program.badge}</p></div><div className="absolute bottom-5 right-5 hidden rounded-md border border-white/14 bg-brand-navy/84 px-3 py-2.5 text-white backdrop-blur sm:block"><p className="text-xs font-extrabold uppercase tracking-[0.08em] text-brand-teal-light">{program.format}</p></div></MotionImagePanel>
          <MotionReveal delay={0.1} className={`flex w-full min-w-0 max-w-full flex-col justify-between px-0 py-2 sm:p-4 lg:p-5 xl:p-6 ${isReversed ? "lg:order-1" : ""}`}><div><div className="grid size-10 place-items-center rounded-lg bg-brand-blue text-white"><Icon size={20} strokeWidth={1.8} aria-hidden /></div><p className="section-kicker mt-4">{program.eyebrow}</p><h3 className="mt-3 font-heading text-3xl font-normal leading-tight text-brand-navy">{program.title}</h3><p className="mt-3 font-heading text-xl font-normal leading-snug text-brand-blue sm:text-2xl">{program.headline}</p><p className="mt-3 text-[0.95rem] leading-7 text-brand-navy/66">{program.description}</p></div><div><div className="mt-4 grid gap-2 sm:grid-cols-2">{program.outcomes.map((outcome) => <div key={outcome} className="flex items-center gap-2 rounded-lg border border-brand-navy/8 bg-surface-cream px-3 py-2"><CheckCircle2 size={16} className="shrink-0 text-brand-teal" aria-hidden /><span className="text-xs font-bold text-brand-navy/78 sm:text-sm">{outcome}</span></div>)}</div><div className="mt-4 border-t border-brand-navy/10 pt-4"><p className="text-sm font-extrabold uppercase tracking-[0.08em] text-brand-navy/48">{copy.ideal}</p><p className="mt-2 text-sm leading-6 text-brand-navy/66">{program.bestFor}</p></div><Link href={localePath(locale, "/contact")} className="button-primary mt-5 box-border max-w-full min-w-0 whitespace-normal px-4 text-center sm:w-fit"><span className="min-w-0">{copy.ask}</span><ArrowRight size={18} className="shrink-0" aria-hidden /></Link></div></MotionReveal>
        </section>
      ); })}</div>
    </div></section>
  );
}
