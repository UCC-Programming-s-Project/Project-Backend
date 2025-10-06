// types based on Jikan API v4
// https://docs.api.jikan.moe/#tag/manga

export type Manga = {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  title: string;
  title_english: string | null;
  title_japanese: string;
  type: string;
  chapters: number | null;
  volumes: number | null;
  status: string;
  publishing: boolean;
  published: {
    from: string;
    to: string | null;
    prop: {
      from: { day: number; month: number; year: number };
      to: { day: number | null; month: number | null; year: number | null };
    };
    string: string;
  };
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string | null;
  authors: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  serializations: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  genres: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  themes: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  demographics: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
};

export type Review = {
  id: string;
  mangaId: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
};

export type ForumThread = {
  id: string;
  title: string;
  author: string;
  date: string;
  replies: number;
  lastReply: {
    author: string;
    date: string;
  };
};
