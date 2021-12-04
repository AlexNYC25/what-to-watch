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
    if (req.method !== "POST") {
        res.status(405).end();
    }
    
    await dbConnect();

    const mediaId = req.body.mediaId;
    const session = getSession(req, res);

    const userId = session.user.name;

    User.findOne({
        where: {
            email: userId
        }
    })
    .then(user => {
        // check if the user has that media id in their watchlist
        if(user.movieWatchlist.includes(mediaId)){
            user.movieWatchlist.filter(movie => movie !== mediaId);
        }

        user.save()
        .then(() => {
            res.status(200).json({
                message: "Movie removed from watchlist"
            });
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
        });
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        });
    });

});