/**
 * SongController
 *
 * @description :: Server-side logic for managing songs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req, res, next) {
    Song.find(function foundSongs(err, songs) {
      if (err) return next(err);
      res.view({
        songs: songs
      });
    });
  },

  new: function(req, res,next) {
    res.view();
  },

  create: function(req, res, next){
    Song.create(req.params.all(), function(err, song){
      if (err) {
        return next(err);
      }

      req.file('file').upload(function (err, file){
        console.log(file);
        if (err) return next(err);
        song.src = file[0].fd.split('/').slice(-1)[0];
        song.save(function (err, song){
          if (err) return next(err);
          Song.publishCreate(song);
          res.redirect('/song/new');
        });
      });
    });
  },

  increasePlayCount: function(req, res, next){
    Song.findOne(req.param('id'), function(err, song){
      if (err) return next(err);
      song.playCount = song.playCount + 1;
      song.save(function(err, song){
        if (err) return next(err);
        var songUpdate = {id: song.id, playCount: song.playCount};
        Song.publishUpdate(song.id, songUpdate);
        res.send(200);
      });
    });
  },

  subscribe: function(req, res, next){
    Song.find({}).exec(function(err, songs){
      if (err) return next(err);
      Song.subscribe(req.socket);
      Song.subscribe(req.socket, songs,['index', 'create', 'update']);
      res.json(songs);
    });
  },

  subscribeSongRoom: function(req, res, next){
    sails.sockets.join(req.socket, req.param('id'));
    res.send(200);
  },

  sendSongMessage: function(req, res, next){
    sails.sockets.broadcast(req.param('id'), 'songChat', req.params.all(), req.socket);
    res.send(200);
  }
};