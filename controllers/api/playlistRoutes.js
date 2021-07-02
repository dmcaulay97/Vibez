const router = require('express').Router();
const { Playlist } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', async (req, res) => {
    try {
        console.log(req.session);
        const newPlaylist = await Playlist.create({
            ...req.body,
            user_id: req.seesion.user_id
        });
        res.status(200).json(newPlaylist);
    } catch (err) {
        console.error(err)
        res.status(400).json(err);
    }

});

router.delete('/:id', async (req, res) => {
    try {
        console.log(req.params.id, req.session);
        const playlistData = await Playlist.destory({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!playlistData) {
            res.status(404).json({ message: 'No playlist found with this id' });
            return;
        }
        res.status(200).json(playlistData);
    } catch (err) {
        console.error(err)
        res.status(500).json(err);
    }
});

module.exports = router;