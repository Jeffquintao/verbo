/**
 * Locais históricos bíblicos (curadoria própria). Recurso Premium (escopo 2.3).
 * `refs` permite ligar o local aos capítulos onde é mencionado (pin na leitura).
 */
export type PlaceRef = { abbrev: string; chapter: number; verse?: number };

export type Place = {
  id: string;
  name: string;
  region: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  color: string; // cor do thumbnail
  about: string; // "Sobre o local"
  today: string; // aba "Hoje"
  builtYear?: string;
  denomination?: string;
  centuryI: string; // aba "Séc. I d.C."
  curiosity: string; // curiosidade arqueológica
  refs: PlaceRef[];
};

export const PLACES: Place[] = [
  {
    id: 'santo-sepulcro',
    name: 'Igreja do Santo Sepulcro',
    region: 'Jerusalém',
    city: 'Jerusalém',
    country: 'Israel',
    lat: 31.7784,
    lng: 35.2297,
    color: '#4A3B1A',
    about:
      'Considerada o local da crucificação, sepultamento e ressurreição de Jesus. A igreja atual foi construída no séc. IV por ordem do imperador Constantino.',
    today:
      'Hoje é uma das igrejas mais visitadas do mundo, compartilhada por seis denominações cristãs. Abriga o Calvário e a Edícula (o túmulo).',
    builtYear: '335 d.C.',
    denomination: '6 igrejas cristãs',
    centuryI:
      'No séc. I, o local ficava fora dos muros de Jerusalém — uma pedreira abandonada usada como jardim e área de sepultamentos, condizente com a descrição de João 19:41.',
    curiosity:
      'Escavações de 2016 confirmaram que a laje de pedra sob a Edícula data do séc. I, consistente com o período de Jesus.',
    refs: [
      { abbrev: 'mt', chapter: 27, verse: 60 },
      { abbrev: 'mc', chapter: 15, verse: 46 },
      { abbrev: 'lc', chapter: 23, verse: 53 },
      { abbrev: 'jo', chapter: 19, verse: 41 },
      { abbrev: 'jo', chapter: 20, verse: 1 },
    ],
  },
  {
    id: 'getsemani',
    name: 'Jardim do Getsêmani',
    region: 'Jerusalém',
    city: 'Jerusalém',
    country: 'Israel',
    lat: 31.7794,
    lng: 35.2396,
    color: '#1E3A24',
    about:
      'Jardim ao pé do Monte das Oliveiras onde Jesus orou na noite em que foi preso. O nome significa "prensa de azeite" em aramaico.',
    today:
      'Abriga oliveiras milenares e a Igreja de Todas as Nações. Algumas das árvores estão entre as mais antigas do mundo.',
    builtYear: '1924 d.C. (igreja)',
    denomination: 'Franciscanos',
    centuryI:
      'Era um pomar de oliveiras com uma prensa de azeite, lugar tranquilo onde Jesus costumava se reunir com os discípulos (Lucas 22:39).',
    curiosity:
      'Estudos de carbono-14 indicam que três das oliveiras do jardim têm raízes com mais de 900 anos, e podem descender de árvores do séc. I.',
    refs: [
      { abbrev: 'mt', chapter: 26, verse: 36 },
      { abbrev: 'mc', chapter: 14, verse: 32 },
      { abbrev: 'jo', chapter: 18, verse: 1 },
    ],
  },
  {
    id: 'monte-oliveiras',
    name: 'Monte das Oliveiras',
    region: 'Jerusalém',
    city: 'Jerusalém',
    country: 'Israel',
    lat: 31.7784,
    lng: 35.2461,
    color: '#2A2540',
    about:
      'Elevação a leste de Jerusalém, cenário de ensinamentos de Jesus, da ascensão e de profecias messiânicas.',
    today:
      'Oferece a vista clássica da Cidade Velha. Abriga um dos cemitérios judaicos mais antigos em uso contínuo.',
    builtYear: '—',
    denomination: 'Vários santuários',
    centuryI:
      'Caminho natural entre Jerusalém e Betânia. Dali Jesus contemplou a cidade e profetizou sobre ela (Lucas 19:41).',
    curiosity:
      'Zacarias 14:4 profetiza que o Messias poria os pés sobre o Monte das Oliveiras — uma das razões do enorme cemitério judaico no local.',
    refs: [
      { abbrev: 'zc', chapter: 14, verse: 4 },
      { abbrev: 'mt', chapter: 24, verse: 3 },
      { abbrev: 'at', chapter: 1, verse: 12 },
    ],
  },
  {
    id: 'mar-galileia',
    name: 'Mar da Galileia',
    region: 'Galileia',
    city: 'Tiberíades',
    country: 'Israel',
    lat: 32.8331,
    lng: 35.5903,
    color: '#0E2A38',
    about:
      'Grande lago de água doce, palco de boa parte do ministério de Jesus: a chamada dos pescadores, milagres e ensinamentos.',
    today:
      'Principal reservatório de água doce de Israel. Suas margens reúnem sítios como Cafarnaum, Magdala e o Monte das Bem-aventuranças.',
    builtYear: '—',
    denomination: '—',
    centuryI:
      'Centro de uma próspera indústria pesqueira. Cidades como Cafarnaum e Betsaida viviam da pesca, ofício de vários discípulos.',
    curiosity:
      'Em 1986, uma seca revelou o "Barco de Jesus": um barco de pesca do séc. I, com 8m, preservado na lama da margem.',
    refs: [
      { abbrev: 'mt', chapter: 4, verse: 18 },
      { abbrev: 'mc', chapter: 1, verse: 16 },
      { abbrev: 'jo', chapter: 6, verse: 1 },
    ],
  },
  {
    id: 'nazare',
    name: 'Nazaré',
    region: 'Galileia',
    city: 'Nazaré',
    country: 'Israel',
    lat: 32.7019,
    lng: 35.2978,
    color: '#3A1E40',
    about:
      'Vila da Galileia onde Jesus cresceu. Tão modesta que gerou a pergunta: "De Nazaré pode vir algo de bom?" (João 1:46).',
    today:
      'Maior cidade árabe de Israel. Abriga a Basílica da Anunciação, uma das maiores igrejas do Oriente Médio.',
    builtYear: '1969 d.C. (basílica)',
    denomination: 'Católica',
    centuryI:
      'Pequeno povoado agrícola de talvez 200–400 habitantes, sem grande importância política ou religiosa.',
    curiosity:
      'Em 2009 arqueólogos encontraram em Nazaré uma casa do séc. I — a primeira evidência concreta de habitação na vila no tempo de Jesus.',
    refs: [
      { abbrev: 'lc', chapter: 1, verse: 26 },
      { abbrev: 'mt', chapter: 2, verse: 23 },
      { abbrev: 'lc', chapter: 4, verse: 16 },
    ],
  },
  {
    id: 'cafarnaum',
    name: 'Cafarnaum',
    region: 'Galileia',
    city: 'Cafarnaum',
    country: 'Israel',
    lat: 32.8807,
    lng: 35.5752,
    color: '#1A2E3A',
    about:
      'Cidade às margens do Mar da Galileia que Jesus tornou seu centro de operações. Chamada de "a sua cidade" (Mateus 9:1).',
    today:
      'Sítio arqueológico com as ruínas de uma sinagoga do séc. IV e a casa tradicionalmente atribuída a Pedro.',
    builtYear: '—',
    denomination: 'Franciscanos (sítio)',
    centuryI:
      'Vila de pescadores e posto alfandegário na via que ligava o Egito à Mesopotâmia. Ali Jesus chamou Mateus, o cobrador de impostos.',
    curiosity:
      'Sob a sinagoga branca do séc. IV, escavou-se uma sinagoga de basalto negro do séc. I — provavelmente onde Jesus ensinou (Marcos 1:21).',
    refs: [
      { abbrev: 'mt', chapter: 4, verse: 13 },
      { abbrev: 'mc', chapter: 2, verse: 1 },
      { abbrev: 'jo', chapter: 6, verse: 59 },
    ],
  },
  {
    id: 'rio-jordao',
    name: 'Rio Jordão',
    region: 'Galileia',
    city: 'Vale do Jordão',
    country: 'Israel / Jordânia',
    lat: 31.8372,
    lng: 35.5494,
    color: '#13362A',
    about:
      'Rio que liga o Mar da Galileia ao Mar Morto. Local do batismo de Jesus por João Batista.',
    today:
      'O sítio de Qasr el-Yahud, perto de Jericó, é o ponto tradicional do batismo, hoje aberto a peregrinos.',
    builtYear: '—',
    denomination: 'Vários santuários',
    centuryI:
      'Fronteira natural e local de purificação ritual. João Batista pregava e batizava em suas margens.',
    curiosity:
      'O Jordão já foi palco de outro milagre: a cura de Naamã, o leproso sírio, que mergulhou sete vezes em suas águas (2 Reis 5:14).',
    refs: [
      { abbrev: 'mt', chapter: 3, verse: 13 },
      { abbrev: 'mc', chapter: 1, verse: 9 },
      { abbrev: '2rs', chapter: 5, verse: 14 },
    ],
  },
  {
    id: 'belem',
    name: 'Belém',
    region: 'Judeia',
    city: 'Belém',
    country: 'Cisjordânia',
    lat: 31.7054,
    lng: 35.2024,
    color: '#3A2A14',
    about:
      'Cidade natal do rei Davi e local do nascimento de Jesus, conforme a profecia de Miqueias 5:2.',
    today:
      'Abriga a Basílica da Natividade, uma das igrejas cristãs mais antigas em funcionamento contínuo do mundo.',
    builtYear: '565 d.C. (basílica atual)',
    denomination: 'Ortodoxa, Católica, Armênia',
    centuryI:
      'Pequena cidade a cerca de 8 km ao sul de Jerusalém, ponto de parada para o recenseamento de César Augusto (Lucas 2).',
    curiosity:
      'A Gruta da Natividade é venerada como local do nascimento desde pelo menos o séc. II, segundo registros de Justino Mártir e Orígenes.',
    refs: [
      { abbrev: 'mq', chapter: 5, verse: 2 },
      { abbrev: 'mt', chapter: 2, verse: 1 },
      { abbrev: 'lc', chapter: 2, verse: 4 },
    ],
  },
  {
    id: 'efeso',
    name: 'Éfeso',
    region: 'Viagens de Paulo',
    city: 'Selçuk',
    country: 'Turquia',
    lat: 37.9410,
    lng: 27.3416,
    color: '#2E2418',
    about:
      'Importante cidade da Ásia Menor onde Paulo ministrou por cerca de três anos. Destinatária de uma de suas cartas.',
    today:
      'Um dos maiores sítios arqueológicos do Mediterrâneo, com a Biblioteca de Celso e um teatro para 25 mil pessoas.',
    builtYear: '—',
    denomination: 'Sítio arqueológico',
    centuryI:
      'Metrópole de cerca de 250 mil habitantes, abrigava o Templo de Ártemis, uma das sete maravilhas do mundo antigo.',
    curiosity:
      'O grande teatro de Éfeso, ainda de pé, é o cenário do tumulto dos ourives descrito em Atos 19:29.',
    refs: [
      { abbrev: 'at', chapter: 19, verse: 1 },
      { abbrev: 'ef', chapter: 1, verse: 1 },
      { abbrev: 'ap', chapter: 2, verse: 1 },
    ],
  },
  {
    id: 'corinto',
    name: 'Corinto',
    region: 'Viagens de Paulo',
    city: 'Coríntia',
    country: 'Grécia',
    lat: 37.9061,
    lng: 22.8786,
    color: '#1A2E2A',
    about:
      'Próspera cidade portuária da Grécia onde Paulo permaneceu cerca de 18 meses, fundando uma igreja influente.',
    today:
      'Sítio arqueológico da Corinto antiga, com o Templo de Apolo e a Bema — a tribuna onde Paulo foi julgado.',
    builtYear: '—',
    denomination: 'Sítio arqueológico',
    centuryI:
      'Centro comercial cosmopolita e moralmente relaxado, ligando os mares Egeu e Adriático. Destinatária de duas cartas de Paulo.',
    curiosity:
      'Uma inscrição encontrada em Corinto cita "Erasto", tesoureiro da cidade — possivelmente o mesmo nome mencionado em Romanos 16:23.',
    refs: [
      { abbrev: 'at', chapter: 18, verse: 1 },
      { abbrev: '1co', chapter: 1, verse: 2 },
    ],
  },
  {
    id: 'atenas',
    name: 'Atenas',
    region: 'Viagens de Paulo',
    city: 'Atenas',
    country: 'Grécia',
    lat: 37.9715,
    lng: 23.7267,
    color: '#24283A',
    about:
      'Capital intelectual do mundo antigo, onde Paulo discursou no Areópago sobre o "Deus desconhecido" (Atos 17).',
    today:
      'Cidade moderna que preserva a Acrópole e o Areópago (Colina de Marte), local tradicional do discurso de Paulo.',
    builtYear: '—',
    denomination: 'Sítio histórico',
    centuryI:
      'Berço da filosofia, ainda repleta de templos e altares. Epicureus e estoicos debatiam nas praças com Paulo.',
    curiosity:
      'Uma placa de bronze com o discurso de Paulo (Atos 17) está fixada na rocha do Areópago, ao pé da Acrópole, até hoje.',
    refs: [{ abbrev: 'at', chapter: 17, verse: 16 }],
  },
  {
    id: 'roma',
    name: 'Roma',
    region: 'Viagens de Paulo',
    city: 'Roma',
    country: 'Itália',
    lat: 41.9028,
    lng: 12.4964,
    color: '#3A1A1E',
    about:
      'Capital do Império, destino final das viagens de Paulo, onde ficou preso e escreveu várias epístolas.',
    today:
      'Abriga a Basílica de São Paulo Extramuros, tradicionalmente construída sobre o túmulo do apóstolo.',
    builtYear: '—',
    denomination: 'Católica',
    centuryI:
      'Maior cidade do mundo, com cerca de um milhão de habitantes. Paulo chegou como prisioneiro por volta de 60 d.C. (Atos 28).',
    curiosity:
      'Em 2006, o Vaticano anunciou a descoberta de um sarcófago sob a Basílica de São Paulo, com ossos datados dos séc. I–II.',
    refs: [
      { abbrev: 'at', chapter: 28, verse: 14 },
      { abbrev: 'rm', chapter: 1, verse: 7 },
    ],
  },
];

/** Regiões na ordem de exibição. */
export const PLACE_REGIONS = ['Jerusalém', 'Judeia', 'Galileia', 'Viagens de Paulo'];

export function getPlace(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}

/** Locais mencionados num capítulo (para o pin na leitura). */
export function placesInChapter(bookAbbrev: string, chapter: number): Place[] {
  return PLACES.filter((p) => p.refs.some((r) => r.abbrev === bookAbbrev && r.chapter === chapter));
}

/** Rótulo curto da abreviação: 'mt' -> 'Mt', '2rs' -> '2Rs', '1co' -> '1Co'. */
export function abbrevLabel(abbrev: string): string {
  const m = abbrev.match(/^(\d*)(.*)$/);
  const num = m?.[1] ?? '';
  const rest = m?.[2] ?? abbrev;
  return num + rest.charAt(0).toUpperCase() + rest.slice(1);
}

/** Formata uma referência: 'Mt 27:60'. */
export function formatRef(ref: PlaceRef): string {
  return `${abbrevLabel(ref.abbrev)} ${ref.chapter}${ref.verse ? `:${ref.verse}` : ''}`;
}
