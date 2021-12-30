import axios from 'axios';

let getTvShowDetails = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
        return response.data;
    } catch(error){
        return error;
    }
}

let getTvShowRecommendations = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`);
        return response.data;
    } catch(error){
        return error;
    }
}

let getTvShowCredits = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
        return response.data;
    } catch(error){
        return error;
    }
}

let getTvShowWatchProviders = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
        return response.data;
    } catch(error){
        return error;
    }
}

let getTvShowVideos = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
        return response.data;
    } catch(error){
        return error;
    }
}


let gatherTvShowData = async (id) => {
    const tvShowData = await Promise.all([
        getTvShowDetails(id),
        getTvShowRecommendations(id),
        getTvShowCredits(id),
        getTvShowWatchProviders(id),
        getTvShowVideos(id)
    ])

    return {
        tvShow: tvShowData[0],
        recommendations: tvShowData[1],
        credits: tvShowData[2],
        watchProviders: tvShowData[3],
        videos: tvShowData[4]
    }

}

/*
    GET /api/tvShow/[id]
    Query:
        - id
    Response:
        - status code
        - data
        - message
    Note: Route will be protected by Auth0, user is required to be logged in, user details will be retrieved from Auth0
*/
export default async function tvShow(req, res) {

    return new Promise((resolve, reject) => {
        if(req.method !== 'GET') {
            return res.status(405).json({message: 'Method not allowed'});
        }
    
        const id = req.query.id;
    
        gatherTvShowData(id)
            .then(data => {
                res.status(200).json({data: data, message: 'Tv show data successfully gathered'});
                resolve();
            })
            .catch(error => {
                res.status(500).json({error: error, message: 'Error while gathering tv show data'});
                reject();
            })
    })


    
}