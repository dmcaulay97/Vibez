const router = require('express').Router();
const { User, Playlist, Song } = require('../models');
const withAuth = require('../utils/auth');


//login route
router.get('/', async (req, res) => {
    try {
        res.render('TESTLOGIN');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

//Homepage route
router.get('/homePage', async (req, res) => {
    console.log(req.session);
    try {
        //The homepage will need to display list of users playlists
        const playlistData = await Playlist.findAll({
            where: {
                user_id: req.session.user_id
            }
        });
        const playlists = playlistData.map((pl) => pl.get({ plain: true }));
        res.render('TESTHOMEPAGE', { playlists });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
})

module.exports = router;