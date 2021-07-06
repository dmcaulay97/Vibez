const router = require('express').Router();
const fetch = require('node-fetch')
require('dotenv').config();
const YoutubeMusicApi = require("youtube-music-api");
const musicApi = new YoutubeMusicApi();
const withAuth = require('../../utils/auth');

//Song search
router.get('/song/:search', async (req, res) => {
    try {
        const search = req.params.search;
        const searchResult = await fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${search}&api_key=${process.env.lastfm_key}&format=json`)
        const result = await searchResult.json();
        const tracks = result.results.trackmatches.track;
        //This forEach loop creates an array of objects, each containing track name and artist name. This array is sent back in the response.
        const response = []
        tracks.forEach((song) => {
            const track = {}
            track.name = song.name;
            track.artist = song.artist;
            response.push(track);
        });
        res.status(200).json({ response });
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});


//Artist(top tracks) Search
router.get('/artist/:search', async (req, res) => {
    try {
        const search = req.params.search;
        //first fetch gets list of artist matches. We get multiple artists in case first result is not what user is looking for.
        const searchResult = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${search}&api_key=${process.env.lastfm_key}&format=json`);
        const result = await searchResult.json();
        const artists = result.results.artistmatches.artist;
        const alternate = [];
        artists.forEach((e) => {
            const info = {};
            info.artist = e.name;
            alternate.push(info);
        });
        const artist = result.results.artistmatches.artist[0].name;
        //second fetch gets artist top tracks.
        const songResults = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artist}&api_key=${process.env.lastfm_key}&format=json`);
        const result2 = await songResults.json();
        const tracks = result2.toptracks.track;
        //This forEach loop creates an array of objects, each containing track name and artist name. This array is sent back in the response.
        const response = []
        tracks.forEach((song) => {
            const track = {}
            track.name = song.name;
            track.artist = song.artist.name;
            response.push(track);
        });
        res.status(200).json({ response, alternate });
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

//Album search
router.get('/album/:search', async (req, res) => {
    try {
        //First fetch gets album results. 
        const search = req.params.search;
        const albumresults = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${search}&api_key=${process.env.lastfm_key}&format=json`);
        const result = await albumresults.json();
        //We construct an array of alternate albums in case the first album is not the one the user is looking for.
        const albums = result.results.albummatches.album;
        const firstArtist = result.results.albummatches.album[0].artist;
        const firstAlbum = result.results.albummatches.album[0].name;
        const alternate = [];
        albums.forEach((e) => {
            const album = {};
            album.name = e.name;
            album.artist = e.artist;
            alternate.push(album);
        });
        //The secons search finds the track list for the first album result and creats an array of objects containing the full tracklist. 
        const albuminfo = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&album=${firstAlbum}&artist=${firstArtist}&api_key=${process.env.lastfm_key}&format=json`);
        const result2 = await albuminfo.json();
        const tracks = result2.album.tracks.track;
        const response = [];
        tracks.forEach((e) => {
            const track = {};
            track.name = e.name;
            track.artist = e.artist.name;
            response.push(track);
        });
        res.status(200).json({ response, alternate });
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

//Youtube id search
router.get('/video/:search', async (req, res) => {
    try {
        musicApi.initalize()
            .then(() => {
                musicApi.search(req.params.search)
                    .then((result) => {
                        videos = result.content;
                        const response = [];
                        videos.forEach((vid) => {
                            if (vid.videoId) {
                                const video = {};
                                video.title = vid.name;
                                video.id = vid.videoId;
                                response.push(video);
                            }
                        })
                        res.status(200).json({ response });
                    });
            });
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

module.exports = router;