
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

    return new Promise((resolve, reject) => {
        if(req.method !== 'GET') {
            res.status(405).json({message: 'Method not allowed'});
            reject();
        }
    
        getTrendingMovies()
            .then(movies => {
                getTrendingTV()
                    .then(tvShows => {
                        res.status(200).json({
                            movies: movies,
                            tvShows: tvShows
                        });
                        resolve();
                    })
                    .catch(error => {
                        res.status(500).json({error: error, message: 'Error getting trending TV shows'})
                        reject();
                    });
            })
            .catch(error => {
                res.status(500).json({error: error, message: 'Error getting trending movies'})
                reject();
            });
    });


        

}