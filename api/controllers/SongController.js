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

      req.file('file').upload({dirname: '../../assets/uploads'},function (err, file){
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
    //Create Song Listener record
    SongListener.create({song: req.param('id'), user: req.param('user').id}).exec(function (err, listener){
      if (err) return next(err);
      sails.sockets.join(req.socket, req.param('id'));
      var temp = req.param('user');
      temp['listenerId'] = listener.id;
      sails.sockets.broadcast(req.param('id'), 'songChatEntered', temp);
      res.send(200);
    });
  },

  unsubscribeSongRoom: function (req, res, next){
    SongListener.findOne(req.param('listenerId')).exec(function (err, listener){
      if (err) return next(err);
      SongListener.destroy(req.param('listenerId')).exec(function (err){
        if (err) return next(err);
        sails.sockets.broadcast(req.param('songId'), 'songChatLeft', req.param('user'), req.socket);
        sails.sockets.leave(req.socket, req.param('songId'));
      });
    });
  },

  sendSongMessage: function(req, res, next){
    sails.sockets.broadcast(req.param('id'), 'songChat', req.params.all(), req.socket);
    res.send(200);
  }
};