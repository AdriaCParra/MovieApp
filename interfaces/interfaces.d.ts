export interface Movie {
  id: number;
  title: string;
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TrendingMovie {
  searchTerm: string;
  movie_id: number;
  title: string;
  count: number;
  poster_url: string;
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
}

// API response types
export interface ApiResponse<T> {
  results: T;
  page: number;
  total_pages: number;
  total_results: number;
}

// Fetch hook types
export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

// Movie fetch parameters
export interface FetchMoviesParams {
  query: string;
  numPage?: number;
}

// Component props types
export interface MovieCardProps {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  index?: number;
  genre_ids: number[];
}

export interface TopMovieCardProps extends MovieCardProps {
  backdrop_path: string | null;
}

// Search bar props
export interface SearchBarProps {
  onPress?: () => void;
  placeHolder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

// Error types
export interface ApiError extends Error {
  status?: number;
  statusText?: string;
}
