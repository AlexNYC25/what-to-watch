import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import dbConnect from "../../../util/dbConnect";

import User from "../../../models/User";

export default withApiAuthRequired( async function saveMovieFavorite(req, res) {

    await dbConnect();

    const mediaId = req.body.mediaId
    const session = getSession(req, res);

    const userId = session.user.name

    User.findOne({
        where: {
            id: userId
        }
    })
    .then(user => {
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
        })
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        })
    })

})