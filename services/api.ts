import { Movie } from "@/interfaces/interfaces";

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`,
  },
};

export const fetchMovies = async ({
  query,
  numPage,
}: {
  query: string;
  numPage?: number;
}): Promise<Movie[]> => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?page=${numPage || 1}&sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) throw new Error("Failed to fetch movie");

  const data = await response.json();

  return data.results as Movie[];
};

// const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTUwYWM5MDM2YmI0MzI2NjUwYTRkZTc4Y2JjZWQ3OSIsIm5iZiI6MTc2MDEwNDcwOS42MzkwMDAyLCJzdWIiOiI2OGU5MTEwNWEzNjRjZGMwOTdlNmFjMDAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.xQ8_1OaS-q9j8UUPKyLiRfBzqJX6_okLRLXh1gL550Q'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));
