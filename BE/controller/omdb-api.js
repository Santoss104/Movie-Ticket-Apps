const { default: axios } = require("axios");

const searchMovies = async (req, res) => {
  try {
    const title = req.query.title || req.body.title || req.headers.title;

    if (!title) {
      return res.json({ message: "'title' is required!", success: false });
    }

    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&s=${title}`
    );

    const data = response.data.Search;

    if (!data) {
      return res.json({ message: "Movie not found!", success: false });
    }

    const result = await Promise.all(
      data.map(async (movie) => {
        const req = {
          params: {
            id: movie.imdbID,
          },
        };

        let movieDetail = {};
        const res = {
          json: (data) => {
            if (data.success) movieDetail = data.result;
          },
        };

        await getDetailMovie(req, res);

        return {
          title: movieDetail.title,
          poster: movieDetail.poster,
          stars: movieDetail.stars,
          year: movieDetail.year,
          id: movieDetail.id,
          runtime: movieDetail.runtime,
          genre: movieDetail.genre,
        };
      })
    );

    res.json({ result, success: true });
  } catch (error) {
    console.log("Error at searchMovies:", error);
    res.json({ message: "Internal server error!", success: false });
  }
};

const getDetailMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&i=${id}&plot=full`
    );

    if (response.data.Response === "False") {
      return res.json({ message: "Movie not found!", success: false });
    }

    const result = {
      id: response.data.imdbID,
      poster: response.data.Poster,
      title: response.data.Title,
      desc: response.data.Plot,
      runtime: response.data.Runtime,
      genre: response.data.Genre,
      released: response.data.Released,
      year: response.data.Year,
      director: response.data.Director,
      writer: response.data.Writer,
      casts: response.data.Actors,
      language: response.data.Language,
      country: response.data.Country,
      stars: (response.data.imdbRating || 0) + "/10",
      votes: response.data.imdbVotes,
    };

    res.json({ result, success: true });
  } catch (error) {
    console.log("Error at getDetailMovie:", error);
    res.json({ message: "Internal server error!", success: false });
  }
};

module.exports = {
  searchMovies,
  getDetailMovie,
};
