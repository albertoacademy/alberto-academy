import Link from "next/link";
import { CalendarCheck, Clock3, Mail, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { localePath, type Locale } from "@/lib/i18n";

const spanishNavItems = [
  { label: "Inicio", href: "/" },
  { label: "Alberto", href: "/about" },
  { label: "Programas", href: "/programs#programs-hero" },
  { label: "Testimonios", href: "/testimonials" },
  { label: "Precios", href: "/pricing" },
  { label: "Acceso", href: "/login" },
];

const englishNavItems = [
  { label: "Home", href: "/" },
  { label: "Alberto", href: "/about" },
  { label: "Programs", href: "/programs#programs-hero" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Pricing", href: "/pricing" },
  { label: "Admin Login", href: "/login" },
];

export const navItems = spanishNavItems;

const whatsappHref = "https://wa.me/18293528234";
const emailHref = "mailto:albertoalex0033@gmail.com";
const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/share/1D2XrbVmDM/", Icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/alberto_academy?igsi=cHZvZHB0M3c1Y3V2", Icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com/@lbertoacademy?si=lC1L9i9rAFJ8aVd9", Icon: YouTubeIcon },
];

export function SiteHeader({ locale = "es" }: { locale?: Locale }) {
  const isEnglish = locale === "en";
  const items = (isEnglish ? englishNavItems : spanishNavItems).map((item) => ({
    ...item,
    href: localePath(locale, item.href),
  }));

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-brand-navy/10 bg-surface-white/90 backdrop-blur-xl">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:px-8">
          <Link href={localePath(locale)} className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden" aria-label={isEnglish ? "Alberto Academy home" : "Inicio de Alberto Academy"}>
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-brand-red font-heading text-lg font-semibold text-white">A</span>
            <span className="truncate font-heading text-base font-semibold text-brand-navy sm:text-xl">Alberto Academy</span>
          </Link>

          <nav className="hidden items-center justify-center gap-6 text-sm font-semibold text-brand-navy/70 lg:flex" aria-label={isEnglish ? "Primary navigation" : "Navegación principal"}>
            {items.map((item) => <Link key={item.label} href={item.href} className="transition hover:text-brand-navy">{item.label}</Link>)}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle locale={locale} />
            <ThemeToggle scope="public" compact locale={locale} />
            <Link href={localePath(locale, "/contact")} className="hidden h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-brand-red px-3 text-sm font-bold text-white shadow-sm shadow-brand-red/20 transition hover:bg-brand-red-dark sm:inline-flex sm:px-4">
              <CalendarCheck size={16} aria-hidden />
              <span className="hidden sm:inline">{isEnglish ? "Free Consultation" : "Conversación inicial"}</span>
            </Link>

            <details className="mobile-nav block lg:hidden">
              <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-md border border-brand-navy/12 text-brand-navy transition hover:border-brand-teal hover:text-brand-blue" aria-label={isEnglish ? "Open or close navigation" : "Abrir o cerrar navegación"}>
                <Menu className="mobile-nav-open" size={20} aria-hidden />
                <X className="mobile-nav-close hidden" size={20} aria-hidden />
              </summary>
              <div className="absolute left-4 right-4 top-[4.5rem] max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-xl border border-brand-navy/10 bg-surface-white p-3 shadow-2xl shadow-brand-navy/18">
                <nav className="grid gap-1 text-sm font-extrabold text-brand-navy" aria-label={isEnglish ? "Mobile navigation" : "Navegación móvil"}>
                  {items.map((item) => <Link key={item.label} href={item.href} className="rounded-lg px-4 py-3 transition hover:bg-surface-cream hover:text-brand-blue">{item.label}</Link>)}
                  <Link href={localePath(locale, "/contact")} className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-red px-4 py-3 text-sm font-extrabold text-white transition hover:bg-brand-red-dark">
                    <CalendarCheck size={16} aria-hidden />
                    {isEnglish ? "Book a Free Consultation" : "Agendar conversación inicial"}
                  </Link>
                </nav>
              </div>
            </details>
          </div>
        </div>
      </header>
      <div aria-hidden="true" className="h-16" />
    </>
  );
}

export function SiteFooter({ locale = "es" }: { locale?: Locale }) {
  const isEnglish = locale === "en";
  const items = (isEnglish ? englishNavItems : spanishNavItems).map((item) => ({ ...item, href: localePath(locale, item.href) }));
  const infoLinks = isEnglish
    ? [{ label: "Frequently Asked Questions", href: localePath(locale, "/faq") }, { label: "Contact", href: localePath(locale, "/contact") }]
    : [{ label: "Preguntas frecuentes", href: localePath(locale, "/faq") }, { label: "Contacto", href: localePath(locale, "/contact") }];
  const legalLinks = isEnglish
    ? [{ label: "Privacy Policy", href: localePath(locale, "/privacy") }, { label: "Terms of Service", href: localePath(locale, "/terms") }]
    : [{ label: "Privacidad", href: localePath(locale, "/privacy") }, { label: "Términos del servicio", href: localePath(locale, "/terms") }];

  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-9 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 xl:grid-cols-[0.82fr_1.48fr] xl:gap-12">
        <div className="bg-brand-blue p-6 sm:p-8 lg:p-10">
          <Link href={localePath(locale)} className="inline-flex items-center gap-3" aria-label={isEnglish ? "Alberto Academy home" : "Inicio de Alberto Academy"}>
            <span className="grid size-11 place-items-center rounded-md bg-brand-red font-heading text-xl font-semibold text-white">A</span>
            <span className="font-heading text-2xl font-semibold">Alberto Academy</span>
          </Link>

          <p className="mt-7 max-w-sm text-base leading-7 text-white/76">
            {isEnglish ? "Practical Spanish for real conversations, taught online with structure and personal guidance. English instruction is also available." : "Academia de idiomas online para aprender de forma progresiva, comprender el contexto y comunicarse con mayor seguridad."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex size-12 items-center justify-center rounded-full bg-white/8 text-white ring-1 ring-white/10 transition hover:bg-brand-teal hover:ring-brand-teal" aria-label={isEnglish ? "Message Alberto Academy on WhatsApp" : "Escribir a Alberto Academy por WhatsApp"}>
              <MessageCircle size={21} aria-hidden />
            </a>
            {socialLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex size-12 items-center justify-center rounded-full bg-white/8 text-white ring-1 ring-white/10 transition hover:bg-brand-teal hover:ring-brand-teal" aria-label={`${isEnglish ? "Visit Alberto Academy on" : "Visitar Alberto Academy en"} ${label}`}>
                <Icon />
              </a>
            ))}
          </div>

          <div className="mt-9 space-y-3 text-sm font-semibold text-white/76">
            <a href={emailHref} className="flex items-center gap-3 break-all transition hover:text-white"><Mail size={17} className="text-brand-teal-light" aria-hidden />albertoalex0033@gmail.com</a>
            <p className="flex items-center gap-3"><MapPin size={17} className="text-brand-teal-light" aria-hidden />{isEnglish ? "Online lessons from the Dominican Republic" : "Clases online desde República Dominicana"}</p>
          </div>

          <Link href={localePath(locale, "/contact")} className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand-red px-6 text-sm font-extrabold text-white shadow-lg shadow-brand-navy/18 transition hover:bg-brand-red-dark">
            {isEnglish ? "Book a Free Consultation" : "Agendar conversación inicial"}<CalendarCheck size={17} aria-hidden />
          </Link>
        </div>

        <div className="py-2 lg:py-10">
          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.15fr]">
            <FooterColumn title={isEnglish ? "Menu" : "Menú"} links={items} />
            <FooterColumn title={isEnglish ? "Information" : "Información"} links={infoLinks} />
            <FooterColumn title="Legal" links={legalLinks} />
            <div>
              <h3 className="font-heading text-xl font-semibold text-white">{isEnglish ? "Contact" : "Contacto"}</h3>
              <div className="mt-5 h-px w-full bg-gradient-to-r from-brand-teal-light via-brand-teal/30 to-transparent" aria-hidden />
              <div className="mt-6 grid gap-4 text-sm font-semibold text-white/68">
                <a href="tel:+18293528234" className="flex items-center gap-3 transition hover:text-white"><Phone size={17} className="text-brand-teal-light" aria-hidden />+1 (829) 352-8234</a>
                <a href={emailHref} className="flex items-center gap-3 break-all transition hover:text-white"><Mail size={17} className="text-brand-teal-light" aria-hidden />albertoalex0033@gmail.com</a>
                <p className="flex items-start gap-3"><Clock3 size={17} className="mt-0.5 shrink-0 text-brand-teal-light" aria-hidden />{isEnglish ? "Afternoons and evenings, Dominican Republic time" : "Tardes y noches, hora de República Dominicana"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs font-semibold uppercase tracking-[0.08em] text-white/48 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© 2026 Alberto Academy. {isEnglish ? "All rights reserved." : "Todos los derechos reservados."}</p>
          <p>{isEnglish ? "Languages for confident communication." : "Idiomas para comunicarse con seguridad."}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-heading text-xl font-semibold text-white">{title}</h3>
      <div className="mt-5 h-px w-full bg-gradient-to-r from-brand-teal-light via-brand-teal/30 to-transparent" aria-hidden />
      <div className="mt-6 grid gap-4 text-sm font-semibold text-white/68">
        {links.map((link) => <Link key={link.label} href={link.href} className="transition hover:text-white">{link.label}</Link>)}
      </div>
    </div>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M13.5 22v-9h3l.45-3.5H13.5V7.27c0-1.01.28-1.7 1.73-1.7H17V2.44c-.31-.04-1.38-.13-2.62-.13-2.59 0-4.36 1.58-4.36 4.49v2.7H7v3.5h3.02v9h3.48Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.19a3.01 3.01 0 0 0-2.12-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.01 3.01 0 0 0 .5 6.19 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.81 3.01 3.01 0 0 0 2.12 2.13c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.01 3.01 0 0 0 2.12-2.13A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.81ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z" />
    </svg>
  );
}
