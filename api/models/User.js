/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {
    name: {
      type: 'string',
      required: true
    },

    title: {
      type: 'string'
    },

    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },

    encryptedPassword: {
      type: 'string'
    },

    online: {
      type: 'boolean',
      defaultsTo: false
    },

    admin: {
      type: 'boolean',
      defaultsTo: false
    }

  },

  toSocketJson: function(userId){
    User.findOne(userId, function(err, user){
      if (err) return {};
      return {name: user.name, email: user.email, title: user.title, online: user.online, admin: user.admin};
    });
  },

  beforeUpdate: function(values, next){
    if (values.admin !== undefined || values.admin) {
      values.admin = true;
    } else {
      console.log('Do not go there!!!!!!!!!!!!!!!!!');
      values.admin = false;
    }
    next();
  },

  beforeCreate: function(values, next){
    if (!values.password || values.password != values.confirmation) {
      return next({error: ["Password doesn\'t match password confirmation."]})
    }

    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword){
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });
  }
};

