/**
 * UnknownUserController
 *
 * @description :: Server-side logic for managing Unknownusers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	create: function(req, res, next){
    UnknownUser.create(UnknownUser.generateUser(), function(err, user){
      if (err) return next(err);
      res.json(user);
    });
  },

  update: function(req, res, next) {
    UnknownUser.update(req.param('id'), req.params.all(), function(err, user){
      if (err) return next(err);
      res.send(200);
    });
  }
};

