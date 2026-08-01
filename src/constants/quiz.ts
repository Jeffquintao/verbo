/**
 * Banco de perguntas do Quiz Bíblico, nos três idiomas do app.
 *
 * A referência (`ref`) é compartilhada; só o texto muda por idioma.
 * `answer` é o índice da alternativa correta em `options` — a ordem das
 * alternativas é a mesma nos três idiomas, então o índice serve para todos.
 *
 * Em produção o banco virá do Firestore com categorias e dificuldades
 * (escopo 2.8); aqui é a amostra embutida.
 */
import type { Locale } from '@/store/useLocaleStore';

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  reference?: string;
};

type QuestionText = { question: string; options: string[] };

type QuestionEntry = {
  id: string;
  answer: number;
  ref?: string;
  en: QuestionText;
  pt: QuestionText;
  es: QuestionText;
};

const QUESTIONS: QuestionEntry[] = [
  {
    id: 'q1',
    answer: 1,
    ref: 'Genesis 6',
    en: { question: 'Who built the ark to survive the flood?', options: ['Moses', 'Noah', 'Abraham', 'David'] },
    pt: { question: 'Quem construiu a arca para sobreviver ao dilúvio?', options: ['Moisés', 'Noé', 'Abraão', 'Davi'] },
    es: { question: '¿Quién construyó el arca para sobrevivir al diluvio?', options: ['Moisés', 'Noé', 'Abraham', 'David'] },
  },
  {
    id: 'q2',
    answer: 2,
    ref: 'Genesis 7:12',
    en: { question: 'How many days and nights did it rain during the flood?', options: ['7', '30', '40', '100'] },
    pt: { question: 'Quantos dias e noites choveu durante o dilúvio?', options: ['7', '30', '40', '100'] },
    es: { question: '¿Cuántos días y noches llovió durante el diluvio?', options: ['7', '30', '40', '100'] },
  },
  {
    id: 'q3',
    answer: 1,
    ref: 'Exodus 3',
    en: { question: 'Who led the people of Israel out of slavery in Egypt?', options: ['Joshua', 'Moses', 'Aaron', 'Gideon'] },
    pt: { question: 'Quem libertou o povo de Israel da escravidão no Egito?', options: ['Josué', 'Moisés', 'Arão', 'Gideão'] },
    es: { question: '¿Quién liberó al pueblo de Israel de la esclavitud en Egipto?', options: ['Josué', 'Moisés', 'Aarón', 'Gedeón'] },
  },
  {
    id: 'q4',
    answer: 1,
    ref: 'Exodus 20',
    en: { question: 'How many commandments did God give Moses on Mount Sinai?', options: ['7', '10', '12', '5'] },
    pt: { question: 'Quantos mandamentos Deus entregou a Moisés no monte Sinai?', options: ['7', '10', '12', '5'] },
    es: { question: '¿Cuántos mandamientos dio Dios a Moisés en el monte Sinaí?', options: ['7', '10', '12', '5'] },
  },
  {
    id: 'q5',
    answer: 2,
    ref: '1 Samuel 17',
    en: { question: 'Which king of Israel killed the giant Goliath as a young man?', options: ['Saul', 'Solomon', 'David', 'Hezekiah'] },
    pt: { question: 'Qual rei de Israel matou o gigante Golias ainda jovem?', options: ['Saul', 'Salomão', 'Davi', 'Ezequias'] },
    es: { question: '¿Qué rey de Israel mató al gigante Goliat siendo joven?', options: ['Saúl', 'Salomón', 'David', 'Ezequías'] },
  },
  {
    id: 'q6',
    answer: 1,
    ref: '1 Kings 3',
    en: { question: 'Who was known as the wisest man in Israel?', options: ['David', 'Solomon', 'Elijah', 'Daniel'] },
    pt: { question: 'Quem era conhecido como o homem mais sábio de Israel?', options: ['Davi', 'Salomão', 'Elias', 'Daniel'] },
    es: { question: '¿Quién era conocido como el hombre más sabio de Israel?', options: ['David', 'Salomón', 'Elías', 'Daniel'] },
  },
  {
    id: 'q7',
    answer: 0,
    ref: 'Jonah 1',
    en: { question: 'Which prophet was swallowed by a great fish?', options: ['Jonah', 'Elisha', 'Jeremiah', 'Isaiah'] },
    pt: { question: 'Qual profeta foi engolido por um grande peixe?', options: ['Jonas', 'Eliseu', 'Jeremias', 'Isaías'] },
    es: { question: '¿Qué profeta fue tragado por un gran pez?', options: ['Jonás', 'Eliseo', 'Jeremías', 'Isaías'] },
  },
  {
    id: 'q8',
    answer: 2,
    ref: 'Matthew 2:1',
    en: { question: 'In which city was Jesus born?', options: ['Nazareth', 'Jerusalem', 'Bethlehem', 'Capernaum'] },
    pt: { question: 'Em qual cidade Jesus nasceu?', options: ['Nazaré', 'Jerusalém', 'Belém', 'Cafarnaum'] },
    es: { question: '¿En qué ciudad nació Jesús?', options: ['Nazaret', 'Jerusalén', 'Belén', 'Capernaúm'] },
  },
  {
    id: 'q9',
    answer: 2,
    ref: 'Matthew 10',
    en: { question: 'How many disciples did Jesus choose as apostles?', options: ['7', '10', '12', '14'] },
    pt: { question: 'Quantos discípulos Jesus escolheu como apóstolos?', options: ['7', '10', '12', '14'] },
    es: { question: '¿Cuántos discípulos escogió Jesús como apóstoles?', options: ['7', '10', '12', '14'] },
  },
  {
    id: 'q10',
    answer: 1,
    ref: 'Matthew 3',
    en: { question: 'Who baptised Jesus in the Jordan River?', options: ['Peter', 'John the Baptist', 'Andrew', 'James'] },
    pt: { question: 'Quem batizou Jesus no rio Jordão?', options: ['Pedro', 'João Batista', 'André', 'Tiago'] },
    es: { question: '¿Quién bautizó a Jesús en el río Jordán?', options: ['Pedro', 'Juan el Bautista', 'Andrés', 'Jacobo'] },
  },
  {
    id: 'q11',
    answer: 2,
    ref: 'Luke 22',
    en: { question: 'Which apostle denied Jesus three times?', options: ['John', 'Judas', 'Peter', 'Thomas'] },
    pt: { question: 'Qual apóstolo negou Jesus três vezes?', options: ['João', 'Judas', 'Pedro', 'Tomé'] },
    es: { question: '¿Qué apóstol negó a Jesús tres veces?', options: ['Juan', 'Judas', 'Pedro', 'Tomás'] },
  },
  {
    id: 'q12',
    answer: 0,
    en: { question: 'How many books are in the (Protestant) Bible?', options: ['66', '73', '50', '40'] },
    pt: { question: 'Quantos livros há na Bíblia (protestante)?', options: ['66', '73', '50', '40'] },
    es: { question: '¿Cuántos libros tiene la Biblia (protestante)?', options: ['66', '73', '50', '40'] },
  },
  {
    id: 'q13',
    answer: 2,
    en: { question: 'What is the first book of the Bible?', options: ['Exodus', 'Psalms', 'Genesis', 'John'] },
    pt: { question: 'Qual é o primeiro livro da Bíblia?', options: ['Êxodo', 'Salmos', 'Gênesis', 'João'] },
    es: { question: '¿Cuál es el primer libro de la Biblia?', options: ['Éxodo', 'Salmos', 'Génesis', 'Juan'] },
  },
  {
    id: 'q14',
    answer: 0,
    en: { question: 'What is the last book of the Bible?', options: ['Revelation', 'Jude', 'Malachi', 'Acts'] },
    pt: { question: 'Qual é o último livro da Bíblia?', options: ['Apocalipse', 'Judas', 'Malaquias', 'Atos'] },
    es: { question: '¿Cuál es el último libro de la Biblia?', options: ['Apocalipsis', 'Judas', 'Malaquías', 'Hechos'] },
  },
  {
    id: 'q15',
    answer: 1,
    ref: 'Matthew 26:15',
    en: { question: 'Who betrayed Jesus for thirty pieces of silver?', options: ['Peter', 'Judas Iscariot', 'Thomas', 'Matthew'] },
    pt: { question: 'Quem traiu Jesus por trinta moedas de prata?', options: ['Pedro', 'Judas Iscariotes', 'Tomé', 'Mateus'] },
    es: { question: '¿Quién traicionó a Jesús por treinta monedas de plata?', options: ['Pedro', 'Judas Iscariote', 'Tomás', 'Mateo'] },
  },
  {
    id: 'q16',
    answer: 1,
    ref: 'John 3:16',
    en: { question: "Which is the best-known verse about God's love?", options: ['Psalm 23', 'John 3:16', 'Genesis 1:1', 'Romans 8:28'] },
    pt: { question: 'Qual é o versículo mais conhecido sobre o amor de Deus?', options: ['Salmos 23', 'João 3:16', 'Gênesis 1:1', 'Romanos 8:28'] },
    es: { question: '¿Cuál es el versículo más conocido sobre el amor de Dios?', options: ['Salmo 23', 'Juan 3:16', 'Génesis 1:1', 'Romanos 8:28'] },
  },
  {
    id: 'q17',
    answer: 0,
    ref: 'Daniel 6',
    en: { question: "Who was thrown into the lions' den and survived?", options: ['Daniel', 'Shadrach', 'Joseph', 'Job'] },
    pt: { question: 'Quem foi lançado na cova dos leões e sobreviveu?', options: ['Daniel', 'Sadraque', 'José', 'Jó'] },
    es: { question: '¿Quién fue arrojado al foso de los leones y sobrevivió?', options: ['Daniel', 'Sadrac', 'José', 'Job'] },
  },
  {
    id: 'q18',
    answer: 1,
    ref: 'Esther 4',
    en: { question: 'Which woman became queen and saved her people from destruction?', options: ['Ruth', 'Esther', 'Deborah', 'Sarah'] },
    pt: { question: 'Qual mulher se tornou rainha e salvou seu povo do extermínio?', options: ['Rute', 'Ester', 'Débora', 'Sara'] },
    es: { question: '¿Qué mujer llegó a ser reina y salvó a su pueblo del exterminio?', options: ['Rut', 'Ester', 'Débora', 'Sara'] },
  },
];

/** Banco completo no idioma pedido. */
export function quizQuestionsForLocale(locale: Locale): QuizQuestion[] {
  return QUESTIONS.map((q) => {
    const text = q[locale] ?? q.en;
    return {
      id: q.id,
      question: text.question,
      options: text.options,
      answer: q.answer,
      reference: q.ref,
    };
  });
}

/** Sorteia `count` perguntas do banco, no idioma pedido. */
export function pickQuizQuestions(locale: Locale, count = 10): QuizQuestion[] {
  const all = quizQuestionsForLocale(locale);
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
