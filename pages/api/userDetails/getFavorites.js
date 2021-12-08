import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import dbConnect from "../../../util/dbConnect";

import User from "../../../models/User";

let axios = require('axios').default;

// helper function to return a promise that resolves to a single movie's details
let getMovieDetails = (movieId) => {
    // call the API to see if the show is actually a movie
    let promise = axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
        .then(response => { 
            if (response.status === 200) {
                return response.data
            } else {
                return;
            }
        })
        .catch(error => {
            // if we recieve an error code from the API then we consider the id to be invalid
            console.log(error.response);
        });

    return promise;
}  

// helper function to return a promise that resolves to a single show's details
let getTvShowDetails = (tvShowId) => {
    let promise = axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
    .then(response => {
        if (response.status === 200) {
            return response.data
        } else {
            return;
        }
    })
    .catch(error => {
        console.log(error)
    })

    return promise;
}

/*
    GET /api/userDetails/getFavorites
    Response:
        - status code
        - message
    Note: Route will be protected by Auth0, user is required to be logged in, user details will be retrieved from Auth0
*/
export default withApiAuthRequired( async function getFavorites(req, res) {

    if(req.method !== "GET") {
        res.status(405).end();
    }

    await dbConnect();

    const session = getSession(req, res);
    const userId = session.user.name;

    User.findOne({
        where: {
            email: userId
        }
    }).then(user => {

        let movieFavorites = user.favoriteMovies;
        let tvShowFavorites = user.favoriteTvShows;

        let movieDetails = [];
        let tvShowDetails = [];

        let moviePromises = [];
        let tvShowPromises = [];

        for(let i = 0; i < movieFavorites.length; i++) {
            moviePromises.push(getMovieDetails(movieFavorites[i]));
        }

        for(let i = 0; i < tvShowFavorites.length; i++) {
            tvShowPromises.push(getTvShowDetails(tvShowFavorites[i]));
        }


        Promise.all(moviePromises).then(values => {
            movieDetails = values;

            Promise.all(tvShowPromises).then(values => {
                tvShowDetails = values;

                res.status(200).json({
                    movieFavorites: movieDetails,
                    tvShowFavorites: tvShowDetails
                });
            })
        });

        
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });

}); 