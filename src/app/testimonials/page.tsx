import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  HeartHandshake,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { CountUpStat } from "@/components/count-up-stat";
import { MotionArticle, MotionImagePanel, MotionReveal } from "@/components/motion-reveal";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Testimonials | Alberto Academy",
  description:
    "Read student success stories from Alberto Academy, including confidence gains, academic progress, and career-ready English outcomes.",
};

const pageStats = [
  { value: "200+", label: "Students taught" },
  { value: "4+", label: "Years teaching" },
  { value: "4", label: "Course levels" },
  { value: "3", label: "Focused tracks" },
];

const testimonials = [
  { name: "Camila M.", role: "Operations coordinator", quote: "The lessons helped me stop guessing. I finally understand how to organize my ideas before I speak.", result: "More confident meetings", track: "Career English" },
  { name: "Luis A.", role: "University student", quote: "Alberto corrected me without making me feel nervous. That changed how I participate in class.", result: "Stronger class participation", track: "Live Speaking" },
  { name: "Paola R.", role: "Customer success specialist", quote: "The materials felt personal. I practiced exactly the English I needed for interviews and work calls.", result: "Interview readiness", track: "Professional Fluency" },
  { name: "Daniel P.", role: "University applicant", quote: "The lessons were practical and focused. My writing improved, but my speaking improved even faster.", result: "IELTS speaking band +1.5", track: "Academic English" },
  { name: "Mariana R.", role: "Marketing professional", quote: "I stopped translating in my head during meetings. Alberto helped me speak with structure and confidence.", result: "Promotion interview passed", track: "Career English" },
  { name: "Sofia L.", role: "High school student", quote: "I used to avoid speaking English. Now I participate more, ask questions, and enjoy class.", result: "Top grade in English", track: "Academic English" },
];

const outcomes = [
  "Clearer pronunciation and sentence structure",
  "More confidence in meetings and interviews",
  "Better writing for school, work, and exams",
  "Personalized practice between live lessons",
];

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-surface-cream text-brand-navy">
      <SiteHeader />
      <Hero />
      <StatsBand />
      <FeaturedStory />
      <StoryGrid />
      <OutcomeSection />
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}

function Hero() {
  return (
    <section id="testimonials-hero" className="relative isolate overflow-hidden bg-brand-navy px-4 pb-20 pt-14 text-white sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pb-32 lg:pt-20">
      <div className="orbital-grid absolute inset-0 opacity-10" />
      <div className="program-ring absolute -right-48 top-10 hidden size-[520px] rounded-full opacity-70 blur-2xl md:block" />
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
        <MotionReveal>
          <p className="section-kicker-dark">Student Results</p>
          <h1 className="section-heading mt-4 max-w-4xl text-white">Real progress from students who needed English to feel practical.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
            These stories highlight the kind of progress Alberto Academy is built for: clearer speaking, stronger writing, better opportunities, and more confidence when English matters.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="button-primary">Book a Free Lesson <CalendarCheck size={18} aria-hidden /></Link>
            <a href="#student-stories" className="button-secondary">Read Stories <ArrowRight size={18} aria-hidden /></a>
          </div>
        </MotionReveal>
        <MotionImagePanel delay={0.12} className="relative">
          <div className="image-sheen relative aspect-[4/3] overflow-hidden rounded-xl border border-white/14 bg-brand-blue p-2 shadow-2xl shadow-brand-navy/24 sm:p-3">
            <div className="relative h-full overflow-hidden rounded-lg">
              <Image src="/images/testimonial-graduates-alt.webp" alt="Three happy adult English students in graduation clothes" fill priority quality={82} sizes="(min-width: 1180px) 500px, (min-width: 1024px) 42vw, 100vw" className="object-cover object-center" />
              <div className="absolute inset-0 bg-brand-navy/10" />
            </div>
          </div>
        </MotionImagePanel>
      </div>
    </section>
  );
}

function StatsBand() {
  return (
    <section className="relative z-10 bg-[linear-gradient(to_bottom,var(--brand-navy)_0%,var(--brand-navy)_50%,var(--surface-cream)_50%,var(--surface-cream)_100%)] px-4 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-brand-blue shadow-2xl shadow-brand-navy/12 lg:grid-cols-4">
        {pageStats.map((item, index) => (
          <div key={item.label} className={`min-h-[7.5rem] border-r border-white/10 p-5 even:border-r-0 sm:min-h-[8.25rem] sm:p-6 lg:min-h-[9.25rem] lg:border-r lg:p-8 lg:last:border-r-0 ${index < 2 ? "border-b lg:border-b-0" : ""}`}>
            <CountUpStat value={item.value} className="block font-heading text-[2rem] font-normal leading-none text-brand-teal-light sm:text-[2.2rem] lg:text-[2.35rem]" />
            <p className="mt-3 text-[0.68rem] font-extrabold uppercase leading-tight tracking-[0.08em] text-white/62 sm:text-xs">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedStory() {
  return (
    <section className="section-pad bg-surface-cream">
      <div className="section-container">
        <MotionReveal className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div><p className="section-kicker">Featured Story</p><h2 className="section-heading mt-3">Confidence students can feel outside class.</h2></div>
          <p className="body-copy-lg max-w-2xl lg:justify-self-end">The strongest results are not only grades or certificates. They show up when a student speaks with less hesitation, writes with more control, and finally uses English in real situations.</p>
        </MotionReveal>
        <MotionArticle className="mt-10 overflow-hidden rounded-xl bg-brand-navy text-white shadow-2xl shadow-brand-navy/14">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[18rem] bg-brand-blue sm:min-h-[22rem]">
              <Image src="/images/career-english-course.webp" alt="Professional student after improving English fluency" fill quality={82} sizes="(min-width: 1180px) 540px, (min-width: 1024px) 46vw, 100vw" className="object-cover object-center" />
              <div className="absolute inset-0 bg-brand-navy/16" />
            </div>
            <div className="flex min-w-0 flex-col justify-between gap-7 p-6 sm:gap-9 sm:p-8 lg:p-10">
              <div>
                <div className="flex gap-1 text-brand-teal-light" aria-label="Five star testimonial">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={20} fill="currentColor" strokeWidth={1.8} aria-hidden />)}</div>
                <Quote className="mt-6 text-brand-teal-light sm:mt-8" size={30} aria-hidden />
                <p className="mt-5 max-w-2xl font-heading text-[1.42rem] font-normal leading-[1.16] sm:text-[2rem]">&ldquo;I stopped translating in my head during meetings. Alberto helped me speak with structure and confidence.&rdquo;</p>
              </div>
              <div className="border-t border-white/14 pt-5">
                <p className="font-heading text-2xl font-normal">Mariana R.</p><p className="mt-1 text-sm font-semibold text-white/58">Marketing professional</p>
                <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-brand-red px-3 py-2 text-sm font-extrabold text-white"><Sparkles size={15} aria-hidden />Promotion interview passed</p>
              </div>
            </div>
          </div>
        </MotionArticle>
      </div>
    </section>
  );
}

function StoryGrid() {
  return (
    <section id="student-stories" className="bg-surface-cream px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-6xl">
        <MotionReveal className="mx-auto max-w-3xl text-center"><p className="section-kicker">More Student Stories</p><h2 className="section-heading mt-3">Different goals, same focused method.</h2></MotionReveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((story, index) => {
            const initials = story.name.replaceAll(".", "").split(" ").map((part) => part[0]).join("");
            return (
              <MotionArticle key={story.name} delay={index * 0.06} className="hover-lift relative isolate flex min-h-full flex-col overflow-hidden rounded-xl border border-brand-teal/24 bg-brand-navy p-5 text-white shadow-xl shadow-brand-navy/10 sm:p-7">
                <div className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full border border-brand-teal/14" aria-hidden />
                <span className="pointer-events-none absolute right-7 top-7 font-heading text-3xl font-normal text-brand-teal-light/24" aria-hidden>{String(index + 1).padStart(2, "0")}</span>
                <span className="pointer-events-none absolute right-9 top-[5.4rem] size-2 rotate-45 border border-brand-red/70" aria-hidden />

                <p className="relative z-10 max-w-[72%] text-xs font-extrabold uppercase tracking-[0.14em] text-brand-teal-light">{story.track}</p>

                <div className="relative z-10 mt-10 grid size-12 place-items-center rounded-md border border-brand-teal/28 bg-white/[0.04] text-brand-teal-light sm:mt-12">
                  <Quote size={23} strokeWidth={1.7} aria-hidden />
                </div>

                <blockquote className="relative z-10 mt-7 flex-1">
                  <p className="font-heading text-[1.42rem] font-normal leading-[1.42] text-white sm:text-[1.55rem]">&ldquo;{story.quote}&rdquo;</p>
                </blockquote>

                <div className="relative z-10 mt-8 border-t border-brand-teal/20 pt-5">
                  <div className="flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-12 shrink-0 place-items-center rounded-md border border-brand-teal/28 bg-white/[0.04] font-heading text-sm text-brand-teal-light">{initials}</span>
                      <div className="min-w-0">
                        <p className="font-heading text-xl font-normal">{story.name}</p>
                        <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-white/48">{story.role}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1 text-brand-teal-light" aria-label="Five star testimonial">
                      {Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} size={14} fill="currentColor" strokeWidth={1.5} aria-hidden />)}
                    </div>
                  </div>
                  <p className="mt-5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-white/68"><Sparkles size={14} className="shrink-0 text-brand-red" aria-hidden />{story.result}</p>
                </div>
              </MotionArticle>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OutcomeSection() {
  return (
    <section className="bg-brand-navy px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <MotionReveal><p className="section-kicker-dark">What improves</p><h2 className="section-heading mt-3 text-white">Progress that feels visible week by week.</h2><p className="mt-5 max-w-xl leading-7 text-white/68">Alberto Academy connects every lesson to a practical result, so students know what they are improving and how to keep practicing.</p></MotionReveal>
        <div className="grid gap-4 sm:grid-cols-2">{outcomes.map((outcome, index) => <MotionArticle key={outcome} delay={index * 0.08} className="rounded-xl border border-white/12 bg-white/[0.06] p-5"><CheckCircle2 className="text-brand-teal-light" size={24} aria-hidden /><p className="mt-4 font-heading text-xl font-normal leading-tight">{outcome}</p></MotionArticle>)}</div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-surface-cream px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <MotionReveal className="mx-auto max-w-6xl overflow-hidden rounded-xl bg-brand-navy text-white shadow-2xl shadow-brand-navy/16">
        <div className="relative isolate grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="section-kicker-dark">Your turn</p><h2 className="mt-3 font-heading text-3xl font-normal leading-tight sm:text-4xl">Start with a trial lesson and leave with a clear path forward.</h2><p className="mt-5 max-w-2xl leading-7 text-white/68">Alberto will review your level, goals, and schedule, then recommend the best English track for your next step.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">{[{ label: "Level check", icon: CheckCircle2 }, { label: "Personal roadmap", icon: ShieldCheck }, { label: "Focused feedback", icon: Sparkles }].map((item) => { const Icon = item.icon; return <span key={item.label} className="inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/[0.07] px-3 py-2 text-sm font-bold text-white/78"><Icon size={16} className="text-brand-teal-light" aria-hidden />{item.label}</span>; })}</div>
          </div>
          <div className="flex flex-col justify-end gap-4 border-t border-white/10 bg-white/[0.05] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <div className="grid size-12 place-items-center rounded-lg bg-brand-teal text-white"><HeartHandshake size={24} aria-hidden /></div>
            <p className="max-w-sm text-sm leading-6 text-white/62">The first lesson helps identify what is working, what is missing, and what English path fits your goals.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><Link href="/contact" className="button-primary">Book a Free Lesson <CalendarCheck size={18} aria-hidden /></Link><Link href="/programs#programs-hero" className="button-secondary">Explore Programs <ArrowRight size={18} aria-hidden /></Link></div>
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}
