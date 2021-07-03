const router = require('express').Router();
const { Playlist } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const playlistData = await Playlist.findAll();
        const blogs = playlistData.map((pl) => pl.get({ plain: true }));
        res.status(200).json(blogs)
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
})

router.post('/', async (req, res) => {
    try {
        const id = req.session.user_id;
        const newPlaylist = await Playlist.create({
            ...req.body,
            user_id: id
        });
        res.status(200).json(newPlaylist);
    } catch (err) {
        console.error(err)
        res.status(400).json(err);
    }

});

router.put('/:id'), async (req, res) => {
    try {
        const updatedPlaylist = await Playlist.update(
            {
                name: req.body.name
            },
            {
                where: {
                    id: req.params.id,
                    user_id: req.session.user_id
                }
            });
        res.status(200).json(updatedPlaylist);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
}

router.delete('/:id', async (req, res) => {
    try {
        console.log(req.params.id, req.session);
        const playlistData = await Playlist.destroy({
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