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
    if(req.method !== "POST") {
        res.status(405).end();
    }

    let mediaType = req.query

    await dbConnect();

    const session = await getSession(req, res);
    const userId = session.user.name;

    let mediaId = req.body.mediaId

    User.findOne({
        where: {
            email: userId
        }
    })
    .then(user => {

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
                return res.status(200).json({
                    message: "Movie added to favorites"
                });
            }
            else if(mediaType === "tv"){
                return res.status(200).json({
                    message: "Tv Show added to favorites"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Error adding media to favorites",
                error: err
            });
        });

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Error updating media to favorite"
        })
    });
})