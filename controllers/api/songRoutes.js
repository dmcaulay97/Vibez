const router = require('express').Router();
const { Song } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/:id', async (req, res) => {
    try {
        const songData = await Song.findAll({
            where: {
                playlist_id: req.params.id
            }
        });
        const songs = songData.map((song) => song.get({ plain: true }));
        res.status(200).json(songs);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const songData = await Song.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!songData) {
            res.status(404).json({ message: 'No song found with this id' });
            return;
        }
        res.status(200).json(songData);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;