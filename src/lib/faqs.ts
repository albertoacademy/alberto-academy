export type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

export const allFaqs: FAQItem[] = [
  {
    question: "¿Las clases son online o presenciales?",
    answer:
      "Por el momento, todas las clases se imparten online. Alberto Academy utiliza Google Meet para las sesiones, Google Classroom para el seguimiento y WhatsApp para la comunicación.",
    category: "Clases",
  },
  {
    question: "¿Cuánto dura cada clase?",
    answer:
      "Las clases privadas duran entre una y dos horas, según lo acordado con el estudiante. Las clases grupales duran dos horas y se imparten dos días por semana.",
    category: "Horarios",
  },
  {
    question: "¿Necesito saber mi nivel antes de empezar?",
    answer:
      "No necesita llegar con una certificación de nivel. Durante la conversación inicial se revisan sus objetivos y conocimientos actuales. Si desea una evaluación más completa, puede realizar una prueba opcional de lectura, gramática, comprensión auditiva y uso del idioma.",
    category: "Progreso",
  },
  {
    question: "¿Qué sucede si falto a una clase?",
    answer:
      "La ausencia, justificada o no, queda registrada en el control de asistencia. Para completar satisfactoriamente el programa se espera una asistencia mínima del 75 %. Cualquier situación particular puede conversarse directamente con Alberto.",
    category: "Horarios",
  },
  {
    question: "¿Puedo cambiar mi horario?",
    answer:
      "Sí, cuando exista otro grupo de nivel similar y ambos estén trabajando unidades compatibles. En clases privadas, cualquier ajuste depende de la disponibilidad acordada con Alberto.",
    category: "Horarios",
  },
  {
    question: "¿Hay clases grupales?",
    answer:
      "Sí. Los grupos se organizan por nivel y se reúnen dos veces por semana durante dos horas por sesión.",
    category: "Clases",
  },
  {
    question: "¿Alberto trabaja con niños o solo con adultos?",
    answer:
      "Alberto ha enseñado a estudiantes desde los 9 años. La atención principal está dirigida a adultos, universitarios y profesionales, aunque también puede trabajar con niños y adolescentes según sus necesidades.",
    category: "Clases",
  },
  {
    question: "¿Puedo prepararme para entrevistas, exámenes o inglés de negocios?",
    answer:
      "Sí. Las sesiones pueden enfocarse en entrevistas laborales, exámenes, negocios, viajes, conversación, gramática, escritura, pronunciación y situaciones específicas de comunicación.",
    category: "Clases",
  },
  {
    question: "¿Se incluyen materiales?",
    answer:
      "Las clases utilizan libros, PDF, videos, audios, presentaciones y ejercicios interactivos. Se entregan recursos descargables cuando corresponde; los libros o materiales base con costo se cotizan por separado antes de la inscripción.",
    category: "Materiales",
  },
  {
    question: "¿Se asignan tareas después de cada clase?",
    answer:
      "Solo cuando el tema lo requiere. Las actividades pueden incluir ejercicios, proyectos, presentaciones y prácticas individuales o en grupos pequeños.",
    category: "Materiales",
  },
  {
    question: "¿Cuándo comenzaré a notar progreso?",
    answer:
      "El primer nivel suele desarrollarse en un periodo aproximado de tres a seis meses. El avance depende de la asistencia, la práctica y la responsabilidad de cada estudiante; Alberto Academy no ofrece promesas irreales de resultados.",
    category: "Progreso",
  },
  {
    question: "¿Puedo pausar mi plan?",
    answer:
      "Sí. La pausa debe coordinarse con Alberto Academy para revisar pagos, disponibilidad y la mejor forma de retomar el nivel sin perder continuidad.",
    category: "Horarios",
  },
  {
    question: "¿Qué necesito para tomar clases online?",
    answer:
      "Solo necesita un teléfono inteligente o una computadora, conexión estable a internet, micrófono y un espacio donde pueda participar activamente.",
    category: "Clases",
  },
  {
    question: "¿La conversación inicial es una clase de prueba?",
    answer:
      "No. Alberto Academy no ofrece clases de prueba. La primera conversación, de hasta una hora y sin costo, sirve para conocer sus objetivos, orientar su nivel y recomendarle el programa adecuado.",
    category: "Progreso",
  },
];

export const homepageFaqs = allFaqs.slice(0, 4);

export const allFaqsEn: FAQItem[] = [
  {
    question: "Are lessons online or in person?",
    answer: "All lessons are currently online. Alberto Academy uses Google Meet for live sessions, Google Classroom for learning support, and WhatsApp for communication.",
    category: "Lessons",
  },
  {
    question: "How long is each lesson?",
    answer: "Private lessons last one to two hours, depending on your plan. Group lessons last two hours and meet twice per week.",
    category: "Schedule",
  },
  {
    question: "Do I need to know my Spanish level before I start?",
    answer: "No. Alberto will discuss your experience and goals during the free consultation. If you want a more complete assessment, an optional reading, grammar, listening, and language-use evaluation is available.",
    category: "Progress",
  },
  {
    question: "What happens if I miss a lesson?",
    answer: "Every absence is recorded. Students are expected to maintain at least 75% attendance to complete a program successfully. You can discuss exceptional circumstances directly with Alberto.",
    category: "Schedule",
  },
  {
    question: "Can I change my schedule?",
    answer: "Yes, when availability allows. Group students may move when another group is at a similar level and unit. Private-lesson changes depend on the schedule agreed with Alberto.",
    category: "Schedule",
  },
  {
    question: "Are group Spanish lessons available?",
    answer: "Yes. Groups are organized by level and meet twice per week for two hours per session.",
    category: "Lessons",
  },
  {
    question: "Does Alberto teach children or only adults?",
    answer: "Alberto has taught students from age nine through adulthood. The primary focus is adults, university students, and professionals, though children and teenagers may be accepted based on their needs.",
    category: "Lessons",
  },
  {
    question: "Can lessons focus on travel, work, or life in a Spanish-speaking country?",
    answer: "Yes. Your sessions can focus on travel, workplace communication, relocation, everyday conversation, pronunciation, writing, or another practical situation where you need Spanish.",
    category: "Lessons",
  },
  {
    question: "Are learning materials included?",
    answer: "Lessons may use books, PDFs, videos, audio, presentations, and interactive exercises. Downloadable resources are provided when appropriate; paid books or core materials are quoted before enrollment.",
    category: "Materials",
  },
  {
    question: "Will I receive homework?",
    answer: "Only when it supports the lesson goal. Activities may include exercises, short projects, presentations, or individual and small-group practice.",
    category: "Materials",
  },
  {
    question: "When should I expect to notice progress?",
    answer: "The first level generally takes three to six months. Progress depends on attendance, practice, and consistency, so Alberto Academy does not make unrealistic fluency promises.",
    category: "Progress",
  },
  {
    question: "Can I pause my plan?",
    answer: "Yes. Pauses should be coordinated with Alberto Academy so payment, availability, and the best point for returning can be reviewed.",
    category: "Schedule",
  },
  {
    question: "What do I need for online lessons?",
    answer: "You need a smartphone or computer, a stable internet connection, a microphone, and a place where you can participate actively.",
    category: "Lessons",
  },
  {
    question: "Is the free consultation a trial lesson?",
    answer: "No. Alberto Academy does not offer trial lessons. The free consultation can last up to one hour and is used to understand your goals, identify your starting level, and recommend the right path.",
    category: "Progress",
  },
];

export const homepageFaqsEn = allFaqsEn.slice(0, 4);
