let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    tvShowWatchlist: [Number],
    movieWatchlist: [Number],
    favoriteTvShows: [Number],
    favoriteMovies: [Number]
});


export default mongoose.models.User || mongoose.model('User', UserSchema);