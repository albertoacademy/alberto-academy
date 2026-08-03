import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { CalendarCheck, CheckCircle2, Clock3, Mail, MessageCircle, MessageSquareText, MonitorPlay } from "lucide-react";
import { getRequestLocale } from "@/lib/i18n-server";
import { createLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createLocalizedMetadata({
    locale,
    path: "/contact",
    ...(locale === "en"
      ? { title: "Contact | Alberto Academy", description: "Request a free consultation to discuss your Spanish goals, starting level, and the right learning path." }
      : { title: "Contacto | Alberto Academy", description: "Solicite una conversación inicial gratuita para revisar sus objetivos, descubrir su nivel y encontrar el programa adecuado." }),
  });
}

const content = {
  es: {
    kicker: "Primer paso sin costo",
    title: "Antes de elegir un curso, conversemos.",
    description: "Esta conversación inicial puede durar hasta una hora. Es un espacio para conocer sus objetivos, descubrir su nivel y recomendarle el camino adecuado.",
    expectationKicker: "Qué puede esperar",
    expectationTitle: "Una recomendación clara, sin presión.",
    steps: [
      { title: "Conocer sus objetivos", copy: "Alberto escuchará qué desea lograr con el idioma y en qué situaciones necesita utilizarlo.", icon: MessageSquareText },
      { title: "Orientar su nivel", copy: "Conversarán sobre sus conocimientos actuales y, si hace falta, se recomendará una evaluación opcional.", icon: CheckCircle2 },
      { title: "Recomendar el siguiente paso", copy: "Recibirá una orientación clara sobre el programa, horario y ritmo que mejor se ajusten a usted.", icon: MonitorPlay },
    ],
    step: "Paso",
    response: "Respuesta en 24 a 48 horas laborables",
    hours: "Atención en horario de República Dominicana",
    contactLabels: ["Correo", "WhatsApp", "Horario", "Modalidad"],
    contactValues: ["albertoalex0033@gmail.com", "+1 (829) 352-8234", "Tardes y noches", "Online, para estudiantes internacionales"],
  },
  en: {
    kicker: "Your first step is free",
    title: "Tell us where Spanish needs to take you.",
    description: "Your free consultation can last up to one hour. Alberto will learn what you need Spanish for, identify your starting point, and recommend a practical path.",
    expectationKicker: "What to expect",
    expectationTitle: "A clear recommendation, without pressure.",
    steps: [
      { title: "Share your goal", copy: "Tell Alberto whether Spanish matters most for travel, work, relocation, relationships, study, or everyday conversation.", icon: MessageSquareText },
      { title: "Find your starting point", copy: "You will discuss what you already understand and whether an optional level assessment would be useful.", icon: CheckCircle2 },
      { title: "Leave with a direction", copy: "Alberto will recommend the program, schedule, and pace that best fit your goal and availability.", icon: MonitorPlay },
    ],
    step: "Step",
    response: "Response within 24 to 48 business hours",
    hours: "Support follows Dominican Republic time",
    contactLabels: ["Email", "WhatsApp", "Hours", "Format"],
    contactValues: ["albertoalex0033@gmail.com", "+1 (829) 352-8234", "Afternoons and evenings", "Online, for international students"],
  },
};

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const copy = content[locale];

  return (
    <main className="min-h-screen bg-surface-cream text-brand-navy">
      <SiteHeader locale={locale} />
      <section className="relative isolate overflow-hidden bg-brand-navy text-white">
        <div className="orbital-grid absolute inset-0 opacity-10" /><div className="program-ring absolute -right-48 top-8 hidden size-[520px] rounded-full opacity-55 blur-2xl md:block" /><div className="hero-navy-wash absolute inset-0" />
        <div className="section-container relative z-10 px-4 py-12 text-center sm:px-8 sm:py-14 lg:px-10 lg:py-20"><div className="mx-auto max-w-4xl"><p className="section-kicker-dark">{copy.kicker}</p><h1 className="hero-heading mt-4 text-white">{copy.title}</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">{copy.description}</p></div></div>
      </section>

      <section id="booking" className="bg-surface-cream px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-xl shadow-2xl shadow-brand-navy/12 lg:grid-cols-2">
          <div className="relative isolate overflow-hidden bg-brand-blue px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-20 lg:py-16">
            <Image src="/images/contact-expectations-bg.webp" alt="" fill quality={72} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-center opacity-[0.18]" /><div className="contact-image-wash absolute inset-0" />
            <div className="relative z-10 flex max-w-xl flex-col justify-between lg:min-h-[560px]">
              <div><p className="section-kicker-dark">{copy.expectationKicker}</p><h2 className="mt-4 font-heading text-3xl font-normal leading-tight text-white sm:text-4xl lg:text-5xl">{copy.expectationTitle}</h2>
                <div className="mt-8 grid gap-4 sm:mt-10">{copy.steps.map((item, index) => { const Icon = item.icon; return <article key={item.title} className="grid grid-cols-[auto_1fr] gap-4 border-t border-white/14 pt-4"><div className="grid size-10 place-items-center rounded-lg bg-brand-teal text-white"><Icon size={20} strokeWidth={1.8} aria-hidden /></div><div><p className="text-xs font-extrabold uppercase tracking-[0.08em] text-brand-teal-light">{copy.step} {String(index + 1).padStart(2, "0")}</p><h3 className="mt-1 font-heading text-2xl font-normal">{item.title}</h3><p className="mt-2 text-sm leading-6 text-white/64">{item.copy}</p></div></article>; })}</div>
              </div>
              <div className="mt-10 space-y-3 text-xs font-bold uppercase tracking-[0.08em] text-white/58 sm:mt-12 sm:space-y-4 sm:text-sm"><p>{copy.response}</p><p>{copy.hours}</p></div>
            </div>
          </div>
          <ContactForm locale={locale} />
        </div>
      </section>

      <section className="bg-brand-navy px-4 py-12 text-white sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <ContactItem icon={Mail} title={copy.contactLabels[0]} copy={copy.contactValues[0]} href="mailto:albertoalex0033@gmail.com" />
          <ContactItem icon={MessageCircle} title={copy.contactLabels[1]} copy={copy.contactValues[1]} href="https://wa.me/18293528234" />
          <ContactItem icon={Clock3} title={copy.contactLabels[2]} copy={copy.contactValues[2]} />
          <ContactItem icon={CalendarCheck} title={copy.contactLabels[3]} copy={copy.contactValues[3]} />
        </div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}

function ContactItem({ icon: Icon, title, copy, href }: { icon: typeof Mail; title: string; copy: string; href?: string }) {
  const itemContent = <><h3 className="font-heading text-2xl font-normal">{title}</h3><p className="mt-2 break-words text-sm text-white/62">{copy}</p></>;
  return <div className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 lg:border-0 lg:bg-transparent lg:p-0"><Icon className="mt-1 shrink-0 text-brand-teal-light" size={22} aria-hidden />{href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{itemContent}</a> : <div>{itemContent}</div>}</div>;
}
