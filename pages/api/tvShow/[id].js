import axios from 'axios';

let getTvShowDetails = (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`);
        return response.data;
    } catch(error){
        return error;
    }
}

let getTvShowRecomndations = (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`);
        return response.data;
    } catch(error){
        return error;
    }
}

let getTvShowCredits = (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`);
        return response.data;
    } catch(error){
        return error;
    }
}

let getTvShowWatchProviders = (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/external_ids?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`);
        return response.data;
    } catch(error){
        return error;
    }
}

let getTvShowVideos = (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`);
        return response.data;
    } catch(error){
        return error;
    }
}


let gatherTvShowData = (id) => {
    return Promise.all([
        getTvShowDetails(id),
        getTvShowRecomndations(id),
        getTvShowCredits(id),
        getTvShowWatchProviders(id),
        getTvShowVideos(id)
    ]).then(values => {
        return {
            tvShow: values[0],
            recomndations: values[1],
            credits: values[2],
            watchProviders: values[3],
            videos: values[4]
        }
    })
}

export default function tvShow(req, res) {
    if(req.method !== 'GET') {
        return res.status(405).json({message: 'Method not allowed'});
    }

    const id = req.params.id;

    gatherTvShowData(id)
        .then(data => {
            res.status(200).json({data: data, message: 'Tv show data successfully gathered'});
        })
        .catch(error => {
            res.status(500).json({error: error, message: 'Error while gathering tv show data'});
        })
    
}