import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import dbConnect from "../../../util/dbConnect";

import User from "../../../models/User";

export default withApiAuthRequired(async function removeTvShow (req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    await dbConnect();
    
    const mediaId = req.body.mediaId;

    const session = getSession(req, res);
    const userId = session.user.name;

    User.findOne({
        where: {
            id: userId
        }
    }).then(user => {

        if(user.favoriteTvShows.includes(mediaId)) {
            user.favoriteTvShows = user.favoriteTvShows.filter(id => id !== mediaId);
        }

        user.save().then(() => {
            res.status(200).json({message: "Tv show removed from favorites"});
        })
        .catch(err => {
            res.status(500).json({message: "Something went wrong"});
        });

    })
    .catch(err => {
        res.status(500).json({message: "Something went wrong"});
    });


})