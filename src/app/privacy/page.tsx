import type { Metadata } from "next";
import { ClipboardCheck, Database, LockKeyhole, MailCheck, ShieldCheck, UserCheck } from "lucide-react";
import { LegalPage } from "@/components/legal-page";
import { localeAlternates } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return locale === "en" ? { title: "Privacy Policy | Alberto Academy", description: "How Alberto Academy collects, uses, and protects information shared by students and prospective learners.", alternates: localeAlternates(locale, "/privacy") } : { title: "Política de privacidad | Alberto Academy", description: "Cómo Alberto Academy recopila, utiliza y protege la información compartida por estudiantes y personas interesadas.", alternates: localeAlternates(locale, "/privacy") };
}

const sections = {
  es: [
    { title: "Información que recopilamos", icon: Database, copy: ["Cuando usted solicita una conversación inicial, podemos recopilar su nombre, correo electrónico, teléfono, nivel aproximado, servicio de interés y los datos que decida compartir sobre sus objetivos.", "También podemos conservar comunicaciones relacionadas con horarios, inscripción, planificación de clases y seguimiento académico."] },
    { title: "Cómo utilizamos la información", icon: ClipboardCheck, copy: ["La información se utiliza para responder consultas, orientar su nivel, recomendar un programa, coordinar sesiones y personalizar la enseñanza.", "Alberto Academy no vende información personal ni la incorpora a listas de marketing ajenas a sus servicios."] },
    { title: "Material académico", icon: UserCheck, copy: ["Las notas de clase, ejercicios, muestras de escritura y observaciones de nivel pueden utilizarse para adaptar la enseñanza y medir el progreso.", "El trabajo del estudiante se trata como información privada y no se publica sin su autorización."] },
    { title: "Protección de datos", icon: LockKeyhole, copy: ["Alberto Academy aplica medidas administrativas y técnicas razonables para reducir el riesgo de acceso no autorizado, pérdida o uso indebido.", "Ningún servicio online puede garantizar seguridad absoluta; por eso se procura limitar la información a lo necesario para la comunicación y la enseñanza."] },
    { title: "Sus opciones", icon: ShieldCheck, copy: ["Usted puede solicitar la corrección o eliminación de sus datos de contacto cuando ya no sean necesarios para un servicio activo o un registro legítimo.", "También puede omitir información opcional, aunque esto podría limitar el nivel de personalización de la recomendación inicial."] },
    { title: "Contacto", icon: MailCheck, copy: ["Para consultas o solicitudes de privacidad, escriba a albertoalex0033@gmail.com.", "Esta política puede actualizarse a medida que Alberto Academy incorpore nuevas herramientas o servicios."] },
  ],
  en: [
    { title: "Information we collect", icon: Database, copy: ["When you request a free consultation, we may collect your name, email address, phone number, approximate level, service of interest, and any details you choose to share about your goals.", "We may also retain communications related to scheduling, enrollment, lesson planning, and academic progress."] },
    { title: "How we use information", icon: ClipboardCheck, copy: ["Information is used to answer questions, identify your starting level, recommend a program, coordinate sessions, and personalize instruction.", "Alberto Academy does not sell personal information or add it to third-party marketing lists."] },
    { title: "Learning materials", icon: UserCheck, copy: ["Lesson notes, exercises, writing samples, and level observations may be used to adapt instruction and monitor progress.", "Student work is treated as private and is not published without permission."] },
    { title: "Data protection", icon: LockKeyhole, copy: ["Alberto Academy uses reasonable administrative and technical measures to reduce the risk of unauthorized access, loss, or misuse.", "No online service can guarantee absolute security, so information is limited to what is reasonably needed for communication and instruction."] },
    { title: "Your choices", icon: ShieldCheck, copy: ["You may request correction or deletion of your contact information when it is no longer needed for an active service or legitimate record.", "You may also omit optional information, although this can limit how personalized the initial recommendation can be."] },
    { title: "Contact", icon: MailCheck, copy: ["For privacy questions or requests, email albertoalex0033@gmail.com.", "This policy may be updated as Alberto Academy adds new tools or services."] },
  ],
};

export default async function PrivacyPage() {
  const locale = await getRequestLocale();
  const isEnglish = locale === "en";
  return <LegalPage locale={locale} eyebrow={isEnglish ? "Privacy Policy" : "Política de privacidad"} title={isEnglish ? "Your information deserves clear, responsible treatment." : "Su información merece un tratamiento claro y responsable."} description={isEnglish ? "This policy explains how Alberto Academy handles information shared through inquiries, consultations, lessons, and communications." : "Esta política explica cómo Alberto Academy maneja los datos compartidos en consultas, conversaciones iniciales, clases y comunicaciones."} updated={isEnglish ? "July 22, 2026" : "22 de julio de 2026"} sections={sections[locale]} />;
}
