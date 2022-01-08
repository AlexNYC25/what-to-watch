import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import dbConnect from "../../../util/dbConnect";

import User from "../../../models/User";

/*
    POST /api/watchlist/movie
    Body:
        - mediaId
    Response:
        - status code
        - message
    Note: Route will be protected by Auth0, user is required to be logged in, user details will be retrieved from Auth0
*/
export default withApiAuthRequired( function saveMovieFavorite(req, res) {

    return new Promise((resolve, reject) => {
        if(req.method !== "POST") {
            return res.status(405).end();
            reject();
        }
    
        dbConnect();
    
        const mediaId = req.body.mediaId
        const session = getSession(req, res);
    
        const userId = session.user.name
    
        User.findOne({
            email: userId
        })
        .then(user => {
            if(user.movieWatchlist.includes(mediaId)) {
                return res.status(400).json({
                    message: "Movie already in watchlist"
                })
            }
    
    
            user.movieWatchlist.push(mediaId);
            user.save().then(() => {
                res.status(200).json({
                    message: "Movie added to watchlist"
                })
                resolve()
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: err.message
            })
            reject()
        })
    });


    

})