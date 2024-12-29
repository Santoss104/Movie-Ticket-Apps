const apikey = "0897d9bab461ae8093571ee7b57e9434";

// API Configuration
export const apiConfig = {
  language: "en-US",
  region: "US",
};

// Image Configuration
export const IMAGE_SIZES = {
  POSTER: {
    SMALL: "w185",
    MEDIUM: "w342",
    LARGE: "w500",
    ORIGINAL: "original",
  },
  BACKDROP: {
    SMALL: "w300",
    MEDIUM: "w780",
    LARGE: "w1280",
    ORIGINAL: "original",
  },
  PROFILE: {
    SMALL: "w45",
    MEDIUM: "w185",
    LARGE: "h632",
    ORIGINAL: "original",
  },
};

// Categories Constants
export const MOVIE_CATEGORIES = {
  NOW_PLAYING: "now_playing",
  UPCOMING: "upcoming",
  POPULAR: "popular",
  TOP_RATED: "top_rated",
};

// API Endpoints
export const endpoints = {
  nowPlaying: (page = 1) =>
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${apikey}&page=${page}&language=${apiConfig.language}&region=${apiConfig.region}`,
  upcoming: (page = 1) =>
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${apikey}&page=${page}&language=${apiConfig.language}`,
  popular: (page = 1) =>
    `https://api.themoviedb.org/3/movie/popular?api_key=${apikey}&page=${page}&language=${apiConfig.language}`,
  movieDetails: (id) =>
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apikey}&append_to_response=videos,images,runtime&language=${apiConfig.language}`,
  movieCast: (id) =>
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apikey}&language=${apiConfig.language}`,
  movieReviews: (id) =>
    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apikey}&language=${apiConfig.language}`,
  similarMovies: (id) =>
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apikey}&language=${apiConfig.language}`,
  genres: () =>
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apikey}&language=${apiConfig.language}`,
  search: (query, page = 1) =>
    `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${query}&page=${page}&language=${apiConfig.language}`,
  discoverByGenre: (genreId, page = 1) =>
    `https://api.themoviedb.org/3/discover/movie?api_key=${apikey}&with_genres=${genreId}&page=${page}&language=${apiConfig.language}`,
};

// Utility Functions
export const baseImagePath = (size, path) => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const formatRuntime = (minutes) => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hr ${remainingMinutes}min`;
};

// Genre Management
let genresList = [];

export const initializeGenres = async () => {
  try {
    const response = await fetchFromAPI(endpoints.genres());
    if (response && response.genres) {
      genresList = response.genres;
    }
  } catch (error) {
    console.error("Error initializing genres:", error);
  }
};

export const getGenreNameById = (genreId) => {
  const genre = genresList.find((g) => g.id === genreId);
  return genre ? genre.name : "Unknown Genre";
};

export const mapGenreIdsToNames = (genreIds) => {
  if (!genreIds) return [];
  return genreIds
    .map((id) => getGenreNameById(id))
    .filter((name) => name !== "Unknown Genre");
};

// API Fetch Wrapper
const fetchFromAPI = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
};

// API Functions
export const getNowPlayingMoviesList = async (page = 1) => {
  return await fetchFromAPI(endpoints.nowPlaying(page));
};

export const getUpcomingMoviesList = async (page = 1) => {
  return await fetchFromAPI(endpoints.upcoming(page));
};

export const getPopularMoviesList = async (page = 1) => {
  return await fetchFromAPI(endpoints.popular(page));
};

export const getMovieDetails = async (id) => {
  return await fetchFromAPI(endpoints.movieDetails(id));
};

export const getCastList = async (id) => {
  return await fetchFromAPI(endpoints.movieCast(id));
};

export const getReviews = async (id) => {
  return await fetchFromAPI(endpoints.movieReviews(id));
};

export const getSimilarMovies = async (id) => {
  return await fetchFromAPI(endpoints.similarMovies(id));
};

export const getSearchResults = async (query, page = 1) => {
  return await fetchFromAPI(endpoints.search(query, page));
};

export const getMoviesByGenre = async (genreId, page = 1) => {
  return await fetchFromAPI(endpoints.discoverByGenre(genreId, page));
};

// Movie Data Formatter
export const formatMovieData = (movie, details = null) => {
  return {
    id: movie.id.toString(),
    title: movie.title,
    duration: details ? formatRuntime(details.runtime) : "N/A",
    genres: details
      ? details.genres.map((g) => g.name)
      : mapGenreIdsToNames(movie.genre_ids),
    rating: movie.vote_average,
    image: baseImagePath(IMAGE_SIZES.POSTER.LARGE, movie.poster_path),
    backdrop: baseImagePath(IMAGE_SIZES.BACKDROP.ORIGINAL, movie.backdrop_path),
    voteCount: Math.round(movie.vote_count / 1000),
    summary: movie.overview,
    releaseDate: movie.release_date,
    popularity: movie.popularity,
  };
};