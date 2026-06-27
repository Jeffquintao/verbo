/**
 * Banco de perguntas do Quiz Bíblico (amostra inicial).
 * Em produção virá do Firestore com categorias e dificuldades (escopo 2.8).
 * `answer` é o índice da opção correta em `options`.
 */
export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  reference?: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Quem construiu a arca para sobreviver ao dilúvio?',
    options: ['Moisés', 'Noé', 'Abraão', 'Davi'],
    answer: 1,
    reference: 'Gênesis 6',
  },
  {
    id: 'q2',
    question: 'Quantos dias e noites choveu durante o dilúvio?',
    options: ['7', '30', '40', '100'],
    answer: 2,
    reference: 'Gênesis 7:12',
  },
  {
    id: 'q3',
    question: 'Quem libertou o povo de Israel da escravidão no Egito?',
    options: ['Josué', 'Moisés', 'Arão', 'Gideão'],
    answer: 1,
    reference: 'Êxodo 3',
  },
  {
    id: 'q4',
    question: 'Quantos mandamentos Deus entregou a Moisés no monte Sinai?',
    options: ['7', '10', '12', '5'],
    answer: 1,
    reference: 'Êxodo 20',
  },
  {
    id: 'q5',
    question: 'Qual rei de Israel matou o gigante Golias ainda jovem?',
    options: ['Saul', 'Salomão', 'Davi', 'Ezequias'],
    answer: 2,
    reference: '1 Samuel 17',
  },
  {
    id: 'q6',
    question: 'Quem era conhecido como o homem mais sábio de Israel?',
    options: ['Davi', 'Salomão', 'Elias', 'Daniel'],
    answer: 1,
    reference: '1 Reis 3',
  },
  {
    id: 'q7',
    question: 'Qual profeta foi engolido por um grande peixe?',
    options: ['Jonas', 'Eliseu', 'Jeremias', 'Isaías'],
    answer: 0,
    reference: 'Jonas 1',
  },
  {
    id: 'q8',
    question: 'Em qual cidade Jesus nasceu?',
    options: ['Nazaré', 'Jerusalém', 'Belém', 'Cafarnaum'],
    answer: 2,
    reference: 'Mateus 2:1',
  },
  {
    id: 'q9',
    question: 'Quantos discípulos Jesus escolheu como apóstolos?',
    options: ['7', '10', '12', '14'],
    answer: 2,
    reference: 'Mateus 10',
  },
  {
    id: 'q10',
    question: 'Quem batizou Jesus no rio Jordão?',
    options: ['Pedro', 'João Batista', 'André', 'Tiago'],
    answer: 1,
    reference: 'Mateus 3',
  },
  {
    id: 'q11',
    question: 'Qual apóstolo negou Jesus três vezes?',
    options: ['João', 'Judas', 'Pedro', 'Tomé'],
    answer: 2,
    reference: 'Lucas 22',
  },
  {
    id: 'q12',
    question: 'Quantos livros há na Bíblia (protestante)?',
    options: ['66', '73', '50', '40'],
    answer: 0,
  },
  {
    id: 'q13',
    question: 'Qual é o primeiro livro da Bíblia?',
    options: ['Êxodo', 'Salmos', 'Gênesis', 'João'],
    answer: 2,
  },
  {
    id: 'q14',
    question: 'Qual é o último livro da Bíblia?',
    options: ['Apocalipse', 'Judas', 'Malaquias', 'Atos'],
    answer: 0,
  },
  {
    id: 'q15',
    question: 'Quem traiu Jesus por trinta moedas de prata?',
    options: ['Pedro', 'Judas Iscariotes', 'Tomé', 'Mateus'],
    answer: 1,
    reference: 'Mateus 26:15',
  },
  {
    id: 'q16',
    question: 'Qual é o versículo mais conhecido sobre o amor de Deus?',
    options: ['Salmos 23', 'João 3:16', 'Gênesis 1:1', 'Romanos 8:28'],
    answer: 1,
    reference: 'João 3:16',
  },
  {
    id: 'q17',
    question: 'Quem foi lançado na cova dos leões e sobreviveu?',
    options: ['Daniel', 'Sadraque', 'José', 'Jó'],
    answer: 0,
    reference: 'Daniel 6',
  },
  {
    id: 'q18',
    question: 'Qual mulher se tornou rainha e salvou seu povo do extermínio?',
    options: ['Rute', 'Ester', 'Débora', 'Sara'],
    answer: 1,
    reference: 'Ester 4',
  },
];

/** Seleciona `count` perguntas aleatórias do banco. */
export function pickQuizQuestions(count = 10): QuizQuestion[] {
  const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
