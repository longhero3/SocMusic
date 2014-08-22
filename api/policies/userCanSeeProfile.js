module.exports = function(req, res, next){
  var sessionUserMatchesId = req.session.User.id === req.param('id');
  var isAdmin = req.session.User.admin;

  if (!(sessionUserMatchesId || isAdmin)){
    var unthorizedError = [{name: 'UnthorizedError', message: 'You must be an admin'}];
    req.session.flash = {
      err: unthorizedError
    }

    res.redirect('/session/new');
    return;
  }

  next();
}