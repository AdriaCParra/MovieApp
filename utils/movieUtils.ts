import { Movie } from "@/interfaces/interfaces";
import { Dimensions } from "react-native";

// Image URL utilities
export const getImageUrl = (
  path: string | null,
  size: "w500" | "w780" | "original" = "w500"
): string => {
  if (!path) return "https://via.placeholder.com/500x750?text=No+Image";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Date formatting utilities
export const getYearFromDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  return dateString.split("-")[0];
};

// Rating utilities
export const formatRating = (rating: number): string => {
  return (Math.round(rating) / 2).toFixed(1);
};

// Movie title utilities
export const truncateTitle = (
  title: string,
  maxLength: number = 20
): string => {
  if (title.length <= maxLength) return title;
  return `${title.substring(0, maxLength)}...`;
};

// Movie sorting utilities
export const sortMoviesByPopularity = (movies: Movie[]): Movie[] => {
  return [...movies].sort((a, b) => b.popularity - a.popularity);
};

export const sortMoviesByRating = (movies: Movie[]): Movie[] => {
  return [...movies].sort((a, b) => b.vote_average - a.vote_average);
};

export const sortMoviesByReleaseDate = (movies: Movie[]): Movie[] => {
  return [...movies].sort(
    (a, b) =>
      new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
  );
};

// Movie filtering utilities
export const filterMoviesByYear = (movies: Movie[], year: number): Movie[] => {
  return movies.filter((movie) => {
    const movieYear = parseInt(getYearFromDate(movie.release_date));
    return movieYear === year;
  });
};

export const filterMoviesByRating = (
  movies: Movie[],
  minRating: number
): Movie[] => {
  return movies.filter((movie) => movie.vote_average >= minRating);
};

// Accessibility utilities
export const getMovieAccessibilityLabel = (movie: Movie): string => {
  const year = getYearFromDate(movie.release_date);
  const rating = formatRating(movie.vote_average);
  return `${movie.title}, ${year}, Rating: ${rating} out of 5`;
};

// Error handling utilities
export const createApiError = (
  message: string,
  status?: number,
  statusText?: string
): Error => {
  const error = new Error(message) as any;
  error.status = status;
  error.statusText = statusText;
  return error;
};

// Debounce utility for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Memoization helper
export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// FlashList item layout utilities
export const getMovieCardDimensions = () => {
  const screenWidth = 375; // Default iPhone width
  const cardWidth = (screenWidth - 48) / 3; // 3 columns with 16px padding on sides and 6px gap
  const cardHeight = cardWidth * 1.5; // 3:2 aspect ratio

  return {
    width: cardWidth,
    height: cardHeight,
  };
};

export const getTopMovieCardDimensions = () => {
  const screenWidth = 375;
  const cardWidth = screenWidth * 0.7; // 70% of screen width
  const cardHeight = cardWidth * 1.5; // 3:2 aspect ratio

  return {
    width: cardWidth,
    height: cardHeight,
  };
};

// Viewport dimension calculation utilities
export interface ViewportDimensions {
  width: number;
  height: number;
}

export interface TopMovieLayoutDimensions {
  width: number;
  height: number;
  containerHeight: number;
}

/**
 * Calculates viewport-based dimensions for the top movie list
 * @param viewportHeight Optional viewport height to use instead of Dimensions.get('window')
 * @param fallbackDimensions Optional fallback dimensions to use if calculation fails
 * @returns Calculated dimensions for the top movie list
 */
export const calculateTopMovieDimensions = (
  viewportHeight?: number,
  fallbackDimensions?: Partial<TopMovieLayoutDimensions>
): TopMovieLayoutDimensions => {
  try {
    // Get actual viewport dimensions
    const { width: screenWidth, height: screenHeight } =
      Dimensions.get("window");

    // Validate screen dimensions
    if (
      !screenWidth ||
      !screenHeight ||
      screenWidth <= 0 ||
      screenHeight <= 0
    ) {
      throw new Error("Invalid screen dimensions detected");
    }

    // Use provided height or actual screen height
    const effectiveHeight = viewportHeight || screenHeight;

    // Calculate 60vh of the viewport height
    const containerHeight = Math.round(effectiveHeight * 0.6);

    // Calculate card width as 70% of screen width (matching the design intent)
    const cardWidth = Math.round(screenWidth * 0.7);

    // Calculate card height to maintain 3:2 aspect ratio
    const cardHeight = Math.round(cardWidth * 1.5);

    // Ensure card height doesn't exceed container height with some padding
    const finalCardHeight = Math.min(cardHeight, containerHeight - 20);

    // Validate calculated dimensions
    if (cardWidth <= 0 || finalCardHeight <= 0 || containerHeight <= 0) {
      throw new Error("Invalid calculated dimensions");
    }

    return {
      width: cardWidth,
      height: finalCardHeight,
      containerHeight,
    };
  } catch (error) {
    console.warn(
      "Failed to calculate top movie dimensions, using fallback:",
      error
    );

    // Default fallback dimensions based on common iPhone sizes
    const defaultFallback: TopMovieLayoutDimensions = {
      width: 280, // 70% of 400px base width
      height: 320, // Calculated from aspect ratio
      containerHeight: 400, // 60vh of 667px base height
    };

    // Merge with provided fallback if available
    return {
      width: fallbackDimensions?.width || defaultFallback.width,
      height: fallbackDimensions?.height || defaultFallback.height,
      containerHeight:
        fallbackDimensions?.containerHeight || defaultFallback.containerHeight,
    };
  }
};

/**
 * Gets the current viewport dimensions
 * @returns Current viewport width and height
 */
export const getViewportDimensions = (): ViewportDimensions => {
  const { width, height } = Dimensions.get("window");
  return { width, height };
};

/**
 * Calculates the optimal getItemLayout properties for the TopMoviesList FlatList
 * @param viewportHeight Optional viewport height for calculation
 * @param fallbackDimensions Optional fallback dimensions to use if calculation fails
 * @returns Object with length, offset calculation function, and container height
 */
export const getTopMovieItemLayout = (
  viewportHeight?: number,
  fallbackDimensions?: Partial<TopMovieLayoutDimensions>
) => {
  const dimensions = calculateTopMovieDimensions(
    viewportHeight,
    fallbackDimensions
  );

  return {
    length: dimensions.width,
    containerHeight: dimensions.containerHeight,
    getItemLayout: (data: any, index: number) => ({
      length: dimensions.width,
      offset: dimensions.width * index,
      index,
    }),
  };
};

/**
 * Safely calculates dimensions with error handling and validation
 * @param calculationFn Function that performs the dimension calculation
 * @param fallbackValue Value to return if calculation fails
 * @returns Calculated value or fallback
 */
export const safeCalculateDimension = <T>(
  calculationFn: () => T,
  fallbackValue: T
): T => {
  try {
    const result = calculationFn();
    return result;
  } catch (error) {
    console.warn("Dimension calculation failed, using fallback:", error);
    return fallbackValue;
  }
};

const genresMap: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const getGenreNames = (genreIds: number[]): string[] => {
  return genreIds.map((id) => genresMap[id]).filter((name) => name);
};
