import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import dbConnect from "../../../util/dbConnect";

import User from "../../../models/User";

/*
    POST /api/removeFavorite/movie
    Body:
        - mediaId
    Response:
        - status code
        - message
    Note: Route will be protected by Auth0, user is required to be logged in, user details will be retrieved from Auth0
*/
export default withApiAuthRequired(async function movie(req, res) {

    return new Promise((resolve, reject) => {

        // allow only POST requests
        if(req.method !== "POST") {
            return res.status(405).json({message: "Method not allowed"});
        }
    
        await dbConnect();
    
        const mediaId = req.body.mediaId;
    
        const session = getSession(req, res);
        const userId  = session.user.name;
    
        User.find({
            email: userId        
        })
        .then(user => {

            // create empty array if favoriteMovies dosent exist
            if(!user.favoriteMovies){
                user.favoriteMovies = []
            }

            // check if the passed mediaId is in the user's favorites
            if(user.favoriteMovies.includes(mediaId)) {
                user.favoriteMovies = user.favoriteMovies.filter(id => id !== mediaId);
            } else {
                return res.status(400).json({
                    message: "The passed movie Id is not in the user's favorites"
                });
            }
    
            user.save().then(() => {
                res.status(200).json({message: "Movie removed from favorites"});
                resolve();
            })
            .catch(err => {
                res.status(500).json({error: err, message: "Error saving user"});
                reject();
            })
    
        })
        .catch(err => {
            res.status(500).json({error: err, message: "Error querying user database"});
            reject();
        })
    });


})