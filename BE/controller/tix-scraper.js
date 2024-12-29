const { default: axios } = require("axios");
const cheerio = require("cheerio");

const getMovies = async (req, res) => {
  try {
    const response = await axios.get("https://www.tix.id/");
    const $ = cheerio.load(response.data);

    const movieList = $(
      "#home-now-showing div.glide.glide-now-playing-single-title-item div.glide__track ul li"
    );

    const result = [];
    $(movieList).each((index, element) => {
      const movie = {};
      $(element)
        .children()
        .each((index_, element_) => {
          if (index_ === 0) {
            movie.poster = $(element_).find(".img").attr("src");
            const regex = /\/movie\/([^\/]+)\/?$/;
            url = $(element_).find(".img").parent().attr("href");

            const match = url.match(regex);
            match ? (movie.id = match[1]) : (movie.id = "");
          } else if (index_ === 1) {
            movie.title = $(element_).text();
          }
        });
      result.push(movie);
    });

    res.json({ result, success: true });
  } catch (error) {
    console.log("Error at getMovies:", error);
    res.json({ message: "Internal server error!", success: false });
  }
};

const getDetailMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get("https://www.tix.id/movie/" + id);
    const $ = cheerio.load(response.data);

    const result = {};

    const poster = $(
      "body main div.gt-page-wrapper div.gt-title-overview.gt-style-1 div.gt-cover div div.gt-poster img"
    );
    result.poster = poster.attr("src");

    const title = $(
      "body main div.gt-page-wrapper div.gt-title-overview.gt-style-1 div.gt-cover div div.gt-details.gt-part-1 h1"
    );
    result.title = title.text();

    const merchants = $(
      "body main div.gt-page-wrapper div.gt-title-overview.gt-style-1 div.gt-cover div div.gt-details.gt-part-1 p span.icon-single-merchant"
    );
    result.merchants = [];
    $(merchants).each((index, element) => {
      result.merchants.push($(element).text());
    });

    const desc = $(
      "body main div.gt-page-wrapper div.gt-title-overview.gt-style-1 div.gt-cover div div.gt-details.gt-part-1 div.gt-mini-summary p"
    );
    result.desc = desc.text();

    const trailer = $(
      "body main div.gt-page-wrapper div.gt-title-overview.gt-style-1 div.gt-cover div div.gt-details.gt-part-1 div.gt-items div.gt-circular-items div div a"
    );
    result.trailer = trailer.attr("href");

    const runtime = $(
      "body main div.gt-page-wrapper div.gt-title-overview.gt-style-1 div.gt-cover div div.gt-details.gt-part-1 div.gt-items div.gt-dotted-items div"
    );
    result.runtime = runtime.text();

    const stars = $(
      "body main div.gt-page-wrapper div.gt-title-overview.gt-style-1 div.gt-flex-container div div div.gt-inner-items div div.gt-point div img"
    );
    result.stars = 0;
    $(stars).each((index, element) => {
      if ($(element).attr("src").includes("star_1")) {
        result.stars += 1;
      }
    });
    result.stars = `${result.stars}/10`;

    const voters = $(
      "body main div.gt-page-wrapper div.gt-title-overview.gt-style-1 div.gt-flex-container div div div.gt-inner-items div div.gt-point p"
    );
    result.voters = voters.text().split(" ")[0];

    const casts = $("#title-cast div.gt-module-content div div ul li");
    result.casts = [];
    $(casts).each((index, element) => {
      const name = $(element).find(".gt-name").text();
      const photo = $(element).find(".gt-photo img").attr("src");
      const role = $(element).find(".gt-subtitle").text();

      result.casts.push({ name, photo, role });
    });

    const gallery = $(
      "#title-photos div.gt-module-content div div div.swiper-wrapper div"
    );
    result.gallery = [];
    $(gallery).each((index, element) => {
      result.gallery.push($(element).find("div a").attr("href"));
    });

    res.json({ result, success: true });
  } catch (error) {
    console.log("Error at getMovies:", error);
    res.json({ message: "Internal server error!", success: false });
  }
};

module.exports = {
  getMovies,
  getDetailMovie,
};
