import dbConnect from "../../util/dbConnect";
import user from "../../models/User";

import collectMediaDetails from "../../util/mediaDetails";

import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

dbConnect();

export default withApiAuthRequired( async (req, res) => {

    return new Promise((resolve, reject) => {
        if(req.method === "GET") {
            const session = getSession(req, res)

            user.findOne({
                email: session.user.email
            }).then(user => {
                collectMediaDetails({
                    tvShowWatchlist: user.tvShowWatchlist,
                    movieWatchlist: user.movieWatchlist,
                    favoriteMovies: user.favoriteMovies,
                    favoriteTvShows: user.favoriteTvShows
                }).then(userDetails => {
                    res.status(200).json({
                        tvShowWatchlist: userDetails.tvShowWatchlist,
                        movieWatchlist: userDetails.movieWatchlist,
                        favoriteMovies: userDetails.favoriteMovies,
                        favoriteTvShows: userDetails.favoriteTvShows
                    });
                    resolve();
                }).catch(err => {
                    res.status(500).json({
                        error: err,
                        message: "Error getting user details"
                    });
                    reject();
                })
            }).catch(err => {
                res.status(500).json({
                    error: err,
                    message: "Error getting user details"
                });
                reject();
            })
                                                            
        } else {
            return res.status(400).json({'message': 'Method not allowed'});
        }
    });


});
