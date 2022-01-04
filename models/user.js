let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    tvShowWatchlist: [Number],
    movieWatchlist: [Number],
    favoriteTvShows: [Number],
    favoriteMovies: [Number]
});


export default mongoose.models.User || mongoose.model('User', UserSchema);