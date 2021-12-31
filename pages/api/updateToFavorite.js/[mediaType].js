import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import dbConnect from "../../../util/dbConnect";

/*
    POST /api/updateToFavorite/[mediaType]
    Parameters:
        - mediaType
    Body:
        - mediaId
    Response:
        - status code
        - message
    Note: Route will be protected by Auth0, user is required to be logged in, user details will be retrieved from Auth0
*/
export default withApiAuthRequired(async function updateMovieToFavorite(req, res) {

    return new Promise((resolve, reject) => {
        if(req.method !== "POST") {
            res.status(405).json({message: "Method not allowed"});
        }
    
        let mediaType = req.query
    
        await dbConnect();
    
        const session = await getSession(req, res);
        const userId = session.user.name;
    
        let mediaId = req.body.mediaId
    
        User.find({
            email: userId
        })
        .then(user => {

            // create empty array if favoriteMovies dosent exist
            if(!user.favoriteMovies){
                user.favoriteMovies = []
            }

            // create empty array if favoriteTvShows dosent exist
            if(!user.favoriteTvShows){
                user.favoriteTvShows = []
            }

            // create empty array if moviews dosent exist
            if(!user.movieWatchlist){
                user.movieWatchlist = []
            }

            // create empty array if tvShows dosent exist
            if(!user.tvShowWatchlist){
                user.tvShowWatchlist = []
            }
    
            if(mediaType === "movie"){
                if(!user.favoriteMovies.includes(mediaId)) {
                    user.favoriteMovies.push(mediaId);
                    user.movieWatchlist = movieWatchlist.filter(movie => movie !== mediaId);
        
                } else {
                    return res.status(400).json({
                        message: "Movie already in favorites"
                    });
                }
            }
            else if(mediaType === "tv"){
                if(!user.favoriteTvShows.includes(mediaId)) {
                    user.favoriteTvShows.push(mediaId);
                    user.tvShowWatchlist = tvShowWatchlist.filter(movie => movie !== mediaId);
                } else {
                    return res.status(400).json({
                        message: "Tv Show already in favorites"
                    });
                }
            }
    
            
    
            user.save()
            .then(() => {
                if(mediaType === "movie"){
                    res.status(200).json({
                        message: "Movie added to favorites"
                    });
                    resolve();
                }
                else if(mediaType === "tv"){
                    res.status(200).json({
                        message: "Tv Show added to favorites"
                    });
                    resolve();
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "Error adding media to favorites",
                    error: err
                });
                reject();
            });
    
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message: "Error updating media to favorite"
            })
            reject();
        });
    });


})