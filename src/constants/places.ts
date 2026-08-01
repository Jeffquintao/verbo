/**
 * Locais históricos bíblicos (curadoria própria). Recurso Premium (escopo 2.3).
 *
 * Os dados geográficos (coordenadas, cor, referências bíblicas) são
 * compartilhados; os textos existem nos três idiomas do app.
 * `refs` liga o local aos capítulos onde ele é mencionado (pin na leitura).
 */
import type { Locale } from '@/store/useLocaleStore';

export type PlaceRef = { abbrev: string; chapter: number; verse?: number };

export type PlaceRegion = 'jerusalem' | 'judea' | 'galilee' | 'paul';

/** Textos de um local em um idioma. */
type PlaceText = {
  name: string;
  city: string;
  country: string;
  about: string;
  today: string;
  centuryI: string;
  curiosity: string;
  denomination?: string;
};

type PlaceEntry = {
  id: string;
  region: PlaceRegion;
  lat: number;
  lng: number;
  color: string;
  builtYear?: string;
  refs: PlaceRef[];
  en: PlaceText;
  pt: PlaceText;
  es: PlaceText;
};

/** Local já resolvido no idioma atual (o que a UI consome). */
export type Place = {
  id: string;
  region: PlaceRegion;
  lat: number;
  lng: number;
  color: string;
  builtYear?: string;
  refs: PlaceRef[];
} & PlaceText;

const ENTRIES: PlaceEntry[] = [
  {
    id: 'santo-sepulcro',
    region: 'jerusalem',
    lat: 31.7784,
    lng: 35.2297,
    color: '#4A3B1A',
    builtYear: '335 AD',
    refs: [
      { abbrev: 'mt', chapter: 27, verse: 60 },
      { abbrev: 'mc', chapter: 15, verse: 46 },
      { abbrev: 'lc', chapter: 23, verse: 53 },
      { abbrev: 'jo', chapter: 19, verse: 41 },
      { abbrev: 'jo', chapter: 20, verse: 1 },
    ],
    en: {
      name: 'Church of the Holy Sepulchre',
      city: 'Jerusalem',
      country: 'Israel',
      denomination: '6 Christian churches',
      about:
        'Held to be the site of the crucifixion, burial and resurrection of Jesus. The present church was built in the 4th century by order of Emperor Constantine.',
      today:
        'Today it is one of the most visited churches in the world, shared by six Christian denominations. It contains Calvary and the Edicule (the tomb).',
      centuryI:
        'In the 1st century the site lay outside the walls of Jerusalem — an abandoned quarry used as a garden and burial ground, matching the description in John 19:41.',
      curiosity:
        'Excavations in 2016 confirmed that the stone slab beneath the Edicule dates to the 1st century, consistent with the time of Jesus.',
    },
    pt: {
      name: 'Igreja do Santo Sepulcro',
      city: 'Jerusalém',
      country: 'Israel',
      denomination: '6 igrejas cristãs',
      about:
        'Considerada o local da crucificação, sepultamento e ressurreição de Jesus. A igreja atual foi construída no séc. IV por ordem do imperador Constantino.',
      today:
        'Hoje é uma das igrejas mais visitadas do mundo, compartilhada por seis denominações cristãs. Abriga o Calvário e a Edícula (o túmulo).',
      centuryI:
        'No séc. I, o local ficava fora dos muros de Jerusalém — uma pedreira abandonada usada como jardim e área de sepultamentos, condizente com a descrição de João 19:41.',
      curiosity:
        'Escavações de 2016 confirmaram que a laje de pedra sob a Edícula data do séc. I, consistente com o período de Jesus.',
    },
    es: {
      name: 'Iglesia del Santo Sepulcro',
      city: 'Jerusalén',
      country: 'Israel',
      denomination: '6 iglesias cristianas',
      about:
        'Considerada el lugar de la crucifixión, sepultura y resurrección de Jesús. La iglesia actual fue construida en el siglo IV por orden del emperador Constantino.',
      today:
        'Hoy es una de las iglesias más visitadas del mundo, compartida por seis denominaciones cristianas. Alberga el Calvario y la Edícula (el sepulcro).',
      centuryI:
        'En el siglo I el lugar estaba fuera de las murallas de Jerusalén: una cantera abandonada usada como huerto y zona de sepulturas, tal como describe Juan 19:41.',
      curiosity:
        'Las excavaciones de 2016 confirmaron que la losa de piedra bajo la Edícula data del siglo I, coherente con la época de Jesús.',
    },
  },
  {
    id: 'getsemani',
    region: 'jerusalem',
    lat: 31.7794,
    lng: 35.2396,
    color: '#1E3A24',
    builtYear: '1924 AD',
    refs: [
      { abbrev: 'mt', chapter: 26, verse: 36 },
      { abbrev: 'mc', chapter: 14, verse: 32 },
      { abbrev: 'jo', chapter: 18, verse: 1 },
    ],
    en: {
      name: 'Garden of Gethsemane',
      city: 'Jerusalem',
      country: 'Israel',
      denomination: 'Franciscans',
      about:
        'A garden at the foot of the Mount of Olives where Jesus prayed on the night he was arrested. The name means "oil press" in Aramaic.',
      today:
        'It holds ancient olive trees and the Church of All Nations. Some of the trees are among the oldest in the world.',
      centuryI:
        'It was an olive grove with an oil press, a quiet place where Jesus often met with his disciples (Luke 22:39).',
      curiosity:
        'Carbon-14 studies indicate that three of the olive trees in the garden have roots more than 900 years old, and may descend from trees of the 1st century.',
    },
    pt: {
      name: 'Jardim do Getsêmani',
      city: 'Jerusalém',
      country: 'Israel',
      denomination: 'Franciscanos',
      about:
        'Jardim ao pé do Monte das Oliveiras onde Jesus orou na noite em que foi preso. O nome significa "prensa de azeite" em aramaico.',
      today:
        'Abriga oliveiras milenares e a Igreja de Todas as Nações. Algumas das árvores estão entre as mais antigas do mundo.',
      centuryI:
        'Era um pomar de oliveiras com uma prensa de azeite, lugar tranquilo onde Jesus costumava se reunir com os discípulos (Lucas 22:39).',
      curiosity:
        'Estudos de carbono-14 indicam que três das oliveiras do jardim têm raízes com mais de 900 anos, e podem descender de árvores do séc. I.',
    },
    es: {
      name: 'Huerto de Getsemaní',
      city: 'Jerusalén',
      country: 'Israel',
      denomination: 'Franciscanos',
      about:
        'Huerto al pie del Monte de los Olivos donde Jesús oró la noche en que fue arrestado. El nombre significa «prensa de aceite» en arameo.',
      today:
        'Alberga olivos milenarios y la Iglesia de Todas las Naciones. Algunos de los árboles están entre los más antiguos del mundo.',
      centuryI:
        'Era un olivar con una prensa de aceite, un lugar tranquilo donde Jesús solía reunirse con sus discípulos (Lucas 22:39).',
      curiosity:
        'Estudios de carbono-14 indican que tres de los olivos del huerto tienen raíces de más de 900 años y podrían descender de árboles del siglo I.',
    },
  },
  {
    id: 'monte-oliveiras',
    region: 'jerusalem',
    lat: 31.7784,
    lng: 35.2461,
    color: '#2A2540',
    refs: [
      { abbrev: 'zc', chapter: 14, verse: 4 },
      { abbrev: 'mt', chapter: 24, verse: 3 },
      { abbrev: 'at', chapter: 1, verse: 12 },
    ],
    en: {
      name: 'Mount of Olives',
      city: 'Jerusalem',
      country: 'Israel',
      denomination: 'Several shrines',
      about:
        'A ridge east of Jerusalem, the setting for Jesus\' teaching, the ascension and messianic prophecies.',
      today:
        'It offers the classic view of the Old City and holds one of the oldest Jewish cemeteries still in use.',
      centuryI:
        'It was the natural route between Jerusalem and Bethany. From there Jesus looked over the city and prophesied about it (Luke 19:41).',
      curiosity:
        'Zechariah 14:4 prophesies that the Messiah will set his feet on the Mount of Olives — one reason for the enormous Jewish cemetery on the site.',
    },
    pt: {
      name: 'Monte das Oliveiras',
      city: 'Jerusalém',
      country: 'Israel',
      denomination: 'Vários santuários',
      about:
        'Elevação a leste de Jerusalém, cenário de ensinamentos de Jesus, da ascensão e de profecias messiânicas.',
      today:
        'Oferece a vista clássica da Cidade Velha. Abriga um dos cemitérios judaicos mais antigos em uso contínuo.',
      centuryI:
        'Caminho natural entre Jerusalém e Betânia. Dali Jesus contemplou a cidade e profetizou sobre ela (Lucas 19:41).',
      curiosity:
        'Zacarias 14:4 profetiza que o Messias poria os pés sobre o Monte das Oliveiras — uma das razões do enorme cemitério judaico no local.',
    },
    es: {
      name: 'Monte de los Olivos',
      city: 'Jerusalén',
      country: 'Israel',
      denomination: 'Varios santuarios',
      about:
        'Elevación al este de Jerusalén, escenario de enseñanzas de Jesús, de la ascensión y de profecías mesiánicas.',
      today:
        'Ofrece la vista clásica de la Ciudad Vieja y alberga uno de los cementerios judíos más antiguos en uso continuo.',
      centuryI:
        'Era el camino natural entre Jerusalén y Betania. Desde allí Jesús contempló la ciudad y profetizó sobre ella (Lucas 19:41).',
      curiosity:
        'Zacarías 14:4 profetiza que el Mesías pondrá sus pies sobre el Monte de los Olivos, una de las razones del enorme cementerio judío en el lugar.',
    },
  },
  {
    id: 'mar-galileia',
    region: 'galilee',
    lat: 32.8331,
    lng: 35.5903,
    color: '#0E2A38',
    refs: [
      { abbrev: 'mt', chapter: 4, verse: 18 },
      { abbrev: 'mc', chapter: 1, verse: 16 },
      { abbrev: 'jo', chapter: 6, verse: 1 },
    ],
    en: {
      name: 'Sea of Galilee',
      city: 'Tiberias',
      country: 'Israel',
      about:
        'A large freshwater lake, the setting for much of Jesus\' ministry: the call of the fishermen, miracles and teaching.',
      today:
        "Israel's main freshwater reservoir. Its shores hold sites such as Capernaum, Magdala and the Mount of Beatitudes.",
      centuryI:
        'It was the centre of a thriving fishing industry. Towns such as Capernaum and Bethsaida lived from fishing, the trade of several disciples.',
      curiosity:
        'In 1986 a drought revealed the "Jesus Boat": a 1st-century fishing boat, 8 m long, preserved in the mud of the shore.',
    },
    pt: {
      name: 'Mar da Galileia',
      city: 'Tiberíades',
      country: 'Israel',
      about:
        'Grande lago de água doce, palco de boa parte do ministério de Jesus: a chamada dos pescadores, milagres e ensinamentos.',
      today:
        'Principal reservatório de água doce de Israel. Suas margens reúnem sítios como Cafarnaum, Magdala e o Monte das Bem-aventuranças.',
      centuryI:
        'Centro de uma próspera indústria pesqueira. Cidades como Cafarnaum e Betsaida viviam da pesca, ofício de vários discípulos.',
      curiosity:
        'Em 1986, uma seca revelou o "Barco de Jesus": um barco de pesca do séc. I, com 8m, preservado na lama da margem.',
    },
    es: {
      name: 'Mar de Galilea',
      city: 'Tiberíades',
      country: 'Israel',
      about:
        'Gran lago de agua dulce, escenario de buena parte del ministerio de Jesús: el llamado de los pescadores, milagros y enseñanzas.',
      today:
        'Principal reserva de agua dulce de Israel. En sus orillas se encuentran sitios como Capernaúm, Magdala y el Monte de las Bienaventuranzas.',
      centuryI:
        'Centro de una próspera industria pesquera. Ciudades como Capernaúm y Betsaida vivían de la pesca, oficio de varios discípulos.',
      curiosity:
        'En 1986 una sequía reveló la «Barca de Jesús»: una barca de pesca del siglo I, de 8 m, conservada en el lodo de la orilla.',
    },
  },
  {
    id: 'nazare',
    region: 'galilee',
    lat: 32.7019,
    lng: 35.2978,
    color: '#3A1E40',
    builtYear: '1969 AD',
    refs: [
      { abbrev: 'lc', chapter: 1, verse: 26 },
      { abbrev: 'mt', chapter: 2, verse: 23 },
      { abbrev: 'lc', chapter: 4, verse: 16 },
    ],
    en: {
      name: 'Nazareth',
      city: 'Nazareth',
      country: 'Israel',
      denomination: 'Catholic',
      about:
        'The Galilean village where Jesus grew up. So modest that it prompted the question: "Can anything good come out of Nazareth?" (John 1:46).',
      today:
        'The largest Arab city in Israel. It holds the Basilica of the Annunciation, one of the largest churches in the Middle East.',
      centuryI:
        'A small farming village of perhaps 200–400 people, with no political or religious importance.',
      curiosity:
        'In 2009 archaeologists found a 1st-century house in Nazareth — the first concrete evidence of dwellings in the village in the time of Jesus.',
    },
    pt: {
      name: 'Nazaré',
      city: 'Nazaré',
      country: 'Israel',
      denomination: 'Católica',
      about:
        'Vila da Galileia onde Jesus cresceu. Tão modesta que gerou a pergunta: "De Nazaré pode vir algo de bom?" (João 1:46).',
      today:
        'Maior cidade árabe de Israel. Abriga a Basílica da Anunciação, uma das maiores igrejas do Oriente Médio.',
      centuryI:
        'Pequeno povoado agrícola de talvez 200–400 habitantes, sem grande importância política ou religiosa.',
      curiosity:
        'Em 2009 arqueólogos encontraram em Nazaré uma casa do séc. I — a primeira evidência concreta de habitação na vila no tempo de Jesus.',
    },
    es: {
      name: 'Nazaret',
      city: 'Nazaret',
      country: 'Israel',
      denomination: 'Católica',
      about:
        'Aldea de Galilea donde creció Jesús. Tan modesta que provocó la pregunta: «¿De Nazaret puede salir algo bueno?» (Juan 1:46).',
      today:
        'La mayor ciudad árabe de Israel. Alberga la Basílica de la Anunciación, una de las iglesias más grandes de Oriente Medio.',
      centuryI:
        'Pequeño poblado agrícola de tal vez 200–400 habitantes, sin gran importancia política ni religiosa.',
      curiosity:
        'En 2009 los arqueólogos encontraron en Nazaret una casa del siglo I: la primera evidencia concreta de vivienda en la aldea en tiempos de Jesús.',
    },
  },
  {
    id: 'cafarnaum',
    region: 'galilee',
    lat: 32.8807,
    lng: 35.5752,
    color: '#1A2E3A',
    refs: [
      { abbrev: 'mt', chapter: 4, verse: 13 },
      { abbrev: 'mc', chapter: 2, verse: 1 },
      { abbrev: 'jo', chapter: 6, verse: 59 },
    ],
    en: {
      name: 'Capernaum',
      city: 'Capernaum',
      country: 'Israel',
      denomination: 'Franciscans (site)',
      about:
        'A town on the shore of the Sea of Galilee that Jesus made his base of operations. Called "his own city" (Matthew 9:1).',
      today:
        'An archaeological site with the ruins of a 4th-century synagogue and the house traditionally attributed to Peter.',
      centuryI:
        'A fishing village and customs post on the road linking Egypt to Mesopotamia. There Jesus called Matthew, the tax collector.',
      curiosity:
        'Beneath the white 4th-century synagogue, a black basalt synagogue from the 1st century was excavated — probably where Jesus taught (Mark 1:21).',
    },
    pt: {
      name: 'Cafarnaum',
      city: 'Cafarnaum',
      country: 'Israel',
      denomination: 'Franciscanos (sítio)',
      about:
        'Cidade às margens do Mar da Galileia que Jesus tornou seu centro de operações. Chamada de "a sua cidade" (Mateus 9:1).',
      today:
        'Sítio arqueológico com as ruínas de uma sinagoga do séc. IV e a casa tradicionalmente atribuída a Pedro.',
      centuryI:
        'Vila de pescadores e posto alfandegário na via que ligava o Egito à Mesopotâmia. Ali Jesus chamou Mateus, o cobrador de impostos.',
      curiosity:
        'Sob a sinagoga branca do séc. IV, escavou-se uma sinagoga de basalto negro do séc. I — provavelmente onde Jesus ensinou (Marcos 1:21).',
    },
    es: {
      name: 'Capernaúm',
      city: 'Capernaúm',
      country: 'Israel',
      denomination: 'Franciscanos (sitio)',
      about:
        'Ciudad a orillas del Mar de Galilea que Jesús convirtió en su centro de operaciones. Llamada «su ciudad» (Mateo 9:1).',
      today:
        'Sitio arqueológico con las ruinas de una sinagoga del siglo IV y la casa tradicionalmente atribuida a Pedro.',
      centuryI:
        'Aldea de pescadores y puesto aduanero en la vía que unía Egipto con Mesopotamia. Allí Jesús llamó a Mateo, el recaudador de impuestos.',
      curiosity:
        'Bajo la sinagoga blanca del siglo IV se excavó una sinagoga de basalto negro del siglo I, probablemente donde Jesús enseñó (Marcos 1:21).',
    },
  },
  {
    id: 'rio-jordao',
    region: 'galilee',
    lat: 31.8372,
    lng: 35.5494,
    color: '#13362A',
    refs: [
      { abbrev: 'mt', chapter: 3, verse: 13 },
      { abbrev: 'mc', chapter: 1, verse: 9 },
      { abbrev: '2rs', chapter: 5, verse: 14 },
    ],
    en: {
      name: 'Jordan River',
      city: 'Jordan Valley',
      country: 'Israel / Jordan',
      denomination: 'Several shrines',
      about:
        'The river linking the Sea of Galilee to the Dead Sea. The place where Jesus was baptised by John the Baptist.',
      today:
        'The site of Qasr el-Yahud, near Jericho, is the traditional place of the baptism and is open to pilgrims today.',
      centuryI:
        'A natural border and a place of ritual purification. John the Baptist preached and baptised on its banks.',
      curiosity:
        'The Jordan was the scene of another miracle: the healing of Naaman, the Syrian leper, who dipped seven times in its waters (2 Kings 5:14).',
    },
    pt: {
      name: 'Rio Jordão',
      city: 'Vale do Jordão',
      country: 'Israel / Jordânia',
      denomination: 'Vários santuários',
      about:
        'Rio que liga o Mar da Galileia ao Mar Morto. Local do batismo de Jesus por João Batista.',
      today:
        'O sítio de Qasr el-Yahud, perto de Jericó, é o ponto tradicional do batismo, hoje aberto a peregrinos.',
      centuryI:
        'Fronteira natural e local de purificação ritual. João Batista pregava e batizava em suas margens.',
      curiosity:
        'O Jordão já foi palco de outro milagre: a cura de Naamã, o leproso sírio, que mergulhou sete vezes em suas águas (2 Reis 5:14).',
    },
    es: {
      name: 'Río Jordán',
      city: 'Valle del Jordán',
      country: 'Israel / Jordania',
      denomination: 'Varios santuarios',
      about:
        'Río que une el Mar de Galilea con el Mar Muerto. Lugar del bautismo de Jesús por Juan el Bautista.',
      today:
        'El sitio de Qasr el-Yahud, cerca de Jericó, es el punto tradicional del bautismo, hoy abierto a los peregrinos.',
      centuryI:
        'Frontera natural y lugar de purificación ritual. Juan el Bautista predicaba y bautizaba en sus orillas.',
      curiosity:
        'El Jordán fue escenario de otro milagro: la curación de Naamán, el leproso sirio, que se sumergió siete veces en sus aguas (2 Reyes 5:14).',
    },
  },
  {
    id: 'belem',
    region: 'judea',
    lat: 31.7054,
    lng: 35.2024,
    color: '#3A2A14',
    builtYear: '565 AD',
    refs: [
      { abbrev: 'mq', chapter: 5, verse: 2 },
      { abbrev: 'mt', chapter: 2, verse: 1 },
      { abbrev: 'lc', chapter: 2, verse: 4 },
    ],
    en: {
      name: 'Bethlehem',
      city: 'Bethlehem',
      country: 'West Bank',
      denomination: 'Orthodox, Catholic, Armenian',
      about:
        'The home town of King David and the birthplace of Jesus, as prophesied in Micah 5:2.',
      today:
        'It holds the Church of the Nativity, one of the oldest continuously operating Christian churches in the world.',
      centuryI:
        'A small town about 8 km south of Jerusalem, a stop for the census of Caesar Augustus (Luke 2).',
      curiosity:
        'The Grotto of the Nativity has been venerated as the birthplace since at least the 2nd century, according to records by Justin Martyr and Origen.',
    },
    pt: {
      name: 'Belém',
      city: 'Belém',
      country: 'Cisjordânia',
      denomination: 'Ortodoxa, Católica, Armênia',
      about:
        'Cidade natal do rei Davi e local do nascimento de Jesus, conforme a profecia de Miqueias 5:2.',
      today:
        'Abriga a Basílica da Natividade, uma das igrejas cristãs mais antigas em funcionamento contínuo do mundo.',
      centuryI:
        'Pequena cidade a cerca de 8 km ao sul de Jerusalém, ponto de parada para o recenseamento de César Augusto (Lucas 2).',
      curiosity:
        'A Gruta da Natividade é venerada como local do nascimento desde pelo menos o séc. II, segundo registros de Justino Mártir e Orígenes.',
    },
    es: {
      name: 'Belén',
      city: 'Belén',
      country: 'Cisjordania',
      denomination: 'Ortodoxa, Católica, Armenia',
      about:
        'Ciudad natal del rey David y lugar del nacimiento de Jesús, según la profecía de Miqueas 5:2.',
      today:
        'Alberga la Basílica de la Natividad, una de las iglesias cristianas más antiguas en funcionamiento continuo del mundo.',
      centuryI:
        'Pequeña ciudad a unos 8 km al sur de Jerusalén, punto de parada para el censo de César Augusto (Lucas 2).',
      curiosity:
        'La Gruta de la Natividad es venerada como lugar del nacimiento desde al menos el siglo II, según registros de Justino Mártir y Orígenes.',
    },
  },
  {
    id: 'efeso',
    region: 'paul',
    lat: 37.941,
    lng: 27.3416,
    color: '#2E2418',
    refs: [
      { abbrev: 'at', chapter: 19, verse: 1 },
      { abbrev: 'ef', chapter: 1, verse: 1 },
      { abbrev: 'ap', chapter: 2, verse: 1 },
    ],
    en: {
      name: 'Ephesus',
      city: 'Selçuk',
      country: 'Turkey',
      denomination: 'Archaeological site',
      about:
        'A major city of Asia Minor where Paul ministered for about three years. The recipient of one of his letters.',
      today:
        'One of the largest archaeological sites in the Mediterranean, with the Library of Celsus and a theatre seating 25,000.',
      centuryI:
        'A metropolis of some 250,000 people, home to the Temple of Artemis, one of the seven wonders of the ancient world.',
      curiosity:
        "Ephesus' great theatre, still standing, is the setting for the riot of the silversmiths described in Acts 19:29.",
    },
    pt: {
      name: 'Éfeso',
      city: 'Selçuk',
      country: 'Turquia',
      denomination: 'Sítio arqueológico',
      about:
        'Importante cidade da Ásia Menor onde Paulo ministrou por cerca de três anos. Destinatária de uma de suas cartas.',
      today:
        'Um dos maiores sítios arqueológicos do Mediterrâneo, com a Biblioteca de Celso e um teatro para 25 mil pessoas.',
      centuryI:
        'Metrópole de cerca de 250 mil habitantes, abrigava o Templo de Ártemis, uma das sete maravilhas do mundo antigo.',
      curiosity:
        'O grande teatro de Éfeso, ainda de pé, é o cenário do tumulto dos ourives descrito em Atos 19:29.',
    },
    es: {
      name: 'Éfeso',
      city: 'Selçuk',
      country: 'Turquía',
      denomination: 'Sitio arqueológico',
      about:
        'Importante ciudad de Asia Menor donde Pablo ministró cerca de tres años. Destinataria de una de sus cartas.',
      today:
        'Uno de los mayores sitios arqueológicos del Mediterráneo, con la Biblioteca de Celso y un teatro para 25.000 personas.',
      centuryI:
        'Metrópoli de unos 250.000 habitantes, albergaba el Templo de Artemisa, una de las siete maravillas del mundo antiguo.',
      curiosity:
        'El gran teatro de Éfeso, aún en pie, es el escenario del tumulto de los plateros descrito en Hechos 19:29.',
    },
  },
  {
    id: 'corinto',
    region: 'paul',
    lat: 37.9061,
    lng: 22.8786,
    color: '#1A2E2A',
    refs: [
      { abbrev: 'at', chapter: 18, verse: 1 },
      { abbrev: '1co', chapter: 1, verse: 2 },
    ],
    en: {
      name: 'Corinth',
      city: 'Corinthia',
      country: 'Greece',
      denomination: 'Archaeological site',
      about:
        'A prosperous Greek port city where Paul stayed about 18 months, founding an influential church.',
      today:
        'The archaeological site of ancient Corinth, with the Temple of Apollo and the Bema — the platform where Paul was tried.',
      centuryI:
        'A cosmopolitan and morally lax trading centre linking the Aegean and Adriatic seas. The recipient of two of Paul\'s letters.',
      curiosity:
        'An inscription found in Corinth names "Erastus", treasurer of the city — possibly the same name mentioned in Romans 16:23.',
    },
    pt: {
      name: 'Corinto',
      city: 'Coríntia',
      country: 'Grécia',
      denomination: 'Sítio arqueológico',
      about:
        'Próspera cidade portuária da Grécia onde Paulo permaneceu cerca de 18 meses, fundando uma igreja influente.',
      today:
        'Sítio arqueológico da Corinto antiga, com o Templo de Apolo e a Bema — a tribuna onde Paulo foi julgado.',
      centuryI:
        'Centro comercial cosmopolita e moralmente relaxado, ligando os mares Egeu e Adriático. Destinatária de duas cartas de Paulo.',
      curiosity:
        'Uma inscrição encontrada em Corinto cita "Erasto", tesoureiro da cidade — possivelmente o mesmo nome mencionado em Romanos 16:23.',
    },
    es: {
      name: 'Corinto',
      city: 'Corintia',
      country: 'Grecia',
      denomination: 'Sitio arqueológico',
      about:
        'Próspera ciudad portuaria de Grecia donde Pablo permaneció cerca de 18 meses, fundando una iglesia influyente.',
      today:
        'Sitio arqueológico de la antigua Corinto, con el Templo de Apolo y la Bema, la tribuna donde Pablo fue juzgado.',
      centuryI:
        'Centro comercial cosmopolita y moralmente relajado, que unía los mares Egeo y Adriático. Destinataria de dos cartas de Pablo.',
      curiosity:
        'Una inscripción hallada en Corinto menciona a «Erasto», tesorero de la ciudad, posiblemente el mismo nombre citado en Romanos 16:23.',
    },
  },
  {
    id: 'atenas',
    region: 'paul',
    lat: 37.9715,
    lng: 23.7267,
    color: '#24283A',
    refs: [{ abbrev: 'at', chapter: 17, verse: 16 }],
    en: {
      name: 'Athens',
      city: 'Athens',
      country: 'Greece',
      denomination: 'Historical site',
      about:
        'The intellectual capital of the ancient world, where Paul spoke at the Areopagus about the "unknown God" (Acts 17).',
      today:
        'A modern city that preserves the Acropolis and the Areopagus (Mars Hill), the traditional site of Paul\'s speech.',
      centuryI:
        'The cradle of philosophy, still full of temples and altars. Epicureans and Stoics debated with Paul in its squares.',
      curiosity:
        "A bronze plaque with Paul's speech (Acts 17) is fixed to the rock of the Areopagus, at the foot of the Acropolis, to this day.",
    },
    pt: {
      name: 'Atenas',
      city: 'Atenas',
      country: 'Grécia',
      denomination: 'Sítio histórico',
      about:
        'Capital intelectual do mundo antigo, onde Paulo discursou no Areópago sobre o "Deus desconhecido" (Atos 17).',
      today:
        'Cidade moderna que preserva a Acrópole e o Areópago (Colina de Marte), local tradicional do discurso de Paulo.',
      centuryI:
        'Berço da filosofia, ainda repleta de templos e altares. Epicureus e estoicos debatiam nas praças com Paulo.',
      curiosity:
        'Uma placa de bronze com o discurso de Paulo (Atos 17) está fixada na rocha do Areópago, ao pé da Acrópole, até hoje.',
    },
    es: {
      name: 'Atenas',
      city: 'Atenas',
      country: 'Grecia',
      denomination: 'Sitio histórico',
      about:
        'Capital intelectual del mundo antiguo, donde Pablo habló en el Areópago sobre el «Dios no conocido» (Hechos 17).',
      today:
        'Ciudad moderna que conserva la Acrópolis y el Areópago (Colina de Marte), lugar tradicional del discurso de Pablo.',
      centuryI:
        'Cuna de la filosofía, aún llena de templos y altares. Epicúreos y estoicos debatían con Pablo en sus plazas.',
      curiosity:
        'Una placa de bronce con el discurso de Pablo (Hechos 17) está fijada en la roca del Areópago, al pie de la Acrópolis, hasta hoy.',
    },
  },
  {
    id: 'roma',
    region: 'paul',
    lat: 41.9028,
    lng: 12.4964,
    color: '#3A1A1E',
    refs: [
      { abbrev: 'at', chapter: 28, verse: 14 },
      { abbrev: 'rm', chapter: 1, verse: 7 },
    ],
    en: {
      name: 'Rome',
      city: 'Rome',
      country: 'Italy',
      denomination: 'Catholic',
      about:
        "The capital of the Empire and the final destination of Paul's journeys, where he was imprisoned and wrote several epistles.",
      today:
        'It holds the Basilica of Saint Paul Outside the Walls, traditionally built over the apostle\'s tomb.',
      centuryI:
        'The largest city in the world, with about a million inhabitants. Paul arrived as a prisoner around AD 60 (Acts 28).',
      curiosity:
        'In 2006 the Vatican announced the discovery of a sarcophagus beneath the Basilica of Saint Paul, with bones dated to the 1st–2nd centuries.',
    },
    pt: {
      name: 'Roma',
      city: 'Roma',
      country: 'Itália',
      denomination: 'Católica',
      about:
        'Capital do Império, destino final das viagens de Paulo, onde ficou preso e escreveu várias epístolas.',
      today:
        'Abriga a Basílica de São Paulo Extramuros, tradicionalmente construída sobre o túmulo do apóstolo.',
      centuryI:
        'Maior cidade do mundo, com cerca de um milhão de habitantes. Paulo chegou como prisioneiro por volta de 60 d.C. (Atos 28).',
      curiosity:
        'Em 2006, o Vaticano anunciou a descoberta de um sarcófago sob a Basílica de São Paulo, com ossos datados dos séc. I–II.',
    },
    es: {
      name: 'Roma',
      city: 'Roma',
      country: 'Italia',
      denomination: 'Católica',
      about:
        'Capital del Imperio y destino final de los viajes de Pablo, donde estuvo preso y escribió varias epístolas.',
      today:
        'Alberga la Basílica de San Pablo Extramuros, tradicionalmente construida sobre la tumba del apóstol.',
      centuryI:
        'La mayor ciudad del mundo, con cerca de un millón de habitantes. Pablo llegó como prisionero hacia el año 60 d.C. (Hechos 28).',
      curiosity:
        'En 2006 el Vaticano anunció el hallazgo de un sarcófago bajo la Basílica de San Pablo, con huesos datados en los siglos I–II.',
    },
  },
];

/** Regiões na ordem de exibição (o rótulo vem das traduções). */
export const PLACE_REGIONS: PlaceRegion[] = ['jerusalem', 'judea', 'galilee', 'paul'];

function resolve(entry: PlaceEntry, locale: Locale): Place {
  const text = entry[locale] ?? entry.en;
  return {
    id: entry.id,
    region: entry.region,
    lat: entry.lat,
    lng: entry.lng,
    color: entry.color,
    builtYear: entry.builtYear,
    refs: entry.refs,
    ...text,
  };
}

/** Todos os locais no idioma pedido. */
export function placesForLocale(locale: Locale): Place[] {
  return ENTRIES.map((e) => resolve(e, locale));
}

export function getPlace(id: string, locale: Locale): Place | undefined {
  const entry = ENTRIES.find((p) => p.id === id);
  return entry ? resolve(entry, locale) : undefined;
}

/** Locais mencionados num capítulo (para o pin na leitura). */
export function placesInChapter(bookAbbrev: string, chapter: number, locale: Locale): Place[] {
  return ENTRIES.filter((p) =>
    p.refs.some((r) => r.abbrev === bookAbbrev && r.chapter === chapter),
  ).map((e) => resolve(e, locale));
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
