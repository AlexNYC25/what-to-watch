import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import dbConnect from "../../../util/dbConnect";

import User from "../../../models/User";

/*
    POST /api/favorites/tv
    Body:
        - mediaId
    Response:
        - status code
        - message
    Note: Route will be protected by Auth0, user is required to be logged in, user details will be retrieved from Auth0
*/
export default withApiAuthRequired(async function saveTVFavorite(req, res) {

    return new Promise((resolve, reject) => {

        if (req.method !== "POST") {
            return res.status(405).json({ message: "Method not allowed" });
        }

        await dbConnect();

        const mediaId = req.body.mediaId
        const session = getSession(req, res);

        const userId = session.user.name

        User.find({
            email: userId
        })
        .then(user => {

            // create empty array if favoriteTV dosent exist    
            if(!user.favoriteTvShows){
                user.favoriteTvShows = []
            }

            // check if mediaId is already in favoriteTV array
            if(user.favoriteTvShows.includes(mediaId)) {
                return res.status(400).json({
                    message: "TV show is already in favorites"
                })
                reject()
            }

            user.favoriteTvShows.push(mediaId);
            user.save().then(() => {
                res.status(200).json({
                    message: "TV show added to favorites"
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