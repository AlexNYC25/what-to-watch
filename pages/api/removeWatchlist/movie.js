import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import dbConnect from "../../../util/dbConnect";

import User from "../../../models/User";

/*
    POST /api/removeWatchlist/movie
    Body:
        - mediaId
    Response:
        - status code
        - message
    Note: Route will be protected by Auth0, user is required to be logged in, user details will be retrieved from Auth0
*/
export default withApiAuthRequired(async function removeWatchlistMovie(req, res) {

    return new Promise((resolve, reject) => {
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Method not allowed" });
        }
        
        await dbConnect();
    
        const mediaId = req.body.mediaId;
        const session = getSession(req, res);
    
        const userId = session.user.name;
    
        User.find({
            email: userId
        })
        .then(user => {

            // create empty array if watchlist dosent exist
            if(!user.movieWatchlist){
                user.movieWatchlist = []
            }

            // check if the user has that media id in their watchlist
            if(user.movieWatchlist.includes(mediaId)){
                user.movieWatchlist.filter(movie => movie !== mediaId);
            }
    
            user.save()
            .then(() => {
                res.status(200).json({
                    message: "Movie removed from watchlist"
                });
                resolve();
            })
            .catch(err => {
                res.status(500).json({
                    error: err,
                    message: "Error removing movie from watchlist"
                });
                reject();
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message: "Error in user database"
            });
            reject();
        });
    });




});