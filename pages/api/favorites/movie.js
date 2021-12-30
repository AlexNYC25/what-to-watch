import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import dbConnect from "../../../util/dbConnect";

import User from "../../../models/User";

/*
    POST /api/favorites/movie
    Body:
        - mediaId
    Response:
        - status code
        - message
    Note: Route will be protected by Auth0, user is required to be logged in, user details will be retrieved from Auth0
*/

export default withApiAuthRequired( async function saveMovieFavorite(req, res) {

    return new Promise((resolve, reject) => {

        if (req.method !== "POST") {
            return res.status(405).json({message: "Method not allowed"});
        }

        await dbConnect();

        const mediaId = req.body.mediaId
        const session = getSession(req, res);

        const userId = session.user.name

        User.find({
            email: userId
        })
        .then(user => {

            // create empty array if favoriteMovies dosent exist
            if(!user.favoriteMovies){
                user.favoriteMovies = []

            }

            // check if mediaId is already in favoriteMovies array
            if(user.favoriteMovies.includes(mediaId)) {
                return res.status(400).json({
                    message: "Movie already in favorites"
                })
            }

            user.favoriteMovies.push(mediaId);
            user.save().then(() => {
                res.status(200).json({
                    message: "Movie was successfully added to favorites."
                })
                resolve()
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
            reject()
        })   
    
    })

})