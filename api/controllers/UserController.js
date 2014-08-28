/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  index: function(req, res, next) {
    User.find(function foundUsers(err, users){
      if (err) return next(err);
      res.view({
        users: users
      })
    });
  },

	new: function(req, res) {
    res.view();
  },

  create: function (req, res, next) {
    req.params.all()['admin'] = false;
    User.create(req.params.all(), function userCreated(err, user) {
      if (err) {
        req.session.flash = {
          err: err
        }
        return res.redirect('/user/new');
      }

      // Log user in
      req.session.authenticated = true;
      req.session.User = user;

      // Change status to online
      user.online = true;
      user.save(function (err, user) {
        if (err) return next(err);
        User.publishCreate(user);
        console.log('User created');
        res.redirect('/user/show/' + user.id);
      });
    });
  },

  show: function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user){
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user
      })
    });
  },

  edit: function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user){
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user
      })
    });
  },

  update: function(req, res, next) {
    var adminParam = req.params.all()['admin'];
    if ( adminParam && adminParam === "on"){
      req.params.all()['admin'] = true;
    } else {
      req.params.all()['admin'] = false;
    }
    if (!req.session.User.admin) {
      req.params.all()['admin'] = false;
    }

    User.update(req.param('id'), req.params.all(), function userUpdated(err) {
      if (err) {
        return res.redirect('/user/edit' + req.param('id'));
      }
      User.publishUpdate(req.param('id'), req.params.all());
      res.redirect('user/show/' + req.param('id'));
    })
  },

  destroy: function (req, res, next) {
    User.findOne(req.param('id'), function userDestroyed(err, user){
      if (err) return next(err);
      if (!user) return next('User doesn\'t exist.');

      User.destroy(req.param('id'), function userDestroyed(err) {
        User.publishDestroy(req.param('id'));
        if (err) return next(err);
      });

      res.redirect('/user');
    });
  },

  subscribe: function (req, res, next) {
    User.find({}).exec(function(e, users){
      User.subscribe(req.socket);
      User.subscribe(req.socket, users,['index', 'create','destroy', 'update']);
      res.json(users);
    });
  }
};

