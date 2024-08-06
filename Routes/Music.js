const express = require("express");
const router = express.Router();
const {addSong, getAllSongs, getSongsByArtist, addToFav, getFavCart, addArtist, addAlbum, getArtist, getAlbum, getSongByAlbum, newPlaylist, addToPlaylist, getPlaylist, getPlaylistSong} = require("../Controller/Music");
const authenticate = require("../Middleware/Auth")

router.post("/addSong",addSong);
router.post("/addArtist",addArtist);
router.post("/addAlbum",addAlbum);
router.get("/getSong",getAllSongs);
router.get("/getArtist",getArtist);
router.get("/getAlbum",getAlbum);
router.post("/createPlaylist",newPlaylist);
router.post("/addToPlaylist",addToPlaylist);
router.get("/getAllPlaylist/:userId",getPlaylist);
router.get("/getPlaylistSongs",getPlaylistSong);
router.get("/getSongArtist/:artistName",getSongsByArtist);
router.get("/getSongAlbum/:albumName",getSongByAlbum);
router.get("/addToFav",authenticate,addToFav);
router.get("/getFav",authenticate,getFavCart);

module.exports = router;