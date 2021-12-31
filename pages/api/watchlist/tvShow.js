import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import dbConnect from "../../../util/dbConnect";

import User from "../../../models/User";

/*
    POST /api/watchlist/tvShow
    Body:
        - mediaId
    Response:
        - status code
        - message
    Note: Route will be protected by Auth0, user is required to be logged in, user details will be retrieved from Auth0
*/
export default withApiAuthRequired( async function saveMovieFavorite(req, res) {

    return new Promise((resolve, reject) => {
        await dbConnect();

        const mediaId = req.body.mediaId
        const session = getSession(req, res);
    
        const userId = session.user.name
    
        User.find({
            email: userId
        })
        .then(user => {
            if(user.tvShowWatchlist.includes(mediaId)) {
                return res.status(400).json({
                    message: "This tv show is already in your watchlist"
                })
            }
    
    
            user.tvShowWatchlist.push(mediaId);
            user.save().then(() => {
                res.status(200).json({
                    message: "Successfully added to watchlist"
                })
                resolve()
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message: "Error querying database"
            })
            reject()
        })
    });

})