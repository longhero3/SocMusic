/**
 * SongController
 *
 * @description :: Server-side logic for managing songs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req, res, next) {
    Song.find(function foundSongs(err, users) {
      if (err) return next(err);
      res.view({
        songs: songs
      });
    });
  },

  subscribe: function(req, res, next){
    Song.find({}).exec(function(err, songs){
      if (err) return next(err);
      Song.subscribe(req.socket, songs, ['incCount', 'index']);
      res.json(songs);
    });
  }
};

