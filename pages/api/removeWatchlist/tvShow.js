import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import dbConnect from "../../../util/dbConnect";

import User from "../../../models/User";

/*
    POST /api/removeWatchlist/tvShow
    Body:
        - mediaId
    Response:
        - status code
        - message
    Note: Route will be protected by Auth0, user is required to be logged in, user details will be retrieved from Auth0
*/
export default withApiAuthRequired(async function removeWatchlistTvShow(req, res) {

    if(req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed"
        });
    }

    await dbConnect();

    const mediaId = req.body.mediaId;

    const session = getSession(req, res);
    const userId  = session.user.name;

    User.findOne({
        where: {
            id: userId
        }
    }).then(user => {
        // check if the user has that media id in thier watchlist
        if(user.tvShowWatchlist.includes(mediaId)) {
            user.tvShowWatchlist.filter(id => id !== mediaId);
        }

        user.save()
        .then(() => {
            res.status(200).json({
                message: "tv show removed from watchlist"
            });   
        })
        .catch(err => {
            res.status(500).json({
                message: "Error removing tv show from watchlist"
            });
        })
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        });
    });

});