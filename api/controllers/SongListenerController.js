/**
 * SongListenerController
 *
 * @description :: Server-side logic for managing songlisteners
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req, res, next) {
    Song.find(req.param('songId')).populate('listeners').exec(function (err, s){
      var listeners = s[0].listeners.map(function(listener){
        return listener.user;
      });
      UnknownUser.find({id: listeners}).exec(function(err, users){
        if (err) return next(err);
        res.json(users);
      });
    })
  }

};

