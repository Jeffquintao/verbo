/**
 * Conteúdo da aba Mídia — curadoria de canais por idioma (escopo 2.6).
 *
 * Os canais do YouTube abaixo foram verificados (handle resolve com HTTP 200).
 * Ao trocar o idioma do app, o usuário vê os canais daquela língua.
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

const yt = (handle: string) => `https://www.youtube.com/@${handle}`;
const spotify = (q: string) => `https://open.spotify.com/search/${encodeURIComponent(q)}`;

type LocaleMedia = {
  featured: Record<MediaTab, MediaItem>;
  items: Record<MediaTab, MediaItem[]>;
};

const EN: LocaleMedia = {
  featured: {
    videos: {
      id: 'en-f-v',
      title: 'BibleProject',
      author: 'Tim Mackie & Jon Collins',
      meta: 'Animated videos on every book of the Bible',
      color: '#1F6FEB',
      url: yt('bibleproject'),
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
      url: yt('elevationworship'),
    },
  },
  items: {
    videos: [
      { id: 'en-v1', title: 'Desiring God', author: 'John Piper', meta: 'Sermons & theology', color: '#3730A3', url: yt('desiringGod') },
      { id: 'en-v2', title: 'Ligonier Ministries', author: 'R.C. Sproul', meta: 'Reformed teaching', color: '#4C1D95', url: yt('ligonier') },
      { id: 'en-v3', title: 'The Gospel Coalition', author: 'TGC', meta: 'Bible & culture', color: '#312E81', url: yt('TheGospelCoalition') },
      { id: 'en-v4', title: 'Got Questions', author: 'GotQuestions.org', meta: 'Bible answers', color: '#1E3A8A', url: yt('gotquestions') },
    ],
    podcasts: [
      { id: 'en-p1', title: 'The BibleProject Podcast', author: 'BibleProject', meta: 'Deep dives into Scripture', color: '#1F6FEB', url: spotify('BibleProject podcast') },
      { id: 'en-p2', title: 'Renewing Your Mind', author: 'Ligonier', meta: 'Daily teaching', color: '#4C1D95', url: spotify('Renewing Your Mind Ligonier') },
      { id: 'en-p3', title: 'TGC Podcast', author: 'The Gospel Coalition', meta: 'Talks & interviews', color: '#312E81', url: spotify('The Gospel Coalition podcast') },
    ],
    louvores: [
      { id: 'en-l1', title: 'Hillsong Worship', author: 'Hillsong', meta: 'Worship', color: '#4338CA', url: yt('hillsongworship') },
      { id: 'en-l2', title: 'Bethel Music', author: 'Bethel', meta: 'Worship', color: '#5B21B6', url: yt('bethelmusic') },
      { id: 'en-l3', title: 'Passion Music', author: 'Passion', meta: 'Worship', color: '#6D28D9', url: yt('passionmusic') },
      { id: 'en-l4', title: 'Elevation Worship', author: 'Elevation', meta: 'Worship', color: '#7C3AED', url: yt('elevationworship') },
    ],
  },
};

const PT: LocaleMedia = {
  featured: {
    videos: {
      id: 'pt-f-v',
      title: 'Rodrigo Silva',
      author: 'Arqueologia bíblica',
      meta: 'História e evidências da Bíblia',
      color: '#8B5A2B',
      url: yt('rodrigosilva55'),
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
      url: yt('fernandinho'),
    },
  },
  items: {
    videos: [
      { id: 'pt-v1', title: 'Hernandes Dias Lopes', author: 'Pregação expositiva', meta: 'Estudos por livro', color: '#3730A3', url: yt('hernandesdiaslopes') },
      { id: 'pt-v2', title: 'Voltemos ao Evangelho', author: 'TGC Brasil', meta: 'Teologia e vida cristã', color: '#4C1D95', url: yt('VoltemosaoEvangelho') },
      { id: 'pt-v3', title: 'Ministério Fiel', author: 'Editora Fiel', meta: 'Conferências e estudos', color: '#312E81', url: yt('ministeriofiel') },
      { id: 'pt-v4', title: 'Augustus Nicodemus', author: 'Teólogo presbiteriano', meta: 'Exposição bíblica', color: '#1E3A8A', url: yt('augustusnicodemus') },
      { id: 'pt-v5', title: 'Leandro Lima', author: 'Pregação e teologia', meta: 'Estudos bíblicos', color: '#4338CA', url: yt('leandrolimaoficial') },
      { id: 'pt-v6', title: 'Paulo Junior', author: 'Apologética', meta: 'Defesa da fé', color: '#5B21B6', url: yt('paulojunior') },
    ],
    podcasts: [
      { id: 'pt-p1', title: 'Voltemos ao Evangelho', author: 'TGC Brasil', meta: 'Episódios semanais', color: '#4C1D95', url: spotify('Voltemos ao Evangelho') },
      { id: 'pt-p2', title: 'Café Teológico', author: 'Teologia em conversa', meta: 'Bate-papo teológico', color: '#6D28D9', url: spotify('café teológico') },
      { id: 'pt-p3', title: 'Bíblia em 1 ano', author: 'Devocional diário', meta: 'Leitura guiada', color: '#312E81', url: spotify('Bíblia em 1 ano') },
    ],
    louvores: [
      { id: 'pt-l1', title: 'Fernandinho', author: 'Louvor', meta: 'Adoração', color: '#4338CA', url: yt('fernandinho') },
      { id: 'pt-l2', title: 'Morada', author: 'Banda Morada', meta: 'Adoração', color: '#5B21B6', url: yt('moradaoficial') },
      { id: 'pt-l3', title: 'Gabriela Rocha', author: 'Louvor', meta: 'Adoração', color: '#6D28D9', url: yt('gabrielarochaoficial') },
      { id: 'pt-l4', title: 'Novo Tempo', author: 'Rede Novo Tempo', meta: 'Música cristã', color: '#7C3AED', url: yt('NovoTempoBrasil') },
    ],
  },
};

const ES: LocaleMedia = {
  featured: {
    videos: {
      id: 'es-f-v',
      title: 'BITE',
      author: 'Bible Project en español',
      meta: 'Videos animados de la Biblia',
      color: '#1F6FEB',
      url: yt('biteproject'),
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
      url: yt('mielsanmarcos'),
    },
  },
  items: {
    videos: [
      { id: 'es-v1', title: 'Coalición por el Evangelio', author: 'TGC', meta: 'Biblia y cultura', color: '#3730A3', url: yt('coalicionporelevangelio') },
      { id: 'es-v2', title: 'Ministerios Ligonier', author: 'R.C. Sproul', meta: 'Enseñanza reformada', color: '#4C1D95', url: yt('ministeriosligonier') },
      { id: 'es-v3', title: 'John MacArthur', author: 'Gracia a Vosotros', meta: 'Predicación expositiva', color: '#312E81', url: yt('JohnMacArthurEspanol') },
      { id: 'es-v4', title: 'Entendiendo la Biblia', author: 'Estudio bíblico', meta: 'Explicaciones sencillas', color: '#1E3A8A', url: yt('entendiendolabiblia') },
      { id: 'es-v5', title: 'Versículo a Versículo', author: 'Exposición bíblica', meta: 'Estudios por libro', color: '#4338CA', url: yt('versiculoaversiculo') },
      { id: 'es-v6', title: 'Fundamentos Bíblicos', author: 'Doctrina cristiana', meta: 'Enseñanza fundamental', color: '#5B21B6', url: yt('Fundamentosbiblicos') },
    ],
    podcasts: [
      { id: 'es-p1', title: 'Coalición Podcast', author: 'TGC en español', meta: 'Conversaciones y enseñanza', color: '#4C1D95', url: spotify('Coalición por el Evangelio podcast') },
      { id: 'es-p2', title: 'Renovando tu Mente', author: 'Ligonier', meta: 'Enseñanza diaria', color: '#312E81', url: spotify('Renovando tu mente Ligonier') },
      { id: 'es-p3', title: 'La Biblia en un año', author: 'Devocional', meta: 'Lectura guiada', color: '#6D28D9', url: spotify('La Biblia en un año') },
    ],
    louvores: [
      { id: 'es-l1', title: 'Miel San Marcos', author: 'Alabanza', meta: 'Adoración', color: '#4338CA', url: yt('mielsanmarcos') },
      { id: 'es-l2', title: 'Marcos Witt', author: 'Alabanza', meta: 'Adoración', color: '#5B21B6', url: yt('MarcosWitt') },
      { id: 'es-l3', title: 'Generación 12', author: 'Alabanza', meta: 'Adoración', color: '#6D28D9', url: yt('generacion12') },
      { id: 'es-l4', title: 'Marco Barrientos', author: 'Alabanza', meta: 'Adoración', color: '#7C3AED', url: yt('marcobarrientos') },
    ],
  },
};

const BY_LOCALE: Record<Locale, LocaleMedia> = { en: EN, pt: PT, es: ES };

export function mediaForLocale(locale: Locale): LocaleMedia {
  return BY_LOCALE[locale] ?? EN;
}
