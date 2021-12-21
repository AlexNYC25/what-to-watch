
let axios = require('axios').default;

let getTrendingMovies = () => {
    return axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.TMDB_API_KEY}`)
        .then(response => response.data.results)
        .catch(error => console.log(error));
}

let getTrendingTV = () => {
    return axios.get(`https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.TMDB_API_KEY}`)
        .then(response => response.data.results)
        .catch(error => console.log(error));
}

export default function getDiscover(req, res) {
    if(req.method !== 'GET') {
        res.status(405).json({message: 'Method not allowed'});
    }

    getTrendingMovies()
        .then(movies => {
            getTrendingTV()
                .then(tvShows => {
                    return res.status(200).json({
                        movies: movies,
                        tvShows: tvShows
                    });
                })
                .catch(error => res.status(500).json({message: 'Error getting trending TV shows'}));
        })
        .catch(error => res.status(500).json({message: 'Error getting trending movies'}));
        

}