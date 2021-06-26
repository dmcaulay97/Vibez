const Playlist = require('./Playlist');
const Song = require('./Song');
const User = require('./User');

User.hasMany(Playlist, {
    foreignKey: 'user_id',
});

Playlist.hasMany(Song, {
    foreignKey: 'playlist_id',
});

Song.belongsTo(Playlist, {
    foreignKey: 'playlist_id',
});

Playlist.belongsTo(User, {
    foreignKey: 'user_id',
});




module.exports = { Playlist, Song, User };