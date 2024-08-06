const db = require("../db");

const addSong = async (req, res) => {
  try {
    const { songName, songFile, song_img, lyrics, artistName, albumName } =
      req.body;
    const newSong = await db.query(
      "INSERT INTO music_table (songName, songFile,song_img, lyrics, artistName, albumName) VALUES (?, ?, ?, ?, ?, ?)",
      [songName, songFile, song_img, lyrics, artistName, albumName]
    );
    console.log(newSong);
    res.status(200).json({
      message: "Song added successfully",
      songData: newSong[0],
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const addAlbum = async (req, res) => {
  try {
    const { albumName, albumImg } = req.body;
    const newAlbum = await db.query(
      "INSERT INTO album_table (albumName, albumImg) VALUES (?, ?)",
      [albumName, albumImg]
    );
    res.status(200).json({
      message: "Album added successfully",
      albumData: newAlbum[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
const getAlbum = async (req, res) => {
  try {
    const album = await db.query("SELECT * FROM album_table");
    res.status(200).json({
      message: "Albums fetched successfully",
      albumData: album[0],
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const addArtist = async (req, res) => {
  try {
    const { artistName, artistImg } = req.body;
    const newArtist = await db.query(
      "INSERT INTO artist_table (artistName, artistImg) VALUES (?,?)",
      [artistName, artistImg]
    );
    res.status(200).json({
      message: "Artist added successfully",
      artistData: newArtist[0],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getArtist = async (req, res) => {
  try {
    const artists = await db.query("SELECT * FROM artist_table");
    res.status(200).json({ artists: artists });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllSongs = async (req, res) => {
  try {
    const allSongs = await db.query("SELECT * FROM music_table");
    return res.status(200).json({
      songs: allSongs,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const getSongsByArtist = async (req, res) => {
  try {
    const artist = req.params.artistName;

    const [rows] = await db.query(
      "SELECT * FROM music_table WHERE artistName = ?",
      [artist]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "No songs found for this artist",
      });
    }
    return res.status(200).json({
      message: "Songs filtered by artist successfully",
      data: rows,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getSongByAlbum = async (req, res) => {
  try {
    const album = req.params.albumName;

    const [rows] = await db.query(
      "SELECT * FROM music_table WHERE albumName = ?",
      [album]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "No songs found for this Album",
      });
    }
    return res.status(200).json({
      message: "Songs filtered by Album successfully",
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const addToFav = async (req, res) => {
  try {
    const { songId, userId } = req.body;
    const addSong = await db.query(
      "INSERT INTO favsong_table (songId, userId) VALUES (? ,?)",
      [songId, userId]
    );
    res.status(200).json({
      message: "Song added to favorites",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getFavCart = async (req, res) => {
  try {
    const { songId, userId } = req.body;
    const getFav = await db.query(
      "SELECT * FROM favsong_table WHERE userId = ? AND songId = ?",
      [userId, songId]
    );
    return res.status(200).json({
      message: "Fav cart retrieved successfully",
      data: getFav[0],
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const newPlaylist = async ( req,res ) => {
  try {
    const { playlist_name, userId } = req.body;
    const playlistcreate = await db.query(
      "INSERT INTO playlist_table (playlist_name, userId) VALUES (?,?)",
      [playlist_name, userId]
    );
    res.status(200).json({
      message: "Playlist created successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const addToPlaylist = async (req, res) => {
  try {
    const {songId, playlistId} = req.body;
    const addSong = await db.query(
      "INSERT INTO playlistsong_table (songId, playlistId) VALUES (?,?)",
      [songId, playlistId]
    );
    res.status(200).json({
      message: `Song Added To Playlist`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getPlaylist = async (req, res) => {
  try {
    const userId = req.params.userId;
    const playlist = await db.query(
      "SELECT * FROM playlist_table WHERE userId = ?",
      [userId]
    );
    return res.status(200).json({
      message: "Playlist retrieved successfully",
      data: playlist[0],
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getPlaylistSong = async(req, res) => {
  try {
    // const playlistid = req.params.playlistId; 
    // console.log(playlistid)
    // const playList = await db.query(
    //   "SELECT * FROM playlistsong_table WHERE playlistId = ?",
    //   [playlistid]
    // );
    // console.log(playList[0])
    // const songId = playList[0][0].songId;
    // const songData = await db.query('SELECT * FROM music_table WHERE id =? ',[songId])

    const playListSongs = await db.query("SELECT * FROM user_schema.playlistsong_table pst inner join user_schema.music_table mt on mt.id = pst.songId")
    return res.status(200).json({
      message: "Playlist Song retrieved successfully",
      data: playListSongs,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
module.exports = {
  addSong,
  getAllSongs,
  getSongsByArtist,
  addToFav,
  getFavCart,
  addArtist,
  getArtist,
  getSongByAlbum,
  getSongsByArtist,
  addAlbum,
  getAlbum,
  addToPlaylist,newPlaylist,
  getPlaylist,
  getPlaylistSong
};
