/**
 * Conteúdo de Mídia (escopo 2.6). Placeholder até integrar YouTube Data API v3
 * e RSS de podcasts. Cada item tem um link externo aberto via Linking.
 */
export type MediaTab = 'videos' | 'podcasts' | 'louvores';

export type MediaItem = {
  id: string;
  title: string;
  author: string;
  meta: string;
  color: string;
  url: string;
};

export const FEATURED: Record<MediaTab, MediaItem> = {
  videos: {
    id: 'feat-v',
    title: 'O Sermão do Monte explicado',
    author: 'Pastor Carlos',
    meta: 'YouTube · 24 min',
    color: '#4338CA',
    url: 'https://www.youtube.com/results?search_query=sermão+do+monte+explicado',
  },
  podcasts: {
    id: 'feat-p',
    title: 'Fé Diária — Episódio 12',
    author: 'Podcast Verbo',
    meta: 'Spotify · 32 min',
    color: '#5B21B6',
    url: 'https://open.spotify.com/search/fé%20diária',
  },
  louvores: {
    id: 'feat-l',
    title: 'Playlist Adoração 2026',
    author: 'Verbo Music',
    meta: 'YouTube · 18 faixas',
    color: '#6D28D9',
    url: 'https://www.youtube.com/results?search_query=playlist+adoração',
  },
};

export const MEDIA: Record<MediaTab, MediaItem[]> = {
  videos: [
    { id: 'v1', title: 'Quem foi o apóstolo Paulo', author: 'BibleProject', meta: '12 min', color: '#3730A3', url: 'https://www.youtube.com/results?search_query=apóstolo+paulo' },
    { id: 'v2', title: 'A história do Êxodo', author: 'BibleProject', meta: '9 min', color: '#4C1D95', url: 'https://www.youtube.com/results?search_query=história+do+êxodo' },
    { id: 'v3', title: 'Como ler os Salmos', author: 'Estudo Bíblico', meta: '15 min', color: '#312E81', url: 'https://www.youtube.com/results?search_query=como+ler+os+salmos' },
  ],
  podcasts: [
    { id: 'p1', title: 'Ansiedade e fé', author: 'Podcast Verbo', meta: '28 min', color: '#5B21B6', url: 'https://open.spotify.com/search/ansiedade%20e%20fé' },
    { id: 'p2', title: 'Casamento segundo a Bíblia', author: 'Família Cristã', meta: '41 min', color: '#6D28D9', url: 'https://open.spotify.com/search/casamento%20bíblia' },
  ],
  louvores: [
    { id: 'l1', title: 'Oceans', author: 'Hillsong', meta: 'Louvor', color: '#4338CA', url: 'https://www.youtube.com/results?search_query=oceans+hillsong' },
    { id: 'l2', title: 'Way Maker', author: 'Sinach', meta: 'Louvor', color: '#5B21B6', url: 'https://www.youtube.com/results?search_query=way+maker+sinach' },
    { id: 'l3', title: 'Goodness of God', author: 'Bethel', meta: 'Louvor', color: '#6D28D9', url: 'https://www.youtube.com/results?search_query=goodness+of+god+bethel' },
    { id: 'l4', title: 'Reckless Love', author: 'Cory Asbury', meta: 'Louvor', color: '#7C3AED', url: 'https://www.youtube.com/results?search_query=reckless+love' },
  ],
};
