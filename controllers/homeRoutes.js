const router = require('express').Router();
const fetch = require('node-fetch');
require('dotenv').config();
const { User, Playlist, Song } = require('../models');
const withAuth = require('../utils/auth');


//login route
router.get('/', async (req, res) => {
    try {
        res.render('login', { signup: true });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

//signup route
router.get('/signup', async (req, res) => {
    try {
        res.render('signup', { signup: true })
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

//Homepage route
router.get('/homepage', withAuth, async (req, res) => {

    try {
        //The homepage will need to display list of users playlists
        const playlistData = await Playlist.findAll({
            where: {
                user_id: req.session.user_id
            }
        });
        const playlists = playlistData.map((pl) => pl.get({ plain: true }));
        res.render('homepage', { playlists, homepage: true, navbar: true });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
})

//Results route
router.get('/results/:searchType/:search/:page', async (req, res) => {
    try {
        const playlistData = await Playlist.findAll({
            where: {
                user_id: req.session.user_id
            }
        });
        const playlists = playlistData.map((pl) => pl.get({ plain: true }));
        if (req.params.searchType == 'song') {
            const searchResult = await fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${req.params.search}&api_key=${process.env.lastfm_key}&format=json`)
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
            const pagedRes = [];
            for (let i = 0; i < response.length; i += 8) {
                const page = response.slice(i, i + 8);
                pagedRes.push(page);
            }
            const pageNoRes = pagedRes[(req.params.page) - 1]
            res.render('results', { pageNoRes, playlists, results: true, navbar: true });
        } else if (req.params.searchType == 'artist') {
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
            const pagedRes = [];
            for (let i = 0; i < response.length; i += 8) {
                const page = response.slice(i, i + 8);
                pagedRes.push(page);
            }
            const pageNoRes = pagedRes[(req.params.page) - 1]
            res.render('results', { pageNoRes, alternate, playlists, results: true, navbar: true });
        } else {
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
            const pagedRes = [];
            for (let i = 0; i < response.length; i += 8) {
                const page = response.slice(i, i + 8);
                pagedRes.push(page);
            }
            const pageNoRes = pagedRes[(req.params.page) - 1]
            res.render('results', { pageNoRes, alternate, playlists, results: true, navbar: true });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;