let axios = require('axios').default;

let searchMovie = async (query, page) => {

	if(page < 1) page = 1;

	let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=${page}`;

	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.log(error);
	}
	
}

let searchTV = async (query, page) => {

	if(page < 1) page = 1;

	let url = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=${page}`;

	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.log(error);
	}
	
}

/*
    GET /api/search
    Parameters:
        - query
		- mediaType
		= pageNumber
    Response:
        - status code
        - data (if status code is 200)
    Note: Route will be protected by Auth0, user is required to be logged in, user details will be retrieved from Auth0
*/
export default function search(req, res) {
	const { query, mediaType, pageNumber } = req.query;
	
  	if(!query) {
		res.status(400).json({
	  		error: 'Missing query'
		});
  	}

  if(req.method === 'GET') {

	if(mediaType === 'movie') {
		searchMovie(query, pageNumber)
			.then(data => {
				res.status(200).json({message: 'query successful', data: data});
			})
			.catch(error => {
				res.status(500).json({
					error: error
				});
			});
	} else {
		searchTV(query, pageNumber)
			.then(data => {
				res.status(200).json({message: 'query successful', data: data});
			})
			.catch(error => {
				res.status(500).json({
					error: error
				});
			});
	}

  }


}