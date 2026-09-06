"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  FileCheck2,
  LoaderCircle,
  LockKeyhole,
  Upload,
  X,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import {
  isSupabaseConfigured,
  submitPublicProgramPurchase,
  uploadPublicPaymentProof,
} from "@/lib/supabase-rest";

const banks = [
  { name: "Banreservas", typeEs: "Ahorro", typeEn: "Savings", account: "9602981318" },
  { name: "Popular", typeEs: "Corriente", typeEn: "Checking", account: "828972406" },
  { name: "BHD", typeEs: "Personal / Ahorro", typeEn: "Personal / savings", account: "33373450013" },
] as const;

const copy = {
  es: {
    cta: "Adquirir programa",
    eyebrow: "Inscripción y pago",
    title: "Complete su inscripción",
    intro: "Reserve su programa y envíe el comprobante para que Alberto Academy pueda confirmar su pago.",
    stepDetails: "1. Datos y banco",
    stepProof: "2. Comprobante",
    stepDone: "Solicitud completada",
    program: "Programa seleccionado",
    processTitle: "Cómo completar su compra",
    process: [
      "Complete sus datos y elija uno de los bancos disponibles.",
      "Realice una transferencia o depósito a la cuenta seleccionada.",
      "Mantenga esta ventana abierta y cargue una captura o foto del comprobante.",
      "Alberto Academy verificará el pago y activará su inscripción.",
    ],
    bankTitle: "Elija el banco para pagar",
    accountType: "Tipo de cuenta",
    accountNumber: "Número de cuenta",
    holder: "Titular",
    copied: "Copiado",
    firstName: "Nombre",
    lastName: "Apellido",
    phone: "Teléfono (WhatsApp)",
    email: "Correo electrónico",
    continue: "Continuar al pago",
    saving: "Guardando...",
    proofTitle: "Cargue su comprobante de pago",
    proofBody: "Realice el pago usando los datos indicados y, sin cerrar esta ventana, cargue una captura de la transferencia o una foto del depósito.",
    chooseFile: "Subir foto o captura",
    fileHelp: "JPG, PNG, WEBP, HEIC o PDF. Máximo 10 MB.",
    upload: "Enviar comprobante",
    uploading: "Enviando...",
    close: "Cerrar",
    closeLabel: "Cerrar compra",
    closeWarning: "Su inscripción quedó pendiente. Si cierra ahora, deberá enviar el comprobante directamente a Alberto Academy. ¿Desea cerrar?",
    error: "No pudimos procesar la solicitud. Inténtelo nuevamente.",
    fileError: "Seleccione una imagen o PDF de hasta 10 MB.",
    unavailable: "El sistema de inscripción no está disponible en este momento.",
    thankTitle: "Gracias por su compra",
    thankBody: "Recibimos su comprobante. Una persona de Alberto Academy se comunicará con usted tan pronto como el pago sea confirmado.",
    reference: "Referencia de inscripción",
    secure: "El comprobante se almacena de forma privada y solo puede revisarlo el equipo autorizado.",
  },
  en: {
    cta: "Purchase Program",
    eyebrow: "Enrollment and payment",
    title: "Complete your enrollment",
    intro: "Reserve your program and send your payment receipt so Alberto Academy can confirm your enrollment.",
    stepDetails: "1. Details and bank",
    stepProof: "2. Payment proof",
    stepDone: "Request completed",
    program: "Selected program",
    processTitle: "How to complete your purchase",
    process: [
      "Enter your details and choose one of the available banks.",
      "Make a bank transfer or direct deposit to the selected account.",
      "Keep this window open and upload a screenshot or photo of the receipt.",
      "Alberto Academy will verify the payment and activate your enrollment.",
    ],
    bankTitle: "Choose a bank for payment",
    accountType: "Account type",
    accountNumber: "Account number",
    holder: "Account holder",
    copied: "Copied",
    firstName: "First name",
    lastName: "Last name",
    phone: "Phone (WhatsApp)",
    email: "Email address",
    continue: "Continue to Payment",
    saving: "Saving...",
    proofTitle: "Upload your payment receipt",
    proofBody: "Make the payment using the details shown, then keep this window open and upload a transfer screenshot or a photo of the deposit receipt.",
    chooseFile: "Upload a photo or screenshot",
    fileHelp: "JPG, PNG, WEBP, HEIC, or PDF. Maximum 10 MB.",
    upload: "Submit Payment Proof",
    uploading: "Uploading...",
    close: "Close",
    closeLabel: "Close purchase",
    closeWarning: "Your enrollment is pending. If you close now, you will need to send the receipt directly to Alberto Academy. Do you want to close?",
    error: "We could not process your request. Please try again.",
    fileError: "Choose an image or PDF up to 10 MB.",
    unavailable: "The enrollment system is unavailable right now.",
    thankTitle: "Thank you for your purchase",
    thankBody: "We received your payment proof. Someone from Alberto Academy will contact you as soon as the payment is confirmed.",
    reference: "Enrollment reference",
    secure: "Your receipt is stored privately and can only be reviewed by authorized staff.",
  },
} as const;

type Stage = "details" | "proof" | "success";

export function ProgramPurchaseDialog({
  locale,
  program,
  price,
  featured = false,
}: {
  locale: Locale;
  program: string;
  price: string;
  featured?: boolean;
}) {
  const c = copy[locale];
  const isEnglish = locale === "en";
  const firstNameRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("details");
  const [recordId, setRecordId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bankName, setBankName] = useState<(typeof banks)[number]["name"]>(banks[0].name);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const selectedBank = banks.find((bank) => bank.name === bankName) ?? banks[0];

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => firstNameRef.current?.focus(), 80);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) overlayRef.current?.scrollTo({ top: 0 });
  }, [isOpen, stage]);

  function openDialog() {
    setStage("details");
    setRecordId(createRecordId());
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setBankName(banks[0].name);
    setFile(null);
    setError(null);
    setCopiedAccount(null);
    setIsOpen(true);
  }

  function closeDialog() {
    if (stage === "proof" && !window.confirm(c.closeWarning)) return;
    setIsOpen(false);
  }

  async function handleDetailsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError(c.unavailable);
      return;
    }

    setIsSubmitting(true);

    try {
      await submitPublicProgramPurchase({ recordId, firstName, lastName, phone, email, program, paymentBank: bankName });
      setStage("proof");
    } catch (submissionError) {
      console.error(submissionError);
      setError(c.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleProofSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!file || file.size > 10 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"].includes(file.type)) {
      setError(c.fileError);
      return;
    }

    setIsSubmitting(true);

    try {
      await uploadPublicPaymentProof({ recordId, email, file });
      setStage("success");
    } catch (uploadError) {
      console.error(uploadError);
      setError(c.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyAccountNumber() {
    await navigator.clipboard.writeText(selectedBank.account);
    setCopiedAccount(selectedBank.account);
    window.setTimeout(() => setCopiedAccount(null), 1800);
  }

  return (
    <>
      <button type="button" onClick={openDialog} className={`mt-7 ${featured ? "button-primary" : "button-navy"}`}>
        {c.cta}<ArrowRight size={18} aria-hidden />
      </button>

      {isOpen && createPortal(
        <div ref={overlayRef} className="fixed inset-0 z-[100] overflow-y-auto bg-brand-navy/80 p-0 backdrop-blur-sm sm:p-4" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby={`purchase-title-${recordId}`} className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col overflow-hidden bg-surface-white text-brand-navy shadow-2xl sm:min-h-0 sm:rounded-xl">
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-brand-navy/10 bg-brand-navy px-5 py-5 text-white sm:px-7">
              <div className="min-w-0">
                <p className="section-kicker-dark">{c.eyebrow}</p>
                <h2 id={`purchase-title-${recordId}`} className="mt-1 font-heading text-2xl font-normal leading-tight sm:text-3xl">{c.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/68">{c.intro}</p>
              </div>
              <button type="button" onClick={closeDialog} className="grid size-11 shrink-0 place-items-center rounded-md border border-white/14 text-white transition hover:bg-white/10" aria-label={c.closeLabel} title={c.closeLabel}>
                <X size={21} aria-hidden />
              </button>
            </header>

            <div className="border-b border-brand-navy/10 bg-surface-cream px-5 py-3 sm:px-7">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-extrabold uppercase tracking-[0.08em]">
                <span className={stage === "details" ? "text-brand-red" : "text-brand-teal"}>{c.stepDetails}</span>
                <span className={stage === "proof" ? "text-brand-red" : stage === "success" ? "text-brand-teal" : "text-brand-navy/35"}>{c.stepProof}</span>
                <span className={stage === "success" ? "text-brand-red" : "text-brand-navy/35"}>{c.stepDone}</span>
              </div>
            </div>

            {stage === "details" && (
              <form onSubmit={handleDetailsSubmit} className="grid flex-1 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="bg-surface-blue p-5 sm:p-7">
                  <div className="rounded-lg bg-brand-blue p-5 text-white">
                    <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-brand-teal-light">{c.program}</p>
                    <h3 className="mt-2 font-heading text-2xl font-normal">{program}</h3>
                    <p className="mt-2 text-sm font-bold text-white/64">{price}</p>
                  </div>

                  <h3 className="mt-7 font-heading text-2xl font-normal">{c.processTitle}</h3>
                  <ol className="mt-4 grid gap-3">
                    {c.process.map((item, index) => (
                      <li key={item} className="flex gap-3 text-sm font-semibold leading-6 text-brand-navy/68">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-teal text-xs font-extrabold text-white">{index + 1}</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="p-5 sm:p-7">
                  <h3 className="font-heading text-2xl font-normal">{c.bankTitle}</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {banks.map((bank) => {
                      const isSelected = bank.name === bankName;
                      return (
                        <label key={bank.name} className={`relative cursor-pointer rounded-lg border p-4 transition ${isSelected ? "border-brand-teal bg-brand-teal/10 ring-2 ring-brand-teal/15" : "border-brand-navy/10 bg-surface-cream hover:border-brand-teal/45"}`}>
                          <input type="radio" name="payment-bank" value={bank.name} checked={isSelected} onChange={() => setBankName(bank.name)} className="sr-only" />
                          <span className="flex items-start justify-between gap-3">
                            <span className={`grid size-9 place-items-center rounded-md ${isSelected ? "bg-brand-teal" : "bg-brand-blue"} text-white`}><Building2 size={18} aria-hidden /></span>
                            {isSelected && <CheckCircle2 size={19} className="text-brand-teal" aria-hidden />}
                          </span>
                          <span className="mt-4 block font-extrabold">{bank.name}</span>
                          <span className="mt-1 block text-xs font-semibold text-brand-navy/48">{isEnglish ? bank.typeEn : bank.typeEs}</span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <PurchaseField inputRef={firstNameRef} label={c.firstName} value={firstName} onChange={setFirstName} autoComplete="given-name" />
                    <PurchaseField label={c.lastName} value={lastName} onChange={setLastName} autoComplete="family-name" />
                    <PurchaseField label={c.phone} value={phone} onChange={setPhone} type="tel" autoComplete="tel" />
                    <PurchaseField label={c.email} value={email} onChange={setEmail} type="email" autoComplete="email" />
                  </div>

                  {error && <p className="mt-5 rounded-md border border-brand-red/25 bg-brand-red/8 px-4 py-3 text-sm font-bold text-brand-red" role="alert">{error}</p>}

                  <button type="submit" disabled={isSubmitting} className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-md bg-brand-red px-5 py-3 text-sm font-extrabold text-white transition hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-60">
                    {isSubmitting ? <LoaderCircle className="animate-spin" size={18} aria-hidden /> : <ArrowRight size={18} aria-hidden />}
                    {isSubmitting ? c.saving : c.continue}
                  </button>
                </div>
              </form>
            )}

            {stage === "proof" && (
              <form onSubmit={handleProofSubmit} className="grid flex-1 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="bg-brand-blue p-5 text-white sm:p-7">
                  <p className="section-kicker-dark">{selectedBank.name}</p>
                  <h3 className="mt-2 font-heading text-3xl font-normal">{isEnglish ? selectedBank.typeEn : selectedBank.typeEs}</h3>
                  <dl className="mt-6 grid gap-4">
                    <div className="border-t border-white/14 pt-4">
                      <dt className="text-xs font-extrabold uppercase tracking-[0.08em] text-white/48">{c.accountNumber}</dt>
                      <dd className="mt-2 flex flex-wrap items-center justify-between gap-3">
                        <span className="font-heading text-2xl">{selectedBank.account}</span>
                        <button type="button" onClick={copyAccountNumber} className="inline-flex h-9 items-center gap-2 rounded-md border border-white/16 px-3 text-xs font-extrabold transition hover:bg-white/10" title={c.accountNumber}>
                          {copiedAccount === selectedBank.account ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
                          {copiedAccount === selectedBank.account ? c.copied : c.accountNumber}
                        </button>
                      </dd>
                    </div>
                    <div className="border-t border-white/14 pt-4">
                      <dt className="text-xs font-extrabold uppercase tracking-[0.08em] text-white/48">{c.holder}</dt>
                      <dd className="mt-2 font-bold">Alberto Alexander Sosa Dominguez</dd>
                    </div>
                    <div className="border-t border-white/14 pt-4">
                      <dt className="text-xs font-extrabold uppercase tracking-[0.08em] text-white/48">{c.program}</dt>
                      <dd className="mt-2 font-bold">{program} · {price}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
                  <div className="grid size-12 place-items-center rounded-lg bg-brand-teal text-white"><Upload size={23} aria-hidden /></div>
                  <h3 className="mt-5 font-heading text-3xl font-normal">{c.proofTitle}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-brand-navy/64">{c.proofBody}</p>

                  <label className="mt-6 block cursor-pointer rounded-lg border-2 border-dashed border-brand-teal/45 bg-surface-cream p-5 text-center transition hover:border-brand-teal hover:bg-brand-teal/8">
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="sr-only" />
                    <FileCheck2 className="mx-auto text-brand-teal" size={28} aria-hidden />
                    <span className="mt-3 block font-extrabold">{file?.name ?? c.chooseFile}</span>
                    <span className="mt-1 block text-xs font-semibold text-brand-navy/45">{c.fileHelp}</span>
                  </label>

                  <p className="mt-4 flex items-start gap-2 text-xs font-semibold leading-5 text-brand-navy/48"><LockKeyhole className="mt-0.5 shrink-0 text-brand-teal" size={15} aria-hidden />{c.secure}</p>
                  {error && <p className="mt-5 rounded-md border border-brand-red/25 bg-brand-red/8 px-4 py-3 text-sm font-bold text-brand-red" role="alert">{error}</p>}

                  <button type="submit" disabled={isSubmitting || !file} className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-md bg-brand-red px-5 py-3 text-sm font-extrabold text-white transition hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-60">
                    {isSubmitting ? <LoaderCircle className="animate-spin" size={18} aria-hidden /> : <Upload size={18} aria-hidden />}
                    {isSubmitting ? c.uploading : c.upload}
                  </button>
                </div>
              </form>
            )}

            {stage === "success" && (
              <div className="flex flex-1 items-center justify-center p-5 sm:p-10">
                <div className="w-full max-w-2xl rounded-xl border border-brand-teal/30 bg-surface-blue p-6 text-center sm:p-10">
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-brand-teal text-white"><CheckCircle2 size={31} aria-hidden /></div>
                  <p className="section-kicker mt-6">{c.stepDone}</p>
                  <h3 className="mt-2 font-heading text-3xl font-normal sm:text-4xl">{c.thankTitle}</h3>
                  <p className="mx-auto mt-4 max-w-xl leading-7 text-brand-navy/66">{c.thankBody}</p>
                  <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-navy/44">{c.reference}</p>
                  <p className="mt-1 font-heading text-xl">{recordId}</p>
                  <button type="button" onClick={closeDialog} className="mt-7 inline-flex h-12 items-center justify-center rounded-md bg-brand-red px-7 text-sm font-extrabold text-white transition hover:bg-brand-red-dark">{c.close}</button>
                </div>
              </div>
            )}
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}

function PurchaseField({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputRef,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  autoComplete: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <label className="grid gap-2 text-sm font-extrabold">
      {label}
      <input ref={inputRef} type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} required className="h-12 min-w-0 rounded-md border border-brand-navy/12 bg-surface-cream px-4 text-sm font-semibold text-brand-navy outline-none transition focus:border-brand-teal focus:bg-surface-white focus:ring-4 focus:ring-brand-teal/12" />
    </label>
  );
}

function createRecordId() {
  return `ST-${crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}
