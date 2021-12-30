import axios from "axios";

let getMovieDetails = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
        return response.data;
    } catch (error) {
        return error;
    }
}

let getMovieRecommendations = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`);
        return response.data;
    } catch (error) {
        return error;
    }
}

let getMovieCredits = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
        return response.data;
    } catch (error) {
        return error;
    }
}

let getMovieWatchProviders = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
        return response.data;
    } catch (error) {
        return error;
    }
}

let getMovieVideos = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
        return response.data;
    } catch (error) {
        return error;
    }
}

let gatherMovieData = async (id) => {
    const movieData = await Promise.all([
        getMovieDetails(id),
        getMovieRecommendations(id),
        getMovieCredits(id),
        getMovieWatchProviders(id),
        getMovieVideos(id)
    ]);

    return {
        movie: movieData[0],
        recommendations: movieData[1],
        credits: movieData[2],
        watchProviders: movieData[3],
        videos: movieData[4]
    };
}

/*
    GET /api/movie/[id]
    Query:
        - id
    Response:
        - status code
        - data
        - message
    Note: Route will be protected by Auth0, user is required to be logged in, user details will be retrieved from Auth0
*/
export default function movie(req, res) {
    return new Promise((resolve, reject) => {
        // Only allow GET requests
        if(req.method !== "GET") {
            return res.status(405).json({message: "Method not allowed"});
        }
    
        const id = req.query.id;
    
        gatherMovieData(id)
            .then(data => {
                res.status(200).json({data: data, message: "Movie data retrieved successfully"});
                resolve();
            })
            .catch(error => {
                res.status(500).json({error: error, message: "An error occured while retrieving movie data"});
                reject();
            });
    
    })

}