const router = require('express').Router();
const userRoutes = require('./userRoutes');
const playlistRoutes = require('./playlistRoutes');
const songRoutes = require('./songRoutes');
const searchRoutes = require('./searchRoutes');

router.use('/users', userRoutes);
router.use('/playlists', playlistRoutes);
router.use('/songs', songRoutes);
router.use('/search', searchRoutes);

module.exports = router;