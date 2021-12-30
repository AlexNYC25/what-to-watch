import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import dbConnect from "../../../util/dbConnect";

import User from "../../../models/User";

/*
    POST /api/removeFavorite/tvShow
    Body:
        - mediaId
    Response:
        - status code
        - error
        - message
    Note: Route will be protected by Auth0, user is required to be logged in, user details will be retrieved from Auth0
*/
export default withApiAuthRequired(async function removeTvShow (req, res) {

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
        }).then(user => {

            if (!user.favoriteTvShows) {
                user.favoriteTvShows = [];
            }

            // check if the passed mediaId is in the user's favorites
            if(user.favoriteTvShows.includes(mediaId)) {
                user.favoriteTvShows = user.favoriteTvShows.filter(id => id !== mediaId);
            } else {
                return res.status(400).json({
                    message: "The passed TV Show id is not in the user's favorites"
                });
            }
    
            user.save().then(() => {
                res.status(200).json({message: "Tv show removed from favorites"});
                resolve();
            })
            .catch(err => {
                res.status(500).json({error: err, message: "Error saving user"});
                reject();
            });
    
        })
        .catch(err => {
            res.status(500).json({error: err, message: "Error querying user database"});
            reject();
        });
    })




})