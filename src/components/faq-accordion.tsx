"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";
import type { FAQItem } from "@/lib/faqs";

type ExclusiveFAQAccordionProps = {
  items: Pick<FAQItem, "question" | "answer">[];
  defaultOpenIndex?: number;
};

type GroupedFAQAccordionProps = {
  items: FAQItem[];
  categories: readonly FAQItem["category"][];
  questionLabel?: string;
  topicLabel?: string;
};

export function ExclusiveFAQAccordion({ items, defaultOpenIndex = 0 }: ExclusiveFAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="mt-12 border-t border-brand-navy/18 sm:mt-16">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        const panelId = `home-faq-panel-${index}`;

        return (
          <MotionReveal key={faq.question} delay={index * 0.06}>
            <FAQRow
              answer={faq.answer}
              iconSize={18}
              isOpen={isOpen}
              panelId={panelId}
              question={faq.question}
              questionClassName="text-2xl sm:text-3xl"
              rowClassName="py-6 sm:py-7"
              toggle={() => setOpenIndex(isOpen ? null : index)}
            />
          </MotionReveal>
        );
      })}
    </div>
  );
}

export function GroupedFAQAccordion({ items, categories, questionLabel = "preguntas", topicLabel = "Tema" }: GroupedFAQAccordionProps) {
  const firstQuestion = items[0]?.question ?? null;
  const [openQuestion, setOpenQuestion] = useState<string | null>(firstQuestion);

  return (
    <>
      {categories.map((category, groupIndex) => {
        const faqs = items.filter((faq) => faq.category === category);

        return (
          <MotionReveal key={category} id={slugify(category)} delay={groupIndex * 0.06} className="scroll-mt-24">
            <div className="mb-5 grid gap-3 sm:mb-7 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="section-kicker">{topicLabel} {String(groupIndex + 1).padStart(2, "0")}</p>
                <h2 className="mt-2 font-heading text-[2rem] font-normal leading-tight text-brand-navy sm:text-4xl">
                  {category}
                </h2>
              </div>
              <p className="w-fit rounded-full border border-brand-navy/10 bg-surface-white px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-navy/52 shadow-sm shadow-brand-navy/5 sm:text-sm">
                {faqs.length} {questionLabel}
              </p>
            </div>

            <div className="border-t border-brand-navy/18">
              {faqs.map((faq) => {
                const isOpen = openQuestion === faq.question;
                const panelId = `faq-panel-${slugify(faq.question)}`;

                return (
                  <FAQRow
                    key={faq.question}
                    answer={faq.answer}
                    iconSize={17}
                    isOpen={isOpen}
                    panelId={panelId}
                    question={faq.question}
                    questionClassName="text-[1.35rem] sm:text-2xl"
                    rowClassName="py-5 sm:py-6 lg:py-7"
                    toggle={() => setOpenQuestion(isOpen ? null : faq.question)}
                  />
                );
              })}
            </div>
          </MotionReveal>
        );
      })}
    </>
  );
}

function FAQRow({
  answer,
  iconSize,
  isOpen,
  panelId,
  question,
  questionClassName,
  rowClassName,
  toggle,
}: {
  answer: string;
  iconSize: number;
  isOpen: boolean;
  panelId: string;
  question: string;
  questionClassName: string;
  rowClassName: string;
  toggle: () => void;
}) {
  return (
    <div className={`border-b border-brand-navy/18 ${rowClassName}`}>
      <button
        type="button"
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-start justify-between gap-3 text-left sm:gap-4"
        onClick={toggle}
      >
        <span
          className={`font-heading font-normal leading-snug transition ${
            isOpen ? "text-brand-red" : "text-brand-navy"
          } ${questionClassName}`}
        >
          {question}
        </span>
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-brand-navy/18 text-brand-navy sm:size-10">
          {isOpen ? <Minus size={iconSize} aria-hidden /> : <Plus size={iconSize} aria-hidden />}
        </span>
      </button>
      {isOpen ? (
        <div id={panelId} className="mt-3 max-w-3xl text-[0.96rem] leading-7 text-brand-navy/66 sm:mt-4 sm:text-base sm:leading-8">
          {answer}
        </div>
      ) : null}
    </div>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
