/**
 * Conteúdo da aba Mídia — curadoria por idioma (escopo 2.6).
 *
 * Canais são referenciados pelo **ID** (`UC…`), não pelo @handle: o handle pode
 * ser trocado pelo dono ou pertencer a um homônimo, e o link abre o canal errado
 * sem dar nenhum erro. O ID nunca muda. O @handle fica no comentário só para
 * leitura humana.
 *
 * Todos os IDs de canal e de vídeo abaixo foram verificados: canal via página do
 * canal (título + externalId) e vídeo via oEmbed (título + author_name).
 *
 * Podcasts usam busca do Spotify (sempre resolve e cai no perfil do ministério);
 * quando houver integração com RSS/YouTube Data API, trocar por itens fixos.
 */
import type { Locale } from '@/store/useLocaleStore';

export type MediaTab = 'videos' | 'podcasts' | 'louvores';

export type MediaItem = {
  id: string;
  title: string; // nome do canal / programa
  author: string; // ministério ou pessoa
  meta: string; // descrição curta
  color: string;
  url: string;
};

/** Um vídeo dentro de uma playlist curada. */
export type PlaylistTrack = {
  videoId: string;
  title: string;
  author: string;
  duration: string;
};

export type Playlist = {
  id: string;
  tab: MediaTab;
  title: string;
  subtitle: string;
  color: string;
  tracks: PlaylistTrack[];
};

const ytc = (channelId: string) => `https://www.youtube.com/channel/${channelId}`;
const spotify = (q: string) => `https://open.spotify.com/search/${encodeURIComponent(q)}`;

/** Link de um vídeo — abre no app do YouTube quando instalado. */
export const videoUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;

/** Capa do vídeo. `hqdefault` existe para todo vídeo público. */
export const videoThumb = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

type LocaleMedia = {
  featured: Record<MediaTab, MediaItem>;
  items: Record<MediaTab, MediaItem[]>;
  playlists: Playlist[];
};

const EN: LocaleMedia = {
  featured: {
    videos: {
      id: 'en-f-v',
      title: 'BibleProject',
      author: 'Tim Mackie & Jon Collins',
      meta: 'Animated videos on every book of the Bible',
      color: '#1F6FEB',
      url: ytc('UCVfwlh9XpX2Y_tQfjeln9QA'), // @bibleproject
    },
    podcasts: {
      id: 'en-f-p',
      title: 'Ask Pastor John',
      author: 'Desiring God',
      meta: 'Short answers to hard questions',
      color: '#5B21B6',
      url: spotify('Ask Pastor John Desiring God'),
    },
    louvores: {
      id: 'en-f-l',
      title: 'Elevation Worship',
      author: 'Elevation Church',
      meta: 'Live worship sets',
      color: '#6D28D9',
      url: ytc('UCSf-NCzjwcnXErUBW_qeFvA'), // @elevationworship
    },
  },
  items: {
    videos: [
      { id: 'en-v1', title: 'Desiring God', author: 'John Piper', meta: 'Sermons & theology', color: '#3730A3', url: ytc('UCnrFlpro0xfYjz6s5Xa8WWw') },
      { id: 'en-v2', title: 'Ligonier Ministries', author: 'R.C. Sproul', meta: 'Reformed teaching', color: '#4C1D95', url: ytc('UCut8939DdQsJI3Gw1ziAc4w') },
      { id: 'en-v3', title: 'The Gospel Coalition', author: 'TGC', meta: 'Bible & culture', color: '#312E81', url: ytc('UCQMwm-DeHyFK5VPp6KySR5Q') },
      { id: 'en-v4', title: 'Got Questions', author: 'GotQuestions.org', meta: 'Bible answers', color: '#1E3A8A', url: ytc('UCrHADU8H0P2Q_79sAhYjlGA') },
    ],
    podcasts: [
      { id: 'en-p1', title: 'The BibleProject Podcast', author: 'BibleProject', meta: 'Deep dives into Scripture', color: '#1F6FEB', url: spotify('BibleProject podcast') },
      { id: 'en-p2', title: 'Renewing Your Mind', author: 'Ligonier', meta: 'Daily teaching', color: '#4C1D95', url: spotify('Renewing Your Mind Ligonier') },
      { id: 'en-p3', title: 'TGC Podcast', author: 'The Gospel Coalition', meta: 'Talks & interviews', color: '#312E81', url: spotify('The Gospel Coalition podcast') },
    ],
    louvores: [
      { id: 'en-l1', title: 'Hillsong Worship', author: 'Hillsong', meta: 'Worship', color: '#4338CA', url: ytc('UC4q12NoPNySbVqwpw4iO5Vg') },
      { id: 'en-l2', title: 'Bethel Music', author: 'Bethel', meta: 'Worship', color: '#5B21B6', url: ytc('UCbertc-gMbkkHuSmg0qwnxw') },
      { id: 'en-l3', title: 'Passion Music', author: 'Passion', meta: 'Worship', color: '#6D28D9', url: ytc('UCsh-HOmo0Fk_5uq1kut8dWw') },
      { id: 'en-l4', title: 'Elevation Worship', author: 'Elevation', meta: 'Worship', color: '#7C3AED', url: ytc('UCSf-NCzjwcnXErUBW_qeFvA') },
    ],
  },
  playlists: [
    {
      id: 'en-worship-now',
      tab: 'louvores',
      title: "Today's Worship",
      subtitle: 'The songs the church is singing right now',
      color: '#6D28D9',
      tracks: [
        { videoId: 'nQWFzMvCfLE', title: 'What A Beautiful Name', author: 'Hillsong Worship', duration: '5:43' },
        { videoId: 'mC-zw0zCCtg', title: 'Jireh', author: 'Elevation Worship & Maverick City', duration: '9:59' },
        { videoId: 'q5m09rqOoxE', title: 'Promises', author: 'Maverick City Music', duration: '10:50' },
        { videoId: 'lKw6uqtGFfo', title: 'Who You Say I Am', author: 'Hillsong Worship', duration: '5:35' },
        { videoId: 'UGFCbmvk0vo', title: 'Refiner', author: 'Maverick City Music', duration: '12:14' },
        { videoId: '_fY3l9AKPa0', title: 'Touch of Heaven', author: 'Bethel Music · David Funk', duration: '23:16' },
        { videoId: 'dNSo9MKYy0c', title: 'Anywhere Sessions | Living Room', author: 'Elevation Worship', duration: '33:54' },
        { videoId: 'frOIAn43v4o', title: 'Hymn of Heaven (Acoustic Sessions)', author: 'Phil Wickham', duration: '56:04' },
      ],
    },
    {
      id: 'en-messages',
      tab: 'videos',
      title: 'Sermons & Bible Teaching',
      subtitle: 'Messages worth your whole lunch break',
      color: '#1F6FEB',
      tracks: [
        { videoId: 'G-2e9mMf7E8', title: 'Gospel of John — Overview (Part 1)', author: 'BibleProject', duration: '8:46' },
        { videoId: 'RUfh_wOsauk', title: 'Gospel of John — Overview (Part 2)', author: 'BibleProject', duration: '8:32' },
        { videoId: 'XgslCbXOOIE', title: 'What It Means for Jesus to Be the "Word of God"', author: 'BibleProject', duration: '6:42' },
        { videoId: '-cRkUt4glaE', title: "John Piper's Journey to Joy", author: 'Desiring God', duration: '27:31' },
        { videoId: 'W6NjAG4qp4M', title: 'What to Do When Your Spirits Sink', author: 'Desiring God', duration: '42:55' },
        { videoId: 'TSDuiULbFf4', title: 'Holiness and Justice', author: 'Ligonier · R.C. Sproul', duration: '32:56' },
      ],
    },
  ],
};

const PT: LocaleMedia = {
  featured: {
    videos: {
      id: 'pt-f-v',
      title: 'Rodrigo Silva',
      author: 'Arqueologia bíblica',
      meta: 'História e evidências da Bíblia',
      color: '#8B5A2B',
      url: ytc('UCn4M9vLHegNuqM8tnL872cA'), // @RodrigoSilvaArqueologia
    },
    podcasts: {
      id: 'pt-f-p',
      title: 'Podcast Fiel',
      author: 'Ministério Fiel',
      meta: 'Teologia para o dia a dia',
      color: '#5B21B6',
      url: spotify('Ministério Fiel podcast'),
    },
    louvores: {
      id: 'pt-f-l',
      title: 'Fernandinho',
      author: 'Louvor e adoração',
      meta: 'Coletânea de louvores',
      color: '#6D28D9',
      url: ytc('UCH1U29foC-5RyAa4ZgkuQYA'), // @fernandinho
    },
  },
  items: {
    videos: [
      { id: 'pt-v1', title: 'JesusCopy', author: 'Douglas Gonçalves', meta: 'Mensagens e conferências', color: '#3730A3', url: ytc('UC-lB2nyJ4lZXTgFoJ8bxh0A') },
      { id: 'pt-v2', title: 'Paulo Borges JR', author: 'Pregação e ensino', meta: 'Mensagens bíblicas', color: '#4C1D95', url: ytc('UCuq-2yQBHcK6Ci5qYPByO1A') },
      { id: 'pt-v3', title: 'Dênio Lara Jr.', author: 'Pregação', meta: 'Mensagens e pregações', color: '#312E81', url: ytc('UCPfHRPh0FPvhBd7IbOh57Vg') },
      { id: 'pt-v4', title: 'Hernandes Dias Lopes', author: 'Pregação expositiva', meta: 'Estudos por livro', color: '#1E3A8A', url: ytc('UCT8yKUrnFmq5COl15dasxog') },
      { id: 'pt-v5', title: 'Augustus Nicodemus', author: 'Teólogo presbiteriano', meta: 'Exposição bíblica', color: '#4338CA', url: ytc('UCjo1duewku1EhP50BllP8yg') },
      { id: 'pt-v6', title: 'Voltemos ao Evangelho', author: 'TGC Brasil', meta: 'Teologia e vida cristã', color: '#5B21B6', url: ytc('UCQwdPialaxZsptRQXq8N6fQ') },
      { id: 'pt-v7', title: 'Ministério Fiel', author: 'Editora Fiel', meta: 'Conferências e estudos', color: '#6D28D9', url: ytc('UCj2mZx3rVo6jvChAFZpm98Q') },
    ],
    podcasts: [
      { id: 'pt-p1', title: 'Voltemos ao Evangelho', author: 'TGC Brasil', meta: 'Episódios semanais', color: '#4C1D95', url: spotify('Voltemos ao Evangelho') },
      { id: 'pt-p2', title: 'Café Teológico', author: 'Teologia em conversa', meta: 'Bate-papo teológico', color: '#6D28D9', url: spotify('café teológico') },
      { id: 'pt-p3', title: 'Bíblia em 1 ano', author: 'Devocional diário', meta: 'Leitura guiada', color: '#312E81', url: spotify('Bíblia em 1 ano') },
    ],
    louvores: [
      { id: 'pt-l1', title: 'Fernandinho', author: 'Louvor', meta: 'Adoração', color: '#4338CA', url: ytc('UCH1U29foC-5RyAa4ZgkuQYA') },
      { id: 'pt-l2', title: 'Morada', author: 'Banda Morada', meta: 'Adoração', color: '#5B21B6', url: ytc('UCQp4yrRCGdGWi4TrF6xJyfg') },
      { id: 'pt-l3', title: 'Gabriela Rocha', author: 'Louvor', meta: 'Adoração', color: '#6D28D9', url: ytc('UC4t2mdI8uAiJDJSRjiWJT1Q') },
      { id: 'pt-l4', title: 'Isaias Saad', author: 'Louvor', meta: 'Adoração', color: '#7C3AED', url: ytc('UCxaYdMYNsCBJcFE9NicmVYg') },
      { id: 'pt-l5', title: 'CASA Worship', author: 'Louvor', meta: 'Adoração', color: '#4338CA', url: ytc('UC8JmlV43Vtjtuhba8VT_FCg') },
      { id: 'pt-l6', title: 'Ministério Zoe', author: 'Vida de Deus', meta: 'Adoração', color: '#5B21B6', url: ytc('UCa-AC7YhCP5u5yO5aNjKjoA') },
    ],
  },
  playlists: [
    {
      id: 'pt-louvores-atualidade',
      tab: 'louvores',
      title: 'Louvores da Atualidade',
      subtitle: 'O que a igreja está cantando agora',
      color: '#6D28D9',
      tracks: [
        { videoId: 'mZ9yZYo9Mmk', title: 'Bondade de Deus (Ao Vivo)', author: 'Isaias Saad', duration: '6:15' },
        { videoId: '5QHF5OQeFOs', title: 'A Casa É Sua', author: 'CASA Worship · Julliany Souza', duration: '9:22' },
        { videoId: 'Z6cONvRUFZQ', title: 'Me Atraiu (Ao Vivo)', author: 'Gabriela Rocha', duration: '8:28' },
        { videoId: 'ePdRgBWhvog', title: 'É Tudo Sobre Você', author: 'MORADA', duration: '8:28' },
        { videoId: 'u2FOGNSJfX8', title: 'Santo Pra Sempre (Ao Vivo no Mineirão)', author: 'Fernandinho', duration: '6:50' },
        { videoId: 'k7tGP-vidwc', title: 'Vitorioso És', author: 'Gabriel Guedes', duration: '5:48' },
        { videoId: '0ZF5em0MTwY', title: 'Quem É Esse? (Ao Vivo)', author: 'Julliany Souza', duration: '9:31' },
        { videoId: '7GWZwO0MdsY', title: 'Sublime (Ao Vivo)', author: 'fhop music', duration: '9:41' },
        { videoId: '3tmA3dboV0I', title: 'No Silêncio', author: 'Ministério Zoe', duration: '5:07' },
        { videoId: 'wSKKEAnLTDw', title: 'Ousado Amor', author: 'Isaias Saad', duration: '5:37' },
        { videoId: 'SFiu3KLNd34', title: 'Eu Te Vejo Em Tudo', author: 'CASA Worship', duration: '5:47' },
        { videoId: 'V-n0FDCT2N4', title: 'Oh Quão Lindo Esse Nome É', author: 'Kemuel', duration: '5:17' },
      ],
    },
    {
      id: 'pt-pregacoes',
      tab: 'videos',
      title: 'Pregações e Mensagens',
      subtitle: 'JesusCopy, Paulo Borges JR e Dênio Lara Jr.',
      color: '#1E3A8A',
      tracks: [
        { videoId: 'xXNhS5p14ts', title: 'Cansei de Ser Eu', author: 'JesusCopy · Douglas Gonçalves', duration: '51:39' },
        { videoId: 'reVr5QE4ZIA', title: 'O Pior Culto da História: "Só Tinha Cristo!"', author: 'Dênio Lara Jr.', duration: '1:00:55' },
        { videoId: 'pib1buo5-3E', title: 'Transformação de Entendimento', author: 'Paulo Borges JR', duration: '48:37' },
        { videoId: 'TqQ5tzJQsKw', title: 'Como Ter Amigos', author: 'JesusCopy · Douglas Gonçalves', duration: '48:16' },
        { videoId: 'S4b8wRxymwg', title: 'O Que Realmente Satisfaz', author: 'Dênio Lara Jr.', duration: '1:03:48' },
        { videoId: '6ikdg5x2i8M', title: 'O Serviço e a Relação à Luz da Bíblia', author: 'Paulo Borges JR', duration: '22:08' },
        { videoId: 'nDlaMGN7Ob8', title: 'O Consolador Está com Você', author: 'JesusCopy · Douglas Gonçalves', duration: '53:17' },
        { videoId: '_crgXSqanl4', title: 'Onde o Pão Parte, Cristo Aparece', author: 'Dênio Lara Jr.', duration: '54:23' },
        { videoId: '4WK8zgh63gM', title: 'Tudo Muda Quando Ele Habita em Nós', author: 'Família JesusCopy', duration: '53:56' },
        { videoId: 'Yv_g689VCeY', title: 'Cristo é Suficiente', author: 'Dênio Lara Jr. · Família JesusCopy', duration: '53:52' },
      ],
    },
  ],
};

const ES: LocaleMedia = {
  featured: {
    videos: {
      id: 'es-f-v',
      title: 'BITE',
      author: 'Bible Project en español',
      meta: 'Videos animados de la Biblia',
      color: '#1F6FEB',
      url: ytc('UCSkfXhOqioLNNuN6JPY6yXQ'), // @biteproject
    },
    podcasts: {
      id: 'es-f-p',
      title: 'Coalición por el Evangelio',
      author: 'TGC en español',
      meta: 'Teología para la iglesia',
      color: '#5B21B6',
      url: spotify('Coalición por el Evangelio'),
    },
    louvores: {
      id: 'es-f-l',
      title: 'Miel San Marcos',
      author: 'Alabanza y adoración',
      meta: 'Adoración en vivo',
      color: '#6D28D9',
      url: ytc('UC0KvzOWr83tdsdQWUsuf3Hw'), // @mielsanmarcos
    },
  },
  items: {
    videos: [
      { id: 'es-v1', title: 'Coalición por el Evangelio', author: 'TGC', meta: 'Biblia y cultura', color: '#3730A3', url: ytc('UCE-h4u-c1S3fZ6CBRTDmhaA') },
      { id: 'es-v2', title: 'Ministerios Ligonier', author: 'R.C. Sproul', meta: 'Enseñanza reformada', color: '#4C1D95', url: ytc('UCIqFZA7eSwssu9S5TbND5-A') },
      { id: 'es-v3', title: 'Grace en Español', author: 'John MacArthur', meta: 'Predicación expositiva', color: '#312E81', url: ytc('UCcSP9qgYaRThOgjo2rTep5w') },
      { id: 'es-v4', title: 'Integridad & Sabiduría', author: 'Miguel Núñez', meta: 'Enseñanza bíblica', color: '#1E3A8A', url: ytc('UCXx5UOM8b3HBsqEJeVUS18g') },
      { id: 'es-v5', title: 'Iglesia Bíblica del Señor Jesucristo', author: 'Sugel Michelén', meta: 'Exposición bíblica', color: '#4338CA', url: ytc('UCzmgV3CveQKcT2xLyZYS7ew') },
      { id: 'es-v6', title: 'BITE', author: 'BibleProject', meta: 'Videos animados', color: '#5B21B6', url: ytc('UCSkfXhOqioLNNuN6JPY6yXQ') },
    ],
    podcasts: [
      { id: 'es-p1', title: 'Coalición Podcast', author: 'TGC en español', meta: 'Conversaciones y enseñanza', color: '#4C1D95', url: spotify('Coalición por el Evangelio podcast') },
      { id: 'es-p2', title: 'Renovando tu Mente', author: 'Ligonier', meta: 'Enseñanza diaria', color: '#312E81', url: spotify('Renovando tu mente Ligonier') },
      { id: 'es-p3', title: 'La Biblia en un año', author: 'Devocional', meta: 'Lectura guiada', color: '#6D28D9', url: spotify('La Biblia en un año') },
    ],
    louvores: [
      { id: 'es-l1', title: 'Miel San Marcos', author: 'Alabanza', meta: 'Adoración', color: '#4338CA', url: ytc('UC0KvzOWr83tdsdQWUsuf3Hw') },
      { id: 'es-l2', title: 'Marcos Witt', author: 'Alabanza', meta: 'Adoración', color: '#5B21B6', url: ytc('UCD_gOHOuDqEbZfwzrk18pxQ') },
      { id: 'es-l3', title: 'Generación 12', author: 'Alabanza', meta: 'Adoración', color: '#6D28D9', url: ytc('UCZq1DNdEdpmuN8LRSYQoyXg') },
      { id: 'es-l4', title: 'Marco Barrientos', author: 'Alabanza', meta: 'Adoración', color: '#7C3AED', url: ytc('UCsS3FSQkwOR_eMSdF9VIHpQ') },
      { id: 'es-l5', title: 'Averly Morillo', author: 'Alabanza', meta: 'Adoración', color: '#4338CA', url: ytc('UCZ-fOXpL8LmV0wlC-QTNgZA') },
      { id: 'es-l6', title: 'Un Corazón', author: 'Alabanza', meta: 'Adoración', color: '#5B21B6', url: ytc('UCviQBmOy6buW21sypQ06WLA') },
    ],
  },
  playlists: [
    {
      id: 'es-alabanza-actual',
      tab: 'louvores',
      title: 'Alabanzas de Hoy',
      subtitle: 'Lo que la iglesia está cantando ahora',
      color: '#6D28D9',
      tracks: [
        { videoId: '7b9z-YcDUrc', title: 'Mesías', author: 'Averly Morillo', duration: '12:25' },
        { videoId: 'Pn-PqlB_K4M', title: 'Quiero Conocer A Jesús (Yeshua)', author: 'Generación 12', duration: '11:54' },
        { videoId: 'GCtdFoq1dLg', title: 'Babel', author: 'Un Corazón', duration: '5:03' },
        { videoId: 'S3Cn0aaV2sY', title: 'Tuyo es el Reino / ¿Quién Podrá?', author: 'Averly Morillo', duration: '13:17' },
        { videoId: 'GA69Q-aTlVc', title: 'Dios Incomparable', author: 'Generación 12 · Marco Barrientos', duration: '15:44' },
        { videoId: 'y3tyQqjS4qY', title: 'Vuelvo A Casa', author: 'Generación 12 · Maverick City', duration: '14:08' },
        { videoId: 'Ofq9bxEVwPU', title: 'Pentecostés (Concierto completo)', author: 'Miel San Marcos', duration: '1:46:43' },
        { videoId: 'ykxzVXqNU9o', title: 'Exaltado (En vivo desde CDMX)', author: 'Marco Barrientos', duration: '1:55:31' },
      ],
    },
    {
      id: 'es-predicaciones',
      tab: 'videos',
      title: 'Predicaciones y Enseñanza',
      subtitle: 'Mensajes bíblicos para profundizar',
      color: '#1E3A8A',
      tracks: [
        { videoId: '4WZQaAmu3ng', title: 'Líderes sanos para iglesias sanas', author: 'Miguel Núñez · Coalición', duration: '1:17:45' },
        { videoId: 'c0-3V64qyvs', title: 'El evangelio y el evangelismo en el siglo XXI', author: 'Coalición por el Evangelio', duration: '43:18' },
        { videoId: 'zdtbRzRIpZg', title: '¿Cuál es tu motivación detrás del trabajo?', author: 'Sugel Michelén · Coalición', duration: '23:27' },
        { videoId: 'b4BDwbN-B8k', title: 'Job: Del polvo a la gloria', author: 'Ministerios Ligonier · R.C. Sproul', duration: '26:46' },
        { videoId: 'Lcl3OMroe2M', title: 'Ángeles y demonios', author: 'Ministerios Ligonier · R.C. Sproul', duration: '23:43' },
        { videoId: 'twgsPhT5FiI', title: 'Por qué no podemos escoger a Dios', author: 'Ministerios Ligonier', duration: '3:33' },
      ],
    },
  ],
};

const BY_LOCALE: Record<Locale, LocaleMedia> = { en: EN, pt: PT, es: ES };

export function mediaForLocale(locale: Locale): LocaleMedia {
  return BY_LOCALE[locale] ?? EN;
}

/** Playlists da aba atual, no idioma do usuário. */
export function playlistsForTab(locale: Locale, tab: MediaTab): Playlist[] {
  return mediaForLocale(locale).playlists.filter((p) => p.tab === tab);
}

export function getPlaylist(locale: Locale, id: string): Playlist | undefined {
  return mediaForLocale(locale).playlists.find((p) => p.id === id);
}
