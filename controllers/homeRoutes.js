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
})

//Homepage route
router.get('/homePage', async (req, res) => {

    try {
        //The homepage will need to display list of users playlists
        const playlistData = await Playlist.findAll({
            where: {
                user_id: req.session.user_id
            }
        });
        const playlists = playlistData.map((pl) => pl.get({ plain: true }));
        res.render('homepage', { playlists, homepage: true });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
})

//Results route
router.get('/results/:searchType/:search', async (req, res) => {
    try {
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
            const playlistData = await Playlist.findAll({
                where: {
                    user_id: req.session.user_id
                }
            });
            const playlists = playlistData.map((pl) => pl.get({ plain: true }));
            res.render('results', { response, playlists, results: true });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;