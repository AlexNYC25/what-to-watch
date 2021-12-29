let axios = require('axios').default;

// async function to get tv show details using tvShowId
let getTvShowInfo = (tvShowId) => {
    let promise = axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
        .then(response => {
            if(response.status === 200){
                //console.log(response.data)
                return response.data;
            }
        })
        .catch(error => {
            console.log(error);
        })

    return promise;
}

// async function to get movie details using movieId
let getMovieInfo = (movieId) => {
    // call the API to see if the show is actually a movie
    let promise = axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
        .then(response => { 
            if (response.status === 200) {
                return response.data
            } 
        })
        .catch(error => {
            console.log(error.response);
        });

    return promise;
} 

// function to collect tv show data using an array of tv show ids
let collectTvShowData = async (tvShowArr) => {
    let promiseArr = []
    
    if(!tvShowArr){
        return;
    }

    for(let i = 0; i < tvShowArr.length; i++){
        promiseArr.push(getTvShowInfo(tvShowArr[i]))
    }
    const results = await Promise.all(promiseArr);
}

// function to collect movie data using an array of movie ids
let collectMovieData = async (movieArr) => {
    let promiseArr = []

    if(!movieArr){
        return;
    }

    for(let i = 0; i < movieArr.length; i++){
        promiseArr.push(getMovieInfo(movieArr[i]));
    }

    const results = await Promise.all(promiseArr);
    return results;
}

// function to collect all tv and movie details when passsing an object that has properties that are arrays of ids
let collectMediaDetails = async (mediaObjects) => {
    let tvShowWatchlistExpanded = collectTvShowData(mediaObjects.tvShowWatchlist).then((results => {return results}));
    let movieWatchlistExpanded = collectMovieData(mediaObjects.movieWatchlist);

    let tvShowFavoritesExpanded = collectTvShowData(mediaObjects.tvShowFavorites)
    let movieFavoritesExpanded = collectMovieData(mediaObjects.movieFavorites)

    const results_1 = await Promise.all([tvShowWatchlistExpanded, movieWatchlistExpanded, tvShowFavoritesExpanded, movieFavoritesExpanded]);
    return {
        tvShowWatchlist: results_1[0],
        movieWatchlist: results_1[1],
        favoriteTvShows: results_1[2],
        favoriteMovies: results_1[3]
    };

}

export default collectMediaDetails;