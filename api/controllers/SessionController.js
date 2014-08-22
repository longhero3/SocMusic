/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	new: function(req, res) {
    res.view('session/new');
  },

  create: function(req, res, next) {
    if (!req.param('email') || !req.param('password')){
      var requiredFieldError = [{name: 'UsernamePasswordRequired', message: 'You must enter both email and password.'}]
      req.session.flash = {
        err: requiredFieldError
      }
      res.redirect('/session/new');
      return;
    }

    User.findOne({ email: req.param('email') }, function(err ,user){
      if (err) return next(err);
      if(!user){
        var noAccountError = [{name: 'NoAccount', message: 'The account' + req.param('email') + 'No account found.'}]
        req.session.flash = {
          err: noAccountError
        }
        res.redirect('/session/new');
        return;
      }

      var bcrypt = require('bcrypt');
      bcrypt.compare(req.param('password'), user.encryptedPassword, function (err, valid){
        if (err) return next(err);

        if (!valid) {
          var emailPassMismatch = [{name: 'emailPassMismatch', message: 'Email and Password Mismtach'}]
          req.session.flash = {
            err: emailPassMismatch
          }
          res.redirect('/session/new');
          return;
        }
      });

      req.session.authenticated = true;
      req.session.User = user;
      user.online = true;

      user.save(function(err, next){
        if (err) return next(err);
        User.publishUpdate(user.id, { online: true, id: user.id });
        if (user.admin){
          res.redirect('/user');
          return;
        }
        res.redirect('/user/show/' + user.id);
      });
    });
  },

  destroy: function(req, res, next){
    User.findOne(req.session.User.id, function foundOne(err,user){
      User.update(user.id, { online: false, admin: user.admin }, function (err){
        if (err) return next(err);
        User.publishUpdate(user.id, { online: false, id: user.id });
        req.session.destroy();
        res.redirect('/session/new');
      });
    });
  }
};

