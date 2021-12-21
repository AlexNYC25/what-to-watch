
let axios = require('axios');

let getTopRatedMovies = () => {
    return axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1&region=US`)
        .then((response) => {
            return response.data.results;
        })
        .catch((err) => {
            console.log(err);
        });
}

let getTopRatedTvShows = () => {
    return axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1&region=US`)
        .then((response) => {
            return response.data.results;
        })
        .catch((err) => {
            console.log(err);
        });
}

export default function getTopRated(req, res) {
    if(req.method !== "GET") {
        res.status(405).json({message: "Method not allowed"});
    }
    
    getTopRatedMovies()
        .then((movies) => {
            getTopRatedTvShows()
            .then((tvShows) => {
                res.json({
                    movies: movies,
                    tvShows: tvShows
                });
            })
            .catch((err) => {
                res.status(500).json({message: "Error getting top rated tv shows"});
            })
        })
        .catch((err) => {
            res.status(500).json({message: "Error getting top rated movies"});
        });
}